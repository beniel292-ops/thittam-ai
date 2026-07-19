"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

const HOW_STEPS = [
  { titleKey: "how1Title", descKey: "how1Desc", icon: "📝" },
  { titleKey: "how2Title", descKey: "how2Desc", icon: "🤖" },
  { titleKey: "how3Title", descKey: "how3Desc", icon: "✅" },
];

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-8 py-4">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight text-primary-700">
          {t("appName")}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-gray-700">
          {t("tagline")}
        </p>
        <Link
          href="/check"
          className="mt-6 inline-block w-full max-w-sm rounded-2xl bg-primary-600 px-6 py-4 text-lg font-bold text-white shadow-md active:bg-primary-700"
        >
          {t("cta")} →
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-3">
        {HOW_STEPS.map((step, index) => (
          <div
            key={step.titleKey}
            className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-white p-4"
          >
            <div className="text-2xl">{step.icon}</div>
            <div>
              <p className="font-bold text-gray-900">
                {index + 1}. {t(step.titleKey)}
              </p>
              <p className="mt-0.5 text-sm text-gray-600">{t(step.descKey)}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
