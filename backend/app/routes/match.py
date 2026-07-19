"""POST /api/match — thin route: validate profile, run pipeline, wrap envelope."""

from fastapi import APIRouter, Request

from app.config import load_spec
from app.llm.groq_client import LLMBadJSONError, LLMUnavailableError
from app.models.profile import Profile
from app.models.responses import error_response, success_response
from app.rate_limit import limiter
from app.services import matching_service

router = APIRouter()

_match_rpm = load_spec("limits")["match_rpm"]


@router.post("/api/match")
@limiter.limit(f"{_match_rpm}/minute")
def match(request: Request, profile: Profile):
    try:
        result = matching_service.run_match(profile)
    except (LLMUnavailableError, LLMBadJSONError):
        return error_response("AI_UNAVAILABLE", 503)
    return success_response(result)
