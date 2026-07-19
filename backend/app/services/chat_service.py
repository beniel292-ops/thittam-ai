"""Grounded scheme chat.

The system prompt injects ONE scheme's stored record as the model's only
knowledge source, plus the citizen profile for personalisation and the
selected language. History (≤ max_history_turns, sent by the stateless
frontend) is replayed as normal turns. When the answer is not in the data,
the model must reply with the exact bilingual refusal from specs/prompts.json;
we detect that sentence to set the grounded flag. With 40 curated schemes,
structured retrieval by ID replaces a vector store.
"""

import json
import logging
import time

from app.config import load_spec
from app.db import queries
from app.llm.groq_client import call_llm
from app.models.chat import ChatRequest

logger = logging.getLogger("thittam.chat")

LANGUAGE_NAMES = {"en": "English", "ta": "Tamil"}

# Scheme columns the model needs — internal fields stay out of the prompt.
PROMPT_FIELDS = [
    "name_en", "name_ta", "level", "category", "benefit_en", "benefit_ta",
    "eligibility_rules", "min_age", "max_age", "gender", "states",
    "max_income", "social_category", "documents_en", "documents_ta",
    "how_to_apply_en", "how_to_apply_ta", "official_link",
]


class SchemeNotFoundError(Exception):
    """scheme_id does not exist in the database."""


def run_chat(request: ChatRequest) -> dict:
    """Answer one question grounded on one scheme's data; log the turn."""
    start = time.perf_counter()

    scheme = queries.get_scheme_by_id(request.scheme_id)
    if scheme is None:
        raise SchemeNotFoundError(request.scheme_id)

    prompts = load_spec("prompts")
    models = load_spec("models")
    limits = load_spec("limits")

    refusal = prompts[f"not_in_data_response_{request.language}"]
    system_prompt = prompts["chat_system_template"].format(
        scheme_json=json.dumps(
            {field: scheme[field] for field in PROMPT_FIELDS}, ensure_ascii=False
        ),
        profile_json=json.dumps(
            request.profile.model_dump() if request.profile else {},
            ensure_ascii=False,
        ),
        language_name=LANGUAGE_NAMES[request.language],
        not_in_data_response=refusal,
    )

    history = request.history[-limits["max_history_turns"]:]
    messages = (
        [{"role": "system", "content": system_prompt}]
        + [{"role": turn.role, "content": turn.content} for turn in history]
        + [{"role": "user", "content": request.question}]
    )

    answer = call_llm(
        messages=messages,
        temperature=models["temperature_chat"],
        max_tokens=models["max_tokens_chat"],
    ).strip()

    grounded = refusal not in answer
    latency_ms = int((time.perf_counter() - start) * 1000)

    try:
        queries.insert_chat_log(
            scheme_id=scheme["id"],
            language=request.language,
            question=request.question,
            answer=answer,
            grounded=grounded,
            latency_ms=latency_ms,
        )
    except Exception:
        logger.exception("Failed to log chat turn")

    return {"answer": answer, "grounded": grounded, "latency_ms": latency_ms}
