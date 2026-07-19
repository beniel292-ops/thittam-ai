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
