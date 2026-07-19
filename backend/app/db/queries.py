"""All database reads/writes. The only module (besides supabase_client)
that touches Supabase. Services call these functions; routes never do."""

from app.db.supabase_client import get_client

SCHEMES_TABLE = "schemes"
MATCH_REQUESTS_TABLE = "match_requests"
CHAT_LOGS_TABLE = "chat_logs"


def list_schemes(category: str | None = None) -> list[dict]:
    """Return all schemes, optionally filtered by category, ordered by name."""
    query = get_client().table(SCHEMES_TABLE).select("*").order("name_en")
    if category:
        query = query.eq("category", category)
    return query.execute().data


def get_scheme_by_slug(slug: str) -> dict | None:
    """Return one full scheme record by slug, or None if absent."""
    rows = get_client().table(SCHEMES_TABLE).select("*").eq("slug", slug).limit(1).execute().data
    return rows[0] if rows else None


def get_scheme_by_id(scheme_id: str) -> dict | None:
    """Return one full scheme record by uuid, or None if absent."""
    rows = get_client().table(SCHEMES_TABLE).select("*").eq("id", scheme_id).limit(1).execute().data
    return rows[0] if rows else None


def hard_filter_schemes(state: str, gender: str, social_category: str,
                        age: int, income: int, limit: int) -> list[dict]:
    """Deterministic SQL pre-filter of the matching pipeline.

    Keeps schemes where every structured constraint is satisfied or absent
    (NULL). Nuanced textual rules are left to the LLM stage. All inputs are
    pydantic-validated enums/ints, so interpolation into PostgREST or-filters
    is safe.
    """
    states = ["ALL", "TN"] if state == "TN" else ["ALL"]
    genders = ["all", gender] if gender in ("female", "male") else ["all"]
    categories = ["all", social_category] if social_category != "general" else ["all"]

    query = (
        get_client().table(SCHEMES_TABLE).select("*")
        .in_("states", states)
        .in_("gender", genders)
        .in_("social_category", categories)
        .or_(f"min_age.is.null,min_age.lte.{age}")
        .or_(f"max_age.is.null,max_age.gte.{age}")
        .or_(f"max_income.is.null,max_income.gte.{income}")
        .order("states", desc=True)  # 'TN' > 'ALL': state-specific schemes first
        .order("name_en")
        .limit(limit)
    )
    return query.execute().data


def insert_match_request(profile: dict, matched_ids: list[str],
                         match_count: int, latency_ms: int) -> None:
    """Log one matching run (profile has no PII — enums and numbers only)."""
    get_client().table(MATCH_REQUESTS_TABLE).insert({
        "profile": profile,
        "matched_ids": matched_ids,
        "match_count": match_count,
        "latency_ms": latency_ms,
    }).execute()


def insert_chat_log(scheme_id: str, language: str, question: str,
                    answer: str, grounded: bool, latency_ms: int) -> None:
    """Log one grounded-chat turn."""
    get_client().table(CHAT_LOGS_TABLE).insert({
        "scheme_id": scheme_id,
        "language": language,
        "question": question,
        "answer": answer,
        "grounded": grounded,
        "latency_ms": latency_ms,
    }).execute()
