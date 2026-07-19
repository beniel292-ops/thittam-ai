"""Public scheme catalog routes. Thin: validate, call service, wrap envelope."""

from fastapi import APIRouter, Query, Request

from app.config import load_spec
from app.models.responses import error_response, success_response
from app.services import scheme_service
from app.rate_limit import limiter

router = APIRouter()

_read_rpm = load_spec("limits")["read_rpm"]


@router.get("/api/schemes")
@limiter.limit(f"{_read_rpm}/minute")
def get_schemes(request: Request, category: str | None = Query(default=None, max_length=30)):
    return success_response(scheme_service.get_catalog(category))


@router.get("/api/schemes/{slug}")
@limiter.limit(f"{_read_rpm}/minute")
def get_scheme(request: Request, slug: str):
    scheme = scheme_service.get_scheme(slug)
    if scheme is None:
        return error_response("NOT_FOUND", 404)
    return success_response({"scheme": scheme})
