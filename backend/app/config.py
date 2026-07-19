"""Central configuration: environment variables and /specs business rules.

Every business value (models, limits, prompts, matching rules) is loaded
from JSON files in app/specs — never hardcoded in code. Secrets come only
from environment variables (.env locally, dashboard vars on Render).
"""

import json
import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

SPECS_DIR = Path(__file__).parent / "specs"


@lru_cache(maxsize=None)
def load_spec(name: str) -> dict:
    """Load and cache a spec file from app/specs (e.g. load_spec('limits'))."""
    path = SPECS_DIR / f"{name}.json"
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def get_env(name: str, default: str | None = None) -> str:
    """Read an environment variable; raise clearly if a required one is missing."""
    value = os.getenv(name, default)
    if value is None:
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            f"Add it to backend/.env (see .env.example)."
        )
    return value


def allowed_origins() -> list[str]:
    """CORS allowlist from ALLOWED_ORIGINS (comma-separated)."""
    raw = get_env("ALLOWED_ORIGINS", "http://localhost:3000")
    return [origin.strip() for origin in raw.split(",") if origin.strip()]
