# Problem Statement — Thittam AI

**Idea2Impact 2026 · Theme 1: Sustainability & Social Impact · Domain: Financial Inclusion + Public Services**

## The problem

India operates one of the largest welfare systems on earth: more than 3,000 central and state schemes, with 800+ central schemes listed on the government's own myScheme portal and 300+ schemes across 50+ ministries paying benefits directly into bank accounts through Direct Benefit Transfer. Tamil Nadu adds its own dense layer — Pudhumai Penn for girl students, Kalaignar Magalir Urimai Thogai for women heads of families, CMCHIS health cover, pensions, marriage assistance, and more.

Yet a large share of intended beneficiaries never claim what is theirs. The reasons are consistent across studies and lived experience:

**1. Discovery failure.** No citizen can hold 3,000 schemes in their head. A widowed daily-wage worker in a village may be simultaneously eligible for a state pension, free health cover, subsidised insurance, and her daughter's education incentive — and know about none of them. Schemes are announced, then buried in department websites.

**2. Language and literacy walls.** Eligibility rules are written in bureaucratic English: "landholding families subject to exclusion criteria applicable to institutional landholders." The people these schemes exist for — daily-wage workers, small farmers, first-generation students — often read Tamil, not legalese. Existing portals are form-heavy, English-first, and assume digital confidence.

**3. The *why* gap.** Even when a citizen finds a scheme, the binary "eligible / not eligible" of existing tools builds no confidence. People act when they understand *why* they qualify and what exactly to do next — which documents, which office, which website.

The cost of this gap is not abstract: it is an unclaimed pension, an uninsured hospitalisation, a girl dropping out of college for want of ₹1,000 a month that was already allocated to her.

## Who suffers most

Low-income citizens in Tamil Nadu — farmers, daily-wage workers, women heads of families, widows, persons with disabilities, first-generation students — and the NGO volunteers and village-level entrepreneurs who assist them and currently navigate this maze by hand.

## Our solution

**Thittam AI** (திட்டம் = "scheme") is a no-login, bilingual web assistant. A citizen answers 8 tap-only questions — age, gender, location, occupation, family income, social category, special situations. In about ten seconds, a two-stage AI pipeline (deterministic SQL filtering over 40 curated central + Tamil Nadu schemes, then LLM reasoning over each scheme's full textual rules) returns a ranked list with:

- a plain-language, personalised **"why you qualify"** in Tamil or English,
- a confidence label (Eligible / Likely Eligible) that is honest about uncertainty,
- the **documents** needed and the **official application link**, and
- a per-scheme **chat grounded strictly in verified scheme data** — it answers "என்ன ஆவணங்கள் தேவை?" from the database, and politely refuses questions the data cannot answer instead of hallucinating.

No accounts, no personal identifiers, no typing in the core flow — deliberate choices for low digital literacy and instant judge access.

## Why now, and why this design

Free, fast open-model inference (Groq/Llama 3.3) finally makes per-citizen reasoning affordable at ₹0 to pilot and fractions of a rupee at scale. Our design keeps the AI on a short leash: deterministic rules stay in SQL, the model only judges genuinely textual conditions, its output is validated like untrusted input, and every chat answer is anchored to verified data. That is what makes an AI eligibility assistant *safe enough to put in front of the people who can least afford wrong answers*.

## Impact path

A single village-level volunteer with one phone can screen a whole queue of citizens in an afternoon. The catalog grows by editing one JSON file — no code changes — and the architecture has a designed upgrade path from 40 schemes to hundreds. Match logs (anonymous, no PII) show which schemes people actually qualify for and miss — data that itself is useful to policy.

**Sources:** myscheme.gov.in · dbtbharat.gov.in · scheme facts from official portals (pmkisan.gov.in, pmjay.gov.in, pudhumaipenn.tn.gov.in, tn.gov.in department pages).
