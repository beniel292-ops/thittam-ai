"""Regenerate scripts/seed_data.sql from app/specs/schemes_seed.json.

schemes_seed.json is the single source of truth for scheme data.
seed_data.sql exists so seeding can happen with one paste in the Supabase
SQL editor (no local Python needed). seed_schemes.py does the same via
the API for environments with network access.

Usage (from backend/): python scripts/generate_seed_sql.py
"""

import json
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[1]
SEED_JSON = BACKEND / "app" / "specs" / "schemes_seed.json"
SEED_SQL = BACKEND / "scripts" / "seed_data.sql"

COLS = [
    "slug", "name_en", "name_ta", "level", "category", "benefit_en", "benefit_ta",
    "eligibility_rules", "min_age", "max_age", "gender", "states", "max_income",
    "social_category", "documents_en", "documents_ta", "how_to_apply_en",
    "how_to_apply_ta", "official_link",
]


def sql_literal(value) -> str:
    """Render a JSON value as a safe SQL literal (single-quote escaped)."""
    if value is None:
        return "null"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, (list, dict)):
        return "'" + json.dumps(value, ensure_ascii=False).replace("'", "''") + "'::jsonb"
    return "'" + str(value).replace("'", "''") + "'"


def main() -> None:
    schemes = json.loads(SEED_JSON.read_text(encoding="utf-8"))
    rows = ["(" + ", ".join(sql_literal(s[c]) for c in COLS) + ")" for s in schemes]
    sql = (
        "-- Thittam AI — seed data. AUTO-GENERATED from app/specs/schemes_seed.json\n"
        "-- (single source of truth). Regenerate with scripts/generate_seed_sql.py.\n"
        "-- Run AFTER create_tables.sql. Idempotent: upserts on slug.\n\n"
        "insert into schemes (" + ", ".join(COLS) + ") values\n"
        + ",\n".join(rows)
        + "\non conflict (slug) do update set\n"
        + ",\n".join(f"  {c} = excluded.{c}" for c in COLS if c != "slug")
        + ";\n\nselect level, count(*) from schemes group by level;\n"
    )
    SEED_SQL.write_text(sql, encoding="utf-8")
    print(f"Wrote {SEED_SQL.name}: {len(schemes)} schemes")


if __name__ == "__main__":
    main()
