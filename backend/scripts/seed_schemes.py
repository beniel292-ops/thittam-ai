"""Seed the schemes table from app/specs/schemes_seed.json.

Idempotent: upserts on slug, so re-running updates rather than duplicates.
Usage (from backend/): python scripts/seed_schemes.py
Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env.
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.supabase_client import get_client  # noqa: E402

SEED_FILE = Path(__file__).resolve().parents[1] / "app" / "specs" / "schemes_seed.json"


def main() -> None:
    schemes = json.loads(SEED_FILE.read_text(encoding="utf-8"))
    print(f"Seeding {len(schemes)} schemes from {SEED_FILE.name} ...")
    client = get_client()
    result = client.table("schemes").upsert(schemes, on_conflict="slug").execute()
    print(f"Done. Upserted {len(result.data)} rows.")
    central = sum(1 for s in result.data if s["level"] == "central")
    tn = sum(1 for s in result.data if s["level"] == "tn")
    print(f"Levels: {central} central, {tn} tn")


if __name__ == "__main__":
    main()
