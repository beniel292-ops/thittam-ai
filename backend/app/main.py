"""Thittam AI backend — FastAPI app factory, middleware, error envelope.

Layering (strict): routes -> services -> db / llm.
Routes never import supabase or groq; this module only wires things together.
"""

import logging
import time

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import allowed_origins
from app.models.responses import error_response
from app.rate_limit import limiter
from app.routes import chat, health, match, schemes

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("thittam")

app = FastAPI(title="Thittam AI API", docs_url=None, redoc_url=None)
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def security_headers_and_logging(request: Request, call_next):
    """Add security headers and log method/path/status/latency (never bodies,
    never secrets)."""
    start = time.perf_counter()
    response = await call_next(request)
    latency_ms = int((time.perf_counter() - start) * 1000)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    logger.info("%s %s -> %s (%dms)", request.method, request.url.path, response.status_code, latency_ms)
    return response


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return error_response("RATE_LIMITED", 429)


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return error_response("VALIDATION_ERROR", 422)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    code = "NOT_FOUND" if exc.status_code == 404 else "SERVER_ERROR"
    return error_response(code, exc.status_code)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return error_response("SERVER_ERROR", 500)


app.include_router(health.router)
app.include_router(schemes.router)
app.include_router(match.router)
app.include_router(chat.router)
