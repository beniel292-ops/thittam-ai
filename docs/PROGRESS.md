# Thittam AI — Build Progress Report

**Project:** AI welfare-scheme eligibility assistant (Tamil + English) for Idea2Impact 2026, Theme 1: Sustainability & Social Impact.
**What it does:** a citizen answers 8 tap-only questions; a two-stage AI pipeline (SQL hard filter → Groq LLM reasoning) checks 40 central + Tamil Nadu schemes and explains, in plain Tamil or English, which ones they qualify for and why; each matched scheme has a chat grounded strictly on verified scheme data.
**Stack:** Next.js 14 (JS + Tailwind) on Vercel · FastAPI (Python 3.11) on Render · Supabase Postgres · Groq (llama-3.3-70b, 8b-instant fallback). No login, no vector DB, no ORM — deliberately.

---

## Phase 1 — Foundation + Data ✅

**Built:**
- **Database schema** (`create_tables.sql`): 3 tables — `schemes` (40 scheme records with bilingual names, benefits, textual eligibility rules, structured filter columns, documents, official links), `match_requests` (anonymous analytics log), `chat_logs`. Row Level Security ON with zero anon policies — only the backend's service key can touch data.
- **Seed data**: 40 real schemes — 25 central (PM-Kisan, Ayushman Bharat, Mudra, scholarships, pensions…) + 15 Tamil Nadu (Pudhumai Penn, Kalaignar Magalir Urimai Thogai, CMCHIS, first-graduate concession…), every record bilingual. Also generated `seed_data.sql` from the JSON so seeding was one paste in the Supabase SQL editor.
- **FastAPI skeleton**: uniform response envelope (`{success, data}` / bilingual errors), CORS allowlist, security headers, request logging, per-IP rate limiting, and 3 endpoints: `/api/health`, `/api/schemes`, `/api/schemes/{slug}`.
- Secrets: `.env` gitignored from the first commit; `.env.example` provided.

**Verified:** health endpoint returned the correct envelope live; seed validated programmatically (40 records, 25+15, unique slugs, all enums legal). Beni created + seeded the Supabase tables.

**Issues hit & fixed:** the first keys supplied were wrong (anon key instead of service_role; an xAI key instead of Groq) — corrected. Seed initially had 41 schemes — trimmed to exactly 40. The dev sandbox's firewall blocks Supabase/Groq, so integration tests were moved to Beni's machine.

---

## Phase 2 — AI Matching Engine ✅ (code + offline tests; live run pending)

**Built:**
- **Groq client** (`llm/groq_client.py`): 20s timeout, 2 retry attempts on 429/5xx/timeout, automatic fallback from llama-3.3-70b-versatile to llama-3.1-8b-instant, JSON mode, markdown-fence stripping, one corrective re-ask on invalid JSON.
- **Matching pipeline** (`services/matching_service.py`):
  1. **SQL hard filter** — state, gender, social category, age, income compared deterministically in the database (the LLM is never asked to compare numbers). 40 → ~10–20 candidates.
  2. **LLM reasoning** — candidates' full textual eligibility rules + the profile go to Groq; it returns strict JSON verdicts: eligible ("yes"/"likely"), bilingual reasons, rank.
  3. **Merge** — verdicts validated (fake scheme IDs, bad labels, broken ranks dropped/repaired), joined with DB records, sorted Eligible-first, logged to `match_requests`.
- **Zero-match fallback**: deterministic "closest miss" — the 3 nearest schemes, each tagged with exactly which condition blocked it (income limit, age, state…).
- **Strict input validation** (`models/profile.py`): enums only, age 1–100, income ≤ ₹1 crore, unknown fields rejected.
- **`POST /api/match`** at 10 requests/min per IP; all business values (prompts, model names, temperatures, limits, confidence labels) live in `specs/*.json` — zero hardcoding.

**Verified offline:** JSON-fence parsing; verdict validation against adversarial input; violation logic against real seed data (e.g. ₹12L urban male correctly blocked from CMCHIS on income, from Pudhumai Penn on gender); live server rejected an unknown field and age=150 with bilingual errors.
**Pending:** `python scripts/test_phase2.py` on Beni's machine — 3 spec profiles + 5-run JSON-drift check (sandbox cannot reach Groq/Supabase).

---

## Phase 3 — Frontend Core Flow ✅

**Built:**
- **Landing** — name, bilingual pitch, Tamil/English toggle (persists; entire UI switches instantly), CTA, 3-step how-it-works, persistent disclaimer footer.
- **/check wizard** — 8 questions, one at a time, 100% tap-only: age stepper (−10/−1/+1/+10), auto-advancing option buttons, multi-select special statuses, progress bar, back button, summary card with per-answer Edit, then submit.
- **Loading experience** — full-screen overlay with rotating bilingual status messages (matching takes 5–15s).
- **/results** — ranked cards: bilingual name, benefit, confidence badge (Eligible green / Likely amber), AI's "why you qualify" in the chosen language, expandable documents + how-to-apply, official link (new tab), "Ask about this scheme" button. Zero-match state shows closest misses with red "blocked by" chips. Refresh-safe via sessionStorage; empty state redirects to /check.
- **i18n.js** — ~90 UI strings, all in both languages; components contain zero hardcoded text. Income asked as 7 bands whose boundaries align exactly with the seeded income thresholds.

**Verified:** `next build` compiled clean — 6/6 pages, all under 100 kB JS. Browser walkthrough pending (needs `npm run dev` on Beni's machine).

---

## Where we are now

| Phase | Status |
|---|---|
| 1. Foundation + data | ✅ done, DB seeded |
| 2. Matching engine | ✅ built; live integration run pending on Beni's machine |
| 3. Frontend core flow | ✅ built; `npm run build` clean |
| 4. Grounded chat | ⏳ next |
| 5. Deploy (Render + Vercel) | ⏳ |
| 6. Submission package (about, README, docs, demo) | ⏳ |

**Open items for Beni:**
1. Run `python scripts/test_phase2.py` (backend running) and share output.
2. `npm install` in `frontend/` (a half-finished install was cleaned up).
3. Cross-check the 10-scheme VERIFY LIST facts against official portals before the demo.
