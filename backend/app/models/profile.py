"""Citizen profile — the 8 wizard answers. Strict validation: enums only,
numeric ranges enforced, unknown fields rejected. No free text, no PII."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

SpecialStatus = Literal[
    "student", "farmer", "widow", "disabled", "pregnant", "first_gen_graduate"
]


class Profile(BaseModel):
    model_config = ConfigDict(extra="forbid")

    age: int = Field(ge=1, le=100)
    gender: Literal["female", "male", "other"]
    state: Literal["TN", "OTHER"]
    area: Literal["rural", "urban"]
    occupation: Literal[
        "student", "farmer", "daily_wage", "self_employed",
        "salaried", "homemaker", "unemployed", "other",
    ]
    annual_income: int = Field(ge=0, le=10_000_000)
    social_category: Literal["general", "obc", "sc_st", "ews", "minority"]
    special_statuses: list[SpecialStatus] = Field(default_factory=list, max_length=6)
