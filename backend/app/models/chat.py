"""Chat request model. Length caps come from specs/limits.json (loaded at
import — they are business rules, not code constants). Unknown fields are
rejected. The optional profile lets the AI personalise grounded answers."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.config import load_spec
from app.models.profile import Profile

_limits = load_spec("limits")


class ChatTurn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=_limits["max_question_chars"])


class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    scheme_id: str = Field(min_length=32, max_length=40)
    language: Literal["ta", "en"]
    question: str = Field(min_length=1, max_length=_limits["max_question_chars"])
    history: list[ChatTurn] = Field(
        default_factory=list, max_length=_limits["max_history_turns"]
    )
    profile: Profile | None = None
