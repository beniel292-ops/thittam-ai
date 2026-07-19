"use client";

/**
 * Every user-facing string in both languages. Components NEVER hardcode
 * text — they call t("key"). Language state lives here (React context),
 * persisted in sessionStorage via lib/session.js.
 */

import { createContext, useContext, useEffect, useState } from "react";
import { getStoredLang, storeLang } from "@/lib/session";

export const STRINGS = {
  appName: { en: "Thittam AI", ta: "திட்டம் AI" },
  tagline: {
    en: "Find every government scheme you deserve — in 2 minutes.",
    ta: "உங்களுக்கு உரிய அரசு திட்டங்களை 2 நிமிடங்களில் கண்டறியுங்கள்.",
  },
  cta: { en: "Find My Schemes", ta: "எனக்கான திட்டங்கள்" },
  how1Title: { en: "Answer 8 questions", ta: "8 கேள்விகளுக்கு பதிலளியுங்கள்" },
  how1Desc: {
    en: "Simple taps — age, work, income. No typing, no login.",
    ta: "எளிய தட்டல்கள் — வயது, வேலை, வருமானம். தட்டச்சு இல்லை, பதிவு இல்லை.",
  },
  how2Title: { en: "AI checks 40 schemes", ta: "AI 40 திட்டங்களை சரிபார்க்கிறது" },
  how2Desc: {
    en: "Central and Tamil Nadu schemes, matched to your life.",
    ta: "மத்திய மற்றும் தமிழ்நாடு திட்டங்கள், உங்கள் வாழ்க்கைக்கு பொருத்தமாக.",
  },
  how3Title: { en: "Know why you qualify", ta: "ஏன் தகுதி என்று அறியுங்கள்" },
  how3Desc: {
    en: "Plain-language reasons, documents needed, and official links.",
    ta: "எளிய மொழியில் காரணங்கள், தேவையான ஆவணங்கள், அதிகாரப்பூர்வ இணைப்புகள்.",
  },
  disclaimer: {
    en: "Thittam AI gives guidance only — it is not a government decision. Always confirm on the official website.",
    ta: "திட்டம் AI வழிகாட்டுதல் மட்டுமே — இது அரசு முடிவு அல்ல. அதிகாரப்பூர்வ இணையதளத்தில் உறுதி செய்யவும்.",
  },

  qAge: { en: "What is your age?", ta: "உங்கள் வயது என்ன?" },
  qGender: { en: "What is your gender?", ta: "உங்கள் பாலினம் என்ன?" },
  qState: { en: "Where do you live?", ta: "நீங்கள் எங்கு வசிக்கிறீர்கள்?" },
  qArea: { en: "Is your area rural or urban?", ta: "உங்கள் பகுதி கிராமமா, நகரமா?" },
  qOccupation: { en: "What is your main work?", ta: "உங்கள் முக்கிய வேலை என்ன?" },
  qIncome: {
    en: "Your family's yearly income?",
    ta: "உங்கள் குடும்பத்தின் ஆண்டு வருமானம்?",
  },
  qCategory: { en: "Your social category?", ta: "உங்கள் சமூகப் பிரிவு?" },
  qSpecial: {
    en: "Do any of these apply to you?",
    ta: "இவற்றில் ஏதேனும் உங்களுக்கு பொருந்துமா?",
  },
  qSpecialHint: {
    en: "Tap all that apply, then press Next.",
    ta: "பொருந்துவதை எல்லாம் தட்டி, பிறகு அடுத்து அழுத்தவும்.",
  },

  female: { en: "Female", ta: "பெண்" },
  male: { en: "Male", ta: "ஆண்" },
  otherGender: { en: "Other", ta: "மற்றவை" },
  stateTN: { en: "Tamil Nadu", ta: "தமிழ்நாடு" },
  stateOther: { en: "Another state", ta: "வேறு மாநிலம்" },
  rural: { en: "Village / Rural", ta: "கிராமம்" },
  urban: { en: "Town / City", ta: "நகரம்" },

  occStudent: { en: "Student", ta: "மாணவர்" },
  occFarmer: { en: "Farmer", ta: "விவசாயி" },
  occDailyWage: { en: "Daily wage worker", ta: "தினக்கூலி தொழிலாளி" },
  occSelfEmployed: { en: "Small business / Self-employed", ta: "சிறு தொழில் / சுயதொழில்" },
  occSalaried: { en: "Salaried job", ta: "சம்பள வேலை" },
  occHomemaker: { en: "Homemaker", ta: "இல்லத்தரசி" },
  occUnemployed: { en: "Looking for work", ta: "வேலை தேடுகிறேன்" },
  occOther: { en: "Other", ta: "மற்றவை" },

  inc72k: { en: "Up to ₹72,000", ta: "₹72,000 வரை" },
  inc120k: { en: "₹72,000 – ₹1.2 lakh", ta: "₹72,000 – ₹1.2 லட்சம்" },
  inc250k: { en: "₹1.2 – ₹2.5 lakh", ta: "₹1.2 – ₹2.5 லட்சம்" },
  inc350k: { en: "₹2.5 – ₹3.5 lakh", ta: "₹2.5 – ₹3.5 லட்சம்" },
  inc450k: { en: "₹3.5 – ₹4.5 lakh", ta: "₹3.5 – ₹4.5 லட்சம்" },
  inc900k: { en: "₹4.5 – ₹9 lakh", ta: "₹4.5 – ₹9 லட்சம்" },
  incAbove: { en: "Above ₹9 lakh", ta: "₹9 லட்சத்திற்கு மேல்" },

  catGeneral: { en: "General", ta: "பொது" },
  catOBC: { en: "OBC / BC / MBC", ta: "OBC / BC / MBC" },
  catSCST: { en: "SC / ST", ta: "SC / ST" },
  catEWS: { en: "EWS", ta: "EWS" },
  catMinority: { en: "Minority", ta: "சிறுபான்மையினர்" },

  stStudent: { en: "Studying now", ta: "தற்போது படிக்கிறேன்" },
  stFarmer: { en: "Small / marginal farmer", ta: "சிறு / குறு விவசாயி" },
  stWidow: { en: "Widow", ta: "விதவை" },
  stDisabled: { en: "Differently abled", ta: "மாற்றுத்திறனாளி" },
  stPregnant: { en: "Pregnant / new mother", ta: "கர்ப்பிணி / புதிய தாய்" },
  stFirstGen: { en: "First graduate in family", ta: "குடும்பத்தில் முதல் பட்டதாரி" },
  stNone: { en: "None of these", ta: "எதுவும் இல்லை" },

  back: { en: "Back", ta: "பின்" },
  next: { en: "Next", ta: "அடுத்து" },
  submit: { en: "Find my schemes", ta: "திட்டங்களைக் கண்டறி" },
  years: { en: "years", ta: "வயது" },
  summaryTitle: { en: "Check your answers", ta: "உங்கள் பதில்களை சரிபார்க்கவும்" },
  edit: { en: "Edit", ta: "திருத்து" },

  loadingMessages: {
    en: [
      "Reading your profile…",
      "Checking 40 government schemes…",
      "Comparing eligibility rules…",
      "Writing your reasons in plain words…",
      "Almost there…",
    ],
    ta: [
      "உங்கள் விவரங்களைப் படிக்கிறோம்…",
      "40 அரசு திட்டங்களை சரிபார்க்கிறோம்…",
      "தகுதி விதிகளை ஒப்பிடுகிறோம்…",
      "எளிய மொழியில் காரணங்களை எழுதுகிறோம்…",
      "கிட்டத்தட்ட முடிந்தது…",
    ],
  },

  resultsTitle: { en: "Schemes for you", ta: "உங்களுக்கான திட்டங்கள்" },
  matchesFound: {
    en: "schemes matched your profile",
    ta: "திட்டங்கள் உங்களுக்கு பொருந்துகின்றன",
  },
  whyQualify: { en: "Why you qualify", ta: "நீங்கள் ஏன் தகுதி பெறுகிறீர்கள்" },
  documents: { en: "Documents needed", ta: "தேவையான ஆவணங்கள்" },
  howToApply: { en: "How to apply", ta: "விண்ணப்பிப்பது எப்படி" },
  officialSite: { en: "Official website", ta: "அதிகாரப்பூர்வ தளம்" },
  askScheme: { en: "Ask about this scheme", ta: "கேளுங்கள்" },
  benefitLabel: { en: "Benefit", ta: "பயன்" },

  noMatchesTitle: {
    en: "No exact matches found",
    ta: "சரியான பொருத்தம் கிடைக்கவில்லை",
  },
  noMatchesDesc: {
    en: "These are the closest schemes and what blocked each one:",
    ta: "மிக நெருக்கமான திட்டங்களும், தடையான காரணங்களும் இவை:",
  },
  blockedLabel: { en: "Blocked by", ta: "தடை காரணம்" },
  blockState: { en: "Only for Tamil Nadu residents", ta: "தமிழ்நாடு வாசிகளுக்கு மட்டும்" },
  blockGender: { en: "Gender condition", ta: "பாலின நிபந்தனை" },
  blockCategory: { en: "Social category condition", ta: "சமூகப் பிரிவு நிபந்தனை" },
  blockMinAge: { en: "Minimum age", ta: "குறைந்தபட்ச வயது" },
  blockMaxAge: { en: "Maximum age", ta: "அதிகபட்ச வயது" },
  blockIncome: { en: "Income limit", ta: "வருமான வரம்பு" },
  blockRules: {
    en: "Detailed conditions not met",
    ta: "விரிவான நிபந்தனைகள் பொருந்தவில்லை",
  },
  startOver: { en: "Check again", ta: "மீண்டும் சரிபார்க்கவும்" },

  errorTitle: { en: "Something went wrong", ta: "ஏதோ தவறு நடந்தது" },
  tryAgain: { en: "Try again", ta: "மீண்டும் முயற்சி" },

  chatPlaceholder: { en: "Type your question…", ta: "உங்கள் கேள்வியை எழுதுங்கள்…" },
  send: { en: "Send", ta: "அனுப்பு" },
  chatIntro: {
    en: "Ask me anything about this scheme — documents, amounts, how to apply.",
    ta: "இந்தத் திட்டம் பற்றி எதுவும் கேளுங்கள் — ஆவணங்கள், தொகை, விண்ணப்பிக்கும் முறை.",
  },
  chip1: { en: "What documents do I need?", ta: "என்ன ஆவணங்கள் தேவை?" },
  chip2: { en: "How do I apply?", ta: "எப்படி விண்ணப்பிப்பது?" },
  chip3: { en: "How much will I get?", ta: "எவ்வளவு தொகை கிடைக்கும்?" },
  backToResults: { en: "Back to results", ta: "முடிவுகளுக்கு திரும்பு" },

  aboutTitle: { en: "About Thittam AI", ta: "திட்டம் AI பற்றி" },
  aboutLink: { en: "How it works & about", ta: "இது எப்படி செயல்படுகிறது" },
  aboutProblemTitle: { en: "The problem", ta: "பிரச்சனை" },
  aboutProblem1: {
    en: "India runs over 3,000 central and state welfare schemes, with 800+ central schemes listed on the government's own myScheme portal — yet most citizens can name only a handful.",
    ta: "இந்தியாவில் 3,000-க்கும் மேற்பட்ட மத்திய, மாநில நலத்திட்டங்கள் உள்ளன; அரசின் myScheme தளத்திலேயே 800-க்கும் மேற்பட்ட மத்தியத் திட்டங்கள் பட்டியலிடப்பட்டுள்ளன — ஆனால் பெரும்பாலான மக்களுக்கு ஒரு சிலவே தெரியும்.",
  },
  aboutProblem2: {
    en: "Over 300 schemes across 50+ ministries deliver benefits directly to bank accounts (DBT), reaching 90+ crore people — but benefits still go unclaimed because eligible citizens don't know a scheme exists or can't parse eligibility rules written in bureaucratic English.",
    ta: "50-க்கும் மேற்பட்ட அமைச்சகங்களின் 300+ திட்டங்கள் நேரடி பயன் பரிமாற்றம் (DBT) மூலம் 90 கோடிக்கும் மேற்பட்ட மக்களை சென்றடைகின்றன — இருந்தும், திட்டம் இருப்பதே தெரியாமலோ, சிக்கலான ஆங்கில விதிகளை புரிந்து கொள்ள முடியாமலோ பலர் பயன்களை இழக்கின்றனர்.",
  },
  aboutProblem3: {
    en: "The barrier is not the schemes — it is discovery: knowing what you qualify for, why, and what to do next, in your own language.",
    ta: "தடை திட்டங்கள் அல்ல — கண்டறிதல்தான்: எதற்கு தகுதி, ஏன், அடுத்து என்ன செய்வது என்பதை சொந்த மொழியில் அறிவதுதான்.",
  },
  aboutHowTitle: { en: "How the AI works", ta: "AI எப்படி செயல்படுகிறது" },
  aboutHow1: {
    en: "1. Hard filter (database): your age, income, state, gender and category are compared against 40 curated schemes using exact rules — deterministic maths, not AI guesswork.",
    ta: "1. கடின வடிகட்டி (தரவுத்தளம்): உங்கள் வயது, வருமானம், மாநிலம், பாலினம், பிரிவு ஆகியவை 40 திட்டங்களுடன் துல்லியமான விதிகளால் ஒப்பிடப்படுகின்றன — AI ஊகம் அல்ல, கணிதம்.",
  },
  aboutHow2: {
    en: "2. AI reasoning (Llama 3.3 via Groq): the surviving candidates' full eligibility text is read by the AI, which judges nuanced conditions and writes a plain-language reason for every verdict — in Tamil or English.",
    ta: "2. AI பகுத்தறிவு (Groq வழி Llama 3.3): வடிகட்டியை கடந்த திட்டங்களின் முழு தகுதி விதிகளை AI படித்து, நுணுக்கமான நிபந்தனைகளை மதிப்பிட்டு, ஒவ்வொரு முடிவுக்கும் எளிய மொழியில் காரணம் எழுதுகிறது — தமிழிலோ ஆங்கிலத்திலோ.",
  },
  aboutHow3: {
    en: "3. Grounded chat: each scheme's chat answers ONLY from that scheme's verified data. If the answer isn't there, it says so and points you to the official site — it never invents facts.",
    ta: "3. ஆதாரப்படுத்தப்பட்ட உரையாடல்: ஒவ்வொரு திட்டத்தின் உரையாடலும் அந்தத் திட்டத்தின் சரிபார்க்கப்பட்ட தரவிலிருந்து மட்டுமே பதிலளிக்கிறது. பதில் இல்லையெனில் அதை ஒப்புக்கொண்டு அதிகாரப்பூர்வ தளத்தை பரிந்துரைக்கிறது — ஒருபோதும் கற்பனை செய்யாது.",
  },
  aboutDataTitle: { en: "Data sources", ta: "தரவு மூலங்கள்" },
  aboutData: {
    en: "All 40 schemes (25 central + 15 Tamil Nadu) were curated from official portals: myScheme, scheme websites (pmkisan.gov.in, pmjay.gov.in, pudhumaipenn.tn.gov.in and others) and Tamil Nadu government department pages. Every scheme card links to its official website.",
    ta: "அனைத்து 40 திட்டங்களும் (25 மத்திய + 15 தமிழ்நாடு) அதிகாரப்பூர்வ தளங்களிலிருந்து தொகுக்கப்பட்டவை: myScheme, திட்ட இணையதளங்கள் மற்றும் தமிழ்நாடு அரசு துறை பக்கங்கள். ஒவ்வொரு திட்ட அட்டையும் அதன் அதிகாரப்பூர்வ தளத்திற்கு இணைக்கிறது.",
  },
  aboutTeamTitle: { en: "Team", ta: "குழு" },
  aboutTeam: {
    en: "Built solo by Beni for Idea2Impact 2026 (Theme: Sustainability & Social Impact — Financial Inclusion + Public Services). Stack: Next.js, FastAPI, Supabase Postgres, Groq (Llama 3.3 70B). No login, no tracking, no personal data stored.",
    ta: "Idea2Impact 2026-க்காக பெனியால் தனியாக உருவாக்கப்பட்டது (கருப்பொருள்: நிலைத்தன்மை & சமூக தாக்கம்). Next.js, FastAPI, Supabase, Groq (Llama 3.3 70B). பதிவு இல்லை, கண்காணிப்பு இல்லை, தனிப்பட்ட தரவு சேமிக்கப்படுவதில்லை.",
  },
  aboutDisclaimerTitle: { en: "Important disclaimer", ta: "முக்கிய அறிவிப்பு" },
  aboutDisclaimerFull: {
    en: "Thittam AI provides guidance only. Results are AI-assisted estimates based on the information you provide and curated scheme data; they are NOT a government decision, approval, or guarantee of benefits. Scheme rules, amounts and deadlines change — always verify on the official website or at your local government office before acting. No personal identity information is collected; your 8 answers are used only to compute matches.",
    ta: "திட்டம் AI வழிகாட்டுதல் மட்டுமே வழங்குகிறது. முடிவுகள் நீங்கள் தரும் தகவல் மற்றும் தொகுக்கப்பட்ட திட்டத் தரவின் அடிப்படையிலான AI மதிப்பீடுகள்; இவை அரசின் முடிவோ, ஒப்புதலோ, உத்தரவாதமோ அல்ல. விதிகள், தொகைகள், காலக்கெடுக்கள் மாறக்கூடும் — செயல்படும் முன் அதிகாரப்பூர்வ தளத்திலோ அரசு அலுவலகத்திலோ உறுதி செய்யவும். அடையாளத் தகவல் எதுவும் சேகரிக்கப்படுவதில்லை.",
  },
  aboutSourcesNote: {
    en: "Stats: myscheme.gov.in (800+ central schemes), dbtbharat.gov.in (300+ DBT schemes across 50+ ministries).",
    ta: "புள்ளிவிவரங்கள்: myscheme.gov.in (800+ மத்திய திட்டங்கள்), dbtbharat.gov.in (50+ அமைச்சகங்களில் 300+ DBT திட்டங்கள்).",
  },
};

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: () => "" });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    setLangState(getStoredLang());
  }, []);

  const setLang = (value) => {
    setLangState(value);
    storeLang(value);
  };

  const t = (key) => {
    const entry = STRINGS[key];
    if (!entry) return key;
    return entry[lang] ?? entry.en;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
