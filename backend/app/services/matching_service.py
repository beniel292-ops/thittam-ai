"""The AI matching pipeline: SQL hard filter -> LLM reasoning -> merge.

Stage 1 (deterministic): hard_filter_schemes() compares numbers and enums in
SQL — the LLM is never asked to compare numbers SQL can compare.
Stage 2 (LLM): the candidates' full textual eligibility_rules go to Groq,
which judges nuanced conditions and returns strict JSON verdicts.
Stage 3: verdicts are validated, joined with full DB records, sorted by
confidence + rank, and the run is logged to match_requests.

Zero-match handling: deterministic "closest miss" computation — schemes with
the fewest hard-filter violations, each annotated with what blocked them.
"""

import json
import logging
import time

from app.config import load_spec
from app.db import queries
from app.llm.groq_client import call_llm_json
from app.models.profile import Profile

logger = logging.getLogger("thittam.matching")


def run_match(profile: Profile) -> dict:
    """Execute the full pipeline and return matches + closest misses."""
    start = time.perf_counter()
    matching = load_spec("matching")

    candidates = queries.hard_filter_schemes(
        state=profile.state,
        gender=profile.gender,
        social_category=profile.social_category,
        age=profile.age,
        income=profile.annual_income,
        limit=matching["candidate_limit"],
    )
    logger.info("Hard filter: %d candidates", len(candidates))

    matches = []
    if candidates:
        verdicts = _llm_verdicts(profile, candidates)
        matches = _merge(verdicts, candidates, matching)

    closest_misses = []
    if not matches:
        closest_misses = _closest_misses(profile, candidates, matching)

    latency_ms = int((time.perf_counter() - start) * 1000)
    _log_run(profile, matches, latency_ms)

    return {
        "matches": matches,
        "match_count": len(matches),
        "closest_misses": closest_misses,
        "latency_ms": latency_ms,
    }


def build_schemes_block(candidates: list[dict]) -> str:
    """Compact textual block of candidates for the LLM prompt."""
    parts = []
    for scheme in candidates:
        parts.append(
            f"scheme_id: {scheme['slug']}\n"
            f"name: {scheme['name_en']}\n"
            f"benefit: {scheme['benefit_en']}\n"
            f"eligibility_rules: {scheme['eligibility_rules']}"
        )
    return "\n---\n".join(parts)


def _llm_verdicts(profile: Profile, candidates: list[dict]) -> list[dict]:
    """Ask the LLM to judge candidates; return validated verdict dicts."""
    prompts = load_spec("prompts")
    models = load_spec("models")

    user_message = prompts["match_user_template"].format(
        profile_json=json.dumps(profile.model_dump(), ensure_ascii=False),
        schemes_block=build_schemes_block(candidates),
    )
    raw = call_llm_json(
        messages=[
            {"role": "system", "content": prompts["match_system"]},
            {"role": "user", "content": user_message},
        ],
        temperature=models["temperature_match"],
        max_tokens=models["max_tokens_match"],
    )
    return validate_verdicts(raw, {c["slug"] for c in candidates})


def validate_verdicts(raw: dict, valid_ids: set[str]) -> list[dict]:
    """Keep only well-formed yes/likely verdicts referring to real candidates.

    The model returns a verdict for EVERY candidate (including explicit
    'no's) so it cannot silently skip schemes; the 'no's are dropped here
    by design, not as malformed output.
    """
    verdicts = raw.get("verdicts", []) if isinstance(raw, dict) else []
    verdicts = [v for v in verdicts
                if not (isinstance(v, dict) and v.get("eligible") == "no")]
    clean = []
    for v in verdicts:
        if not isinstance(v, dict):
            continue
        if v.get("scheme_id") not in valid_ids:
            continue
        if v.get("eligible") not in ("yes", "likely"):
            continue
        if not isinstance(v.get("reason_en"), str) or not isinstance(v.get("reason_ta"), str):
            continue
        if not isinstance(v.get("rank"), int):
            v["rank"] = len(clean) + 1
        clean.append(v)
    dropped = len(verdicts) - len(clean)
    if dropped:
        logger.warning("Dropped %d malformed LLM verdicts", dropped)
    return clean


def _merge(verdicts: list[dict], candidates: list[dict], matching: dict) -> list[dict]:
    """Join verdicts with full DB records; sort by confidence weight + rank."""
    by_slug = {c["slug"]: c for c in candidates}
    weights = matching["rank_weights"]
    labels = matching["confidence_labels"]

    merged = []
    for v in sorted(verdicts, key=lambda v: (weights.get(v["eligible"], 999), v["rank"])):
        scheme = by_slug[v["scheme_id"]]
        merged.append({
            **scheme,
            "eligible": v["eligible"],
            "confidence_label": labels[v["eligible"]],
            "reason_en": v["reason_en"],
            "reason_ta": v["reason_ta"],
            "rank": v["rank"],
        })
    return merged


def _violations(scheme: dict, profile: Profile) -> list[dict]:
    """Deterministic list of hard constraints this scheme fails for the profile."""
    found = []
    if scheme["states"] == "TN" and profile.state != "TN":
        found.append({"field": "state", "required": "TN"})
    if scheme["gender"] != "all" and scheme["gender"] != profile.gender:
        found.append({"field": "gender", "required": scheme["gender"]})
    if scheme["social_category"] != "all" and scheme["social_category"] != profile.social_category:
        found.append({"field": "social_category", "required": scheme["social_category"]})
    if scheme["min_age"] is not None and profile.age < scheme["min_age"]:
        found.append({"field": "min_age", "required": scheme["min_age"]})
    if scheme["max_age"] is not None and profile.age > scheme["max_age"]:
        found.append({"field": "max_age", "required": scheme["max_age"]})
    if scheme["max_income"] is not None and profile.annual_income > scheme["max_income"]:
        found.append({"field": "max_income", "required": scheme["max_income"]})
    return found


def _closest_misses(profile: Profile, candidates: list[dict], matching: dict) -> list[dict]:
    """Zero-match fallback: nearest schemes + what blocked each.

    Two sources, in priority order:
    1. Candidates that passed the hard filter but were rejected by the LLM —
       blocked on detailed textual rules.
    2. Schemes that failed the hard filter, ranked by fewest violations.
    """
    count = matching["closest_miss_count"]
    misses = []

    for scheme in candidates[:count]:
        misses.append({**scheme, "blocked_on": [{"field": "detailed_rules"}]})

    if len(misses) < count:
        remaining = count - len(misses)
        candidate_slugs = {c["slug"] for c in candidates}
        scored = []
        for scheme in queries.list_schemes():
            if scheme["slug"] in candidate_slugs:
                continue
            violations = _violations(scheme, profile)
            if violations:
                scored.append((len(violations), scheme, violations))
        scored.sort(key=lambda item: item[0])
        for _, scheme, violations in scored[:remaining]:
            misses.append({**scheme, "blocked_on": violations})

    return misses


def _log_run(profile: Profile, matches: list[dict], latency_ms: int) -> None:
    """Log the run; a logging failure must never break the citizen's request."""
    try:
        queries.insert_match_request(
            profile=profile.model_dump(),
            matched_ids=[m["id"] for m in matches],
            match_count=len(matches),
            latency_ms=latency_ms,
        )
    except Exception:
        logger.exception("Failed to log match request")
