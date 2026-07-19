"use client";

/** The judges' page: problem with cited stats, how the AI works,
 * data sources, team, and the full disclaimer. Fully bilingual. */

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-primary-100 bg-white p-4">
      <h2 className="mb-2 text-lg font-bold text-primary-700">{title}</h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("aboutTitle")}</h1>

      <Section title={t("aboutProblemTitle")}>
        <div className="space-y-2 text-sm leading-relaxed text-gray-700">
          <p>{t("aboutProblem1")}</p>
          <p>{t("aboutProblem2")}</p>
          <p className="font-semibold text-gray-900">{t("aboutProblem3")}</p>
          <p className="text-xs text-gray-500">{t("aboutSourcesNote")}</p>
        </div>
      </Section>

      <Section title={t("aboutHowTitle")}>
        <div className="mb-3 overflow-x-auto rounded-xl bg-gray-900 p-3 font-mono text-[11px] leading-relaxed text-green-300">
          <pre>{`8 answers ──▶ HARD FILTER (SQL)  40 ➜ ~15 schemes
                    │  deterministic: age, income,
                    │  state, gender, category
                    ▼
             AI REASONING (Llama 3.3 70B)
                    │  reads full rule text,
                    │  one verdict per scheme
                    ▼
             RANKED RESULTS + bilingual
             "why you qualify" + documents
                    │
                    ▼
             GROUNDED CHAT  (one scheme's
             data = the AI's only knowledge)`}</pre>
        </div>
        <div className="space-y-2 text-sm leading-relaxed text-gray-700">
          <p>{t("aboutHow1")}</p>
          <p>{t("aboutHow2")}</p>
          <p>{t("aboutHow3")}</p>
        </div>
      </Section>

      <Section title={t("aboutDataTitle")}>
        <p className="text-sm leading-relaxed text-gray-700">{t("aboutData")}</p>
      </Section>

      <Section title={t("aboutTeamTitle")}>
        <p className="text-sm leading-relaxed text-gray-700">{t("aboutTeam")}</p>
      </Section>

      <Section title={t("aboutDisclaimerTitle")}>
        <p className="text-sm leading-relaxed text-amber-900">{t("aboutDisclaimerFull")}</p>
      </Section>

      <Link
        href="/check"
        className="block w-full rounded-2xl bg-primary-600 px-6 py-4 text-center text-lg font-bold text-white"
      >
        {t("cta")} →
      </Link>
    </div>
  );
}
