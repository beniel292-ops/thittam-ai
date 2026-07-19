# திட்டம் Thittam AI — AI Welfare Scheme Eligibility Assistant

**Live app:** https://thittam-ai.vercel.app · **API:** https://thittam-ai.onrender.com/api/health

Underserved citizens in Tamil Nadu answer **8 tap-only questions** in **Tamil or English** and get a ranked list of central + state welfare schemes they qualify for — each with a plain-language *why you qualify*, required documents, and the official application link. Every matched scheme has a chat that answers **only from verified scheme data** and politely refuses everything else.

Built solo for **Idea2Impact 2026** · Theme 1: Sustainability & Social Impact (Financial Inclusion + Public Services).

## Why this exists

India runs 3,000+ central and state schemes (800+ central schemes on [myScheme](https://www.myscheme.gov.in) alone; 300+ delivered via [DBT](https://dbtbharat.gov.in) across 50+ ministries) — yet benefits go unclaimed because eligible citizens don't know a scheme exists, or can't parse eligibility rules written in bureaucratic English. The barrier isn't schemes; it's **discovery in your own language**. No login, no typing, no PII — by design, for users with low digital literacy.

## Architecture

```
        [ Citizen's phone ]
               │ HTTPS
               ▼
   ┌───────────────────────────┐
   │  FRONTEND  Next.js 14     │  Vercel
   │  Tamil/English i18n,      │
   │  tap-only wizard,         │
   │  sessionStorage state     │
   └────────────┬──────────────┘
                │ JSON  (/api/match, /api/chat, /api/schemes)
                ▼
   ┌───────────────────────────┐
   │  BACKEND  FastAPI (3.11)  │  Render
   │  routes → services →      │
   │  db / llm  (strict layers)│
   │  pydantic · slowapi ·     │
   │  CORS · security headers  │
   └─────┬───────────────┬─────┘
         │               │
         ▼               ▼
 ┌───────────────┐ ┌───────────────────┐
 │ Supabase      │ │ Groq API          │
 │ Postgres      │ │ llama-3.3-70b     │
 │ 40 schemes,   │ │ (fallback:        │
 │ RLS locked,   │ │  llama-3.1-8b)    │
 │ request logs  │ │ retry + backoff   │
 └───────────────┘ └───────────────────┘
```

### The matching pipeline (the AI core)

1. **Hard filter (SQL, deterministic).** State, gender, social category, age and income are compared in Postgres. 40 schemes → ~10–20 candidates, state-specific first. *The LLM is never asked to compare numbers SQL can compare.*
2. **LLM reasoning (Groq).** Candidates' full textual eligibility rules + the profile go to Llama 3.3 70B, which must return **one strict-JSON verdict per candidate** — `yes` / `likely` / `no` — with bilingual reasons and ranks. A "no" is only allowed when a named profile field contradicts a rule; unverifiable conditions (school type, land ownership, BPL status) are mandatory `likely`. Requiring a verdict for *every* candidate makes silently skipping schemes structurally impossible.
3. **Merge & verify.** The backend treats AI output as untrusted input: verdicts for non-candidates are dropped, broken ranks repaired, `no`s discarded, the rest joined with DB records, sorted Eligible-before-Likely, and logged to `match_requests`.

Zero matches → the 3 closest schemes, each tagged with the exact condition that blocked it.

### Grounded chat

Each scheme's chat injects that **one scheme's database row as the model's only knowledge source**, plus the citizen's profile and the selected language. If the answer isn't in the data, the model must reply with an exact bilingual refusal sentence — which the backend detects to set a `grounded` flag on every logged turn. Ask it about car loans; it declines and points to the official site.

### Why no vector database

With 40 curated, structured scheme records, retrieval is `WHERE id = …` — exact, instant, free. Embedding search earns its complexity when you have thousands of unstructured documents; here it would be engineering theatre. The pipeline is designed so that if the catalog grows to hundreds of schemes, a similarity-search shortlist can replace stage 1 without touching stages 2–3.

## Engineering notes judges may care about

- **Zero hardcoded business values:** prompts, model names, temperatures, rate limits, thresholds and all 40 schemes live in `backend/app/specs/*.json`; every UI string lives in `frontend/lib/i18n.js` (both languages). Changing the AI's instructions is a data edit, not a code change.
- **Strict layering:** routes never import supabase or groq; only `db/` touches the database, only `llm/` touches the model.
- **Security without logins:** pydantic validation (enums, ranges, unknown fields rejected), per-IP rate limits (10/min AI routes), Supabase RLS with zero anon policies, CORS locked to the frontend domain, security headers, prompt-injection containment (user text is data; the chat model has no tools and sees one scheme row), secrets only in env vars.
- **AI failure engineering:** 20s timeouts, retry with backoff, automatic model fallback, JSON-mode + fence-stripping + one corrective re-ask, and bilingual error envelopes so even failures speak the citizen's language.
- **Stateless backend:** profile and chat history live in the browser (sessionStorage); every request is self-contained.

## Repository layout

```
frontend/   Next.js 14 app — pages (/, /check, /results, /chat/[slug], /about),
            components, lib (api.js · i18n.js · session.js)
backend/    FastAPI app — routes/ services/ db/ llm/ models/ specs/
            scripts/ (schema SQL, seed generator, integration tests)
docs/       problem_statement.md · demo_script.md · DEPLOYMENT.md
```

## Run it locally

```bash
# Backend (Python 3.11+)
cd backend
pip install -r requirements.txt
cp .env.example .env        # fill: GROQ_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
python -m uvicorn app.main:app --port 8000

# Database (once): run scripts/create_tables.sql then scripts/seed_data.sql
# in the Supabase SQL editor. Idempotent — safe to re-run.

# Frontend
cd frontend
npm install
npm run dev                  # http://localhost:3000

# Integration tests (with the backend running)
python backend/scripts/test_phase2.py   # matching: 3 profiles + 5× drift check
python backend/scripts/test_phase4.py   # chat: grounding + refusal + injection probe
```

## Adding a scheme

Edit `backend/app/specs/schemes_seed.json` → `python backend/scripts/generate_seed_sql.py` → paste `scripts/seed_data.sql` into the Supabase SQL editor. Upserts by slug; no code changes, no redeploy.

## Team

Solo build by **Beni** — Idea2Impact 2026.

**Disclaimer:** Thittam AI gives guidance, not government decisions. Scheme facts change with budgets; always confirm on the official website linked from every scheme card.
