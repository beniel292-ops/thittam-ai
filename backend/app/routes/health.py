"""Liveness endpoint — used by cron-job.org keep-alive on Render free tier."""

from fastapi import APIRouter

from app.config import load_spec
from app.models.responses import success_response

router = APIRouter()


@router.get("/api/health")
async def health():
    models = load_spec("models")
    return success_response({"status": "ok", "model": models["primary"]})
