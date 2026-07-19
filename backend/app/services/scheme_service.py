"""Scheme catalog service: read-only access to the schemes table."""

from app.db import queries

VALID_CATEGORIES = {
    "education",
    "agriculture",
    "women_child",
    "health",
    "housing",
    "employment",
    "pension",
    "business",
    "social_security",
}


def get_catalog(category: str | None = None) -> dict:
    """Return the public scheme catalog, optionally filtered by category.

    An unknown category simply yields an empty list (not an error) so the
    frontend can render a friendly empty state.
    """
    if category is not None and category not in VALID_CATEGORIES:
        return {"schemes": [], "count": 0}
    schemes = queries.list_schemes(category)
    return {"schemes": schemes, "count": len(schemes)}


def get_scheme(slug: str) -> dict | None:
    """Return one full scheme record by slug, or None."""
    return queries.get_scheme_by_slug(slug)
