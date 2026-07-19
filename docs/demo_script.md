# Demo Video Script — Thittam AI (2:45 target)

**Setup before recording (do NOT skip):**
- Phone on mobile data (not WiFi) — proves it's truly live.
- Visit the site once ~2 minutes before recording so Render is warm, then STOP — no rehearsal submissions in the 10 minutes before recording (free-tier AI rate limits are shared; one run per minute max).
- Screen-record the phone (or mirror to laptop). Landscape OFF — judges should see the mobile experience.
- Keep the Supabase table editor open in a browser tab on your laptop for the final shot.

**Timing beats** (seconds are cumulative):

## 0:00 – 0:20 · The hook (voice over the landing page)
Say: *"India has over 3,000 welfare schemes, but crores in benefits go unclaimed — because eligible people don't know a scheme exists, or can't read rules written in bureaucratic English. This is Thittam AI — an eligibility assistant that works in Tamil."*
On screen: landing page loads fast → **tap தமிழ்** → the entire UI flips to Tamil instantly. Linger 2 seconds.

## 0:20 – 1:00 · The wizard (Tamil run — the hero profile)
Say: *"Meet a 20-year-old student from a village — the first in her family to reach college. Eight taps, no typing, no login."*
On screen: tap through — age **20** (stepper), **பெண்**, **தமிழ்நாடு**, **கிராமம்**, **மாணவர்**, **₹1.2–2.5 லட்சம்**, **OBC**, special: **தற்போது படிக்கிறேன் + குடும்பத்தில் முதல் பட்டதாரி** → summary → submit.
While the bilingual loading messages rotate, say: *"Behind this: a database hard-filters 40 real central and Tamil Nadu schemes, then Llama 3.3 reads every surviving scheme's full rules and judges each one."*

## 1:00 – 1:35 · Results (the payoff)
On screen: scroll slowly through the ranked cards.
Say: *"Twelve schemes — each with WHY she qualifies, written in Tamil: the First Graduate fee concession… Pudhumai Penn, ₹1,000 every month… free bus travel… and honest confidence labels — green when the data confirms it, amber when a detail like her school type still needs checking."*
Tap one card's **documents** section open for 3 seconds.

## 1:35 – 2:10 · Grounded chat (the differentiator — do not rush this)
On screen: open **Pudhumai Penn → கேளுங்கள்** → tap the chip **"என்ன ஆவணங்கள் தேவை?"** → Tamil answer appears with the exact documents.
Say: *"Every answer comes only from verified scheme data."*
Then type: **"Can I apply for a car loan through this?"**
The refusal appears. Say: *"No answer in the data means no answer — it refuses and points to the official site. This is not a ChatGPT wrapper; it cannot hallucinate benefits that don't exist."*

## 2:10 – 2:30 · Proof of engineering (laptop screen, quick cuts)
Show for ~5 seconds each:
1. The **/about** page's pipeline diagram — say: *"Deterministic SQL first; the AI only judges what's genuinely textual, and returns one auditable verdict per scheme."*
2. **Supabase → match_requests table** filling with real logged runs — say: *"Every match is logged — anonymously, no personal data anywhere."*

## 2:30 – 2:45 · Close
On screen: back to the landing page.
Say: *"Forty schemes today — adding more is editing one JSON file. No logins, no PII, runs on free infrastructure, built solo. Thittam AI — உங்களுக்கான திட்டங்கள், உங்கள் மொழியில். Link in the submission."*

---

**If something fails on camera:** "AI service is busy" → cut, wait 60 seconds, re-record that beat (rate limit, not a bug). Page slow to load → Render fell asleep; open /api/health, wait, restart the beat.

**Upload:** YouTube → unlisted → title "Thittam AI — Idea2Impact 2026 Demo" → paste link + https://thittam-ai.vercel.app + GitHub repo URL into the submission form. Submit before 11:30 PM — never at 11:58.
