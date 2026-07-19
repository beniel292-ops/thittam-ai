"""Shared slowapi limiter instance (per-client-IP). Limits themselves come
from app/specs/limits.json — routes read them there, never hardcode."""

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
