"""Groq API client — the only module that talks to the LLM.

Behaviour (all values from /specs, nothing hardcoded):
- per-request timeout: matching.llm_timeout_s
- retry_attempts tries on the primary model for 429 / 5xx / timeouts,
  then the same number of tries on the fallback model
- call_llm_json(): JSON-mode request; strips markdown fences; on invalid
  JSON re-asks once with the error before raising LLMBadJSONError.
"""

import json
import logging
import time

import httpx

from app.config import get_env, load_spec

logger = logging.getLogger("thittam.llm")

GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"


class LLMUnavailableError(Exception):
    """Both models failed (rate-limited, erroring, or timing out)."""


class LLMBadJSONError(Exception):
    """Model produced unparseable JSON even after one corrective re-ask."""


def call_llm(messages: list[dict], temperature: float, max_tokens: int,
             json_mode: bool = False) -> str:
    """Call Groq chat completions with retry + model fallback; return content."""
    models = load_spec("models")
    matching = load_spec("matching")
    timeout = matching["llm_timeout_s"]
    attempts = matching["retry_attempts"]

    payload = {
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
    headers = {"Authorization": f"Bearer {get_env('GROQ_API_KEY')}"}

    backoff = matching["retry_backoff_s"]
    first_try = True
    for model in (models["primary"], models["fallback"]):
        for attempt in range(1, attempts + 1):
            if not first_try:
                time.sleep(backoff)  # give rate limits room before retrying
            first_try = False
            try:
                response = httpx.post(
                    GROQ_CHAT_URL,
                    json={**payload, "model": model},
                    headers=headers,
                    timeout=timeout,
                )
                if response.status_code == 429 or response.status_code >= 500:
                    logger.warning("LLM %s attempt %d -> HTTP %d", model, attempt,
                                   response.status_code)
                    continue
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except httpx.TimeoutException:
                logger.warning("LLM %s attempt %d -> timeout after %ss", model,
                               attempt, timeout)
            except httpx.HTTPError as exc:
                logger.warning("LLM %s attempt %d -> %s", model, attempt,
                               type(exc).__name__)
    raise LLMUnavailableError("All models and retries exhausted")


def _strip_fences(text: str) -> str:
    """Remove markdown code fences some models wrap around JSON."""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else ""
        if text.rstrip().endswith("```"):
            text = text.rstrip()[:-3]
    return text.strip()


def call_llm_json(messages: list[dict], temperature: float, max_tokens: int) -> dict:
    """Call the LLM expecting a strict JSON object; re-ask once on bad JSON."""
    content = call_llm(messages, temperature, max_tokens, json_mode=True)
    try:
        return json.loads(_strip_fences(content))
    except json.JSONDecodeError as first_error:
        logger.warning("LLM returned invalid JSON, re-asking once: %s", first_error)
        retry_messages = messages + [
            {"role": "assistant", "content": content},
            {"role": "user", "content": (
                "Your previous reply was not valid JSON "
                f"({first_error}). Reply again with ONLY the valid JSON object, "
                "no markdown, no commentary."
            )},
        ]
        content = call_llm(retry_messages, temperature, max_tokens, json_mode=True)
        try:
            return json.loads(_strip_fences(content))
        except json.JSONDecodeError as second_error:
            raise LLMBadJSONError(str(second_error)) from second_error
