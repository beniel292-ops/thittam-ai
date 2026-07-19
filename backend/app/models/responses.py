"""Uniform JSON response envelopes.

Success: {"success": true, "data": {...}}
Error:   {"success": false, "error": {"code", "message_en", "message_ta"}}

Errors are bilingual because the frontend shows them to citizens directly.
These are presentation strings (the backend counterpart of frontend i18n.js),
not business rules, so they live here rather than in /specs.
"""

from fastapi.responses import JSONResponse

# code -> (message_en, message_ta)
ERROR_MESSAGES = {
    "NOT_FOUND": (
        "We could not find that scheme.",
        "அந்தத் திட்டத்தைக் கண்டறிய முடியவில்லை.",
    ),
    "VALIDATION_ERROR": (
        "Some of the information sent was invalid. Please try again.",
        "அனுப்பிய தகவலில் பிழை உள்ளது. மீண்டும் முயற்சிக்கவும்.",
    ),
    "RATE_LIMITED": (
        "Too many requests. Please wait a minute and try again.",
        "அதிக கோரிக்கைகள். ஒரு நிமிடம் காத்திருந்து மீண்டும் முயற்சிக்கவும்.",
    ),
    "AI_UNAVAILABLE": (
        "The AI service is busy right now. Please try again in a moment.",
        "AI சேவை தற்போது பரபரப்பாக உள்ளது. சிறிது நேரம் கழித்து முயற்சிக்கவும்.",
    ),
    "SERVER_ERROR": (
        "Something went wrong on our side. Please try again.",
        "எங்கள் தரப்பில் ஏதோ தவறு நடந்துள்ளது. மீண்டும் முயற்சிக்கவும்.",
    ),
}


def success_response(data, status_code: int = 200) -> JSONResponse:
    """Wrap payload in the success envelope."""
    return JSONResponse(status_code=status_code, content={"success": True, "data": data})


def error_response(code: str, status_code: int) -> JSONResponse:
    """Build a bilingual error envelope from a known error code."""
    message_en, message_ta = ERROR_MESSAGES.get(code, ERROR_MESSAGES["SERVER_ERROR"])
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {"code": code, "message_en": message_en, "message_ta": message_ta},
        },
    )
