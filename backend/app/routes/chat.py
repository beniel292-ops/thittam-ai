"""POST /api/chat — thin route: validate, call chat service, wrap envelope."""

from fastapi import APIRouter, Request

from app.config import load_spec
from app.llm.groq_client import LLMBadJSONError, LLMUnavailableError
from app.models.chat import ChatRequest
from app.models.responses import error_response, success_response
from app.rate_limit import limiter
from app.services import chat_service
from app.services.chat_service import SchemeNotFoundError

router = APIRouter()

_chat_rpm = load_spec("limits")["chat_rpm"]


@router.post("/api/chat")
@limiter.limit(f"{_chat_rpm}/minute")
def chat(request: Request, body: ChatRequest):
    try:
        result = chat_service.run_chat(body)
    except SchemeNotFoundError:
        return error_response("NOT_FOUND", 404)
    except (LLMUnavailableError, LLMBadJSONError):
        return error_response("AI_UNAVAILABLE", 503)
    return success_response(result)
