# Deployment Guide — Thittam AI

Current production: **frontend** https://thittam-ai.vercel.app (Vercel) · **backend** https://thittam-ai.onrender.com (Render) · **DB** Supabase project `cklveqtqklxlvkppujhx`. This documents how it was set up and how to redo any part from scratch.

## 0. Prerequisites
Public GitHub repo containing this project. Secrets are NEVER in the repo — `.gitignore` excludes `.env` from commit #1; verify with `git ls-files | grep .env` (should show only the two `.env.example` files).

## 1. Database — Supabase (free)
1. supabase.com → New project (any region; ap-south is closest to users).
2. SQL Editor → paste **all of `backend/scripts/create_tables.sql`** → Run. ("Success. No rows returned.")
3. New query → paste **all of `backend/scripts/seed_data.sql`** → Run. Last line must show `central 25 / tn 15`. Order matters: tables before seed (else `42P01 relation does not exist`).
4. Project Settings → API → copy the **Project URL** and the **service_role** key (NOT anon — decode the JWT if unsure: it must say `"role":"service_role"`).
5. Re-seeding after editing schemes: `python backend/scripts/generate_seed_sql.py`, paste the regenerated file again — it upserts by slug, safe to repeat.

## 2. Backend — Render (free)
1. dashboard.render.com → New → **Web Service** → connect the GitHub repo.
2. Settings: Branch `main` · Region **Singapore** · **Root Directory `backend`** · Build `pip install -r requirements.txt` · Start `uvicorn app.main:app --host 0.0.0.0 --port $PORT` · Instance **Free**.
3. Environment variables (all six; no quotes, no trailing spaces):

   | Key | Value |
   |---|---|
   | `PYTHON_VERSION` | `3.11.9` |
   | `GROQ_API_KEY` | `gsk_…` from console.groq.com (Groq, not Grok/xAI!) |
   | `SUPABASE_URL` | `https://<ref>.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | the service_role key |
   | `ALLOWED_ORIGINS` | the Vercel URL, e.g. `https://thittam-ai.vercel.app` (placeholder ok until frontend exists) |
   | `ENVIRONMENT` | `production` |

4. Deploy → wait for "Your service is live" → verify `https://<service>.onrender.com/api/health` returns `{"success":true,…}` and `/api/schemes` returns `"count":40`.

## 3. Frontend — Vercel (free)
1. vercel.com → Add New → Project → import the repo.
2. **Root Directory: `frontend`** (the step everyone misses). Framework auto-detects Next.js.
3. Environment variable: `NEXT_PUBLIC_API_URL` = the Render URL (https, no trailing slash).
4. Deploy → note the production URL.

**⚠ The one trap:** `NEXT_PUBLIC_*` values are baked into the JS **at build time**. If you add or change this variable, you MUST redeploy (Deployments → ⋯ → Redeploy) or the site silently keeps calling the old address (symptom: generic "Something went wrong" on submit while the backend works when called directly). After any frontend deploy, test in an incognito window — phones cache old bundles aggressively.

## 4. Cross-wiring + lock
Render's `ALLOWED_ORIGINS` ← Vercel URL; Vercel's `NEXT_PUBLIC_API_URL` ← Render URL. Each app is told the *other's* address. Setting `ALLOWED_ORIGINS` wrong shows as CORS errors in the browser console with zero results.

## 5. Keep-alive (critical for demos)
Render free sleeps after ~15 idle minutes (~50 s cold start). cron-job.org → free account → Create cronjob → URL `https://<service>.onrender.com/api/health` → every **10 minutes** → enabled. Before any live demo, also open the site once manually 2 minutes prior.

## 6. Continuous deployment
`git push` to `main` auto-deploys **both** platforms (~1 min Vercel, ~3 min Render). Env var changes: Render restarts itself; Vercel needs a manual Redeploy. Rollback: both dashboards let you redeploy any previous build.

## 7. Known operational limits (free tiers)
- **Groq**: ~3–4 match requests/minute total and a daily token budget (≈ dozens of 70B matches/day; automatic fallback to 8B after). "AI service is busy" = wait 60 s and retry. Real traffic ⇒ paid dev tier (~₹0.25/match), zero code changes.
- **Render**: cold starts (mitigated above).
- **Supabase**: free projects pause after ~1 week of zero activity; the keep-alive traffic prevents this.

## 8. If a secret ever leaks
Rotate in the provider dashboard (Supabase: Settings → API → regenerate; Groq: revoke + new key), update Render env vars, done. Practise once.
