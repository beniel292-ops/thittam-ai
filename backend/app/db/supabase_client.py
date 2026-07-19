"""Singleton Supabase client. This module (and queries.py) are the ONLY
places allowed to import supabase — routes and services never do."""

from functools import lru_cache

from supabase import Client, create_client

from app.config import get_env


@lru_cache(maxsize=1)
def get_client() -> Client:
    """Create (once) and return the Supabase client using the service role key."""
    return create_client(get_env("SUPABASE_URL"), get_env("SUPABASE_SERVICE_KEY"))
