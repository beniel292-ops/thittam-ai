"use client";

import { useLanguage } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const base = "px-3 py-1.5 rounded-full text-sm font-semibold transition-colors";
  return (
    <div className="flex items-center gap-1 rounded-full bg-primary-100 p-1" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLang("ta")}
        className={`${base} ${lang === "ta" ? "bg-primary-600 text-white" : "text-primary-700"}`}
      >
        தமிழ்
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`${base} ${lang === "en" ? "bg-primary-600 text-white" : "text-primary-700"}`}
      >
        English
      </button>
    </div>
  );
}
