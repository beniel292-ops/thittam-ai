"""Phase 2 integration test — run on a machine with real network access.

Prereqs: tables created + seeded in Supabase; backend running locally:
    python -m uvicorn app.main:app --port 8000
Then:   python scripts/test_phase2.py

Runs the three spec profiles (student / farmer / high-income urban) and
repeats the student profile 5 times to catch LLM JSON drift.
"""

import json
import time
import urllib.request

BASE = "http://127.0.0.1:8000"

PROFILES = {
    "(a) 20F TN rural student 1.5L OBC first-gen": {
        "age": 20, "gender": "female", "state": "TN", "area": "rural",
        "occupation": "student", "annual_income": 150000,
        "social_category": "obc", "special_statuses": ["student", "first_gen_graduate"],
    },
    "(b) 45M TN rural farmer 80k general": {
        "age": 45, "gender": "male", "state": "TN", "area": "rural",
        "occupation": "farmer", "annual_income": 80000,
        "social_category": "general", "special_statuses": ["farmer"],
    },
    "(c) 30M TN urban salaried 12L general": {
        "age": 30, "gender": "male", "state": "TN", "area": "urban",
        "occupation": "salaried", "annual_income": 1200000,
        "social_category": "general", "special_statuses": [],
    },
}


def post_match(profile: dict) -> dict:
    req = urllib.request.Request(
        f"{BASE}/api/match",
        data=json.dumps(profile).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as exc:
        try:
            return json.load(exc)
        except Exception:
            return {"success": False, "error": {"code": f"HTTP {exc.code}"}}


def summarise(label: str, body: dict) -> None:
    if body.get("success") is not True:
        print(f"\n=== {label}\nFAILED: {body.get('error')}")
        return
    data = body.get("data", {})
    matches = data.get("matches", [])
    misses = data.get("closest_misses", [])
    print(f"\n=== {label}")
    print(f"success={body.get('success')} matches={len(matches)} "
          f"closest_misses={len(misses)} latency={data.get('latency_ms')}ms")
    for m in matches:
        print(f"  [{m['eligible']:6}] #{m['rank']} {m['slug']}: {m['reason_en'][:80]}")
    for miss in misses:
        blocked = ",".join(b["field"] for b in miss["blocked_on"])
        print(f"  [miss  ] {miss['slug']} blocked_on={blocked}")


def main() -> None:
    for label, profile in PROFILES.items():
        summarise(label, post_match(profile))
        time.sleep(8)  # breathe between calls — Groq free tier is token-rate-limited

    print("\n=== JSON drift check: student profile x5")
    for i in range(5):
        start = time.time()
        body = post_match(PROFILES["(a) 20F TN rural student 1.5L OBC first-gen"])
        n = len(body.get("data", {}).get("matches", []))
        ok = body.get("success") is True and n > 0
        print(f"  run {i + 1}: success={body.get('success')} matches={n} "
              f"({time.time() - start:.1f}s) {'OK' if ok else 'FAIL'}")
        time.sleep(8)


if __name__ == "__main__":
    main()
