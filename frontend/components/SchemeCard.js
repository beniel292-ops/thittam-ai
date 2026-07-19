"use client";

/** One matched scheme: name, badge, benefit, why-you-qualify, expandable
 * documents, official link (new tab) and the ask-about-this-scheme button. */

import { useState } from "react";
import Link from "next/link";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { useLanguage } from "@/lib/i18n";

export default function SchemeCard({ scheme }) {
  const { lang, t } = useLanguage();
  const [showDocs, setShowDocs] = useState(false);

  const name = lang === "ta" ? scheme.name_ta : scheme.name_en;
  const benefit = lang === "ta" ? scheme.benefit_ta : scheme.benefit_en;
  const reason = lang === "ta" ? scheme.reason_ta : scheme.reason_en;
  const documents = lang === "ta" ? scheme.documents_ta : scheme.documents_en;
  const howToApply = lang === "ta" ? scheme.how_to_apply_ta : scheme.how_to_apply_en;

  return (
    <article className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-base font-bold leading-snug">{name}</h3>
        <ConfidenceBadge eligible={scheme.eligible} label={scheme.confidence_label} />
      </div>

      <p className="mb-3 text-sm text-gray-700">
        <span className="font-semibold text-primary-700">{t("benefitLabel")}: </span>
        {benefit}
      </p>

      {reason && (
        <div className="mb-3 rounded-xl bg-primary-50 px-3 py-2">
          <p className="text-xs font-bold uppercase tracking-wide text-primary-700">
            {t("whyQualify")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-gray-800">{reason}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowDocs((v) => !v)}
        className="mb-2 w-full rounded-xl border border-primary-100 px-3 py-2 text-left text-sm font-semibold text-primary-700 active:bg-primary-50"
      >
        {showDocs ? "▾ " : "▸ "}
        {t("documents")}
      </button>
      {showDocs && (
        <div className="mb-3 px-1">
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            {(documents || []).map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-700">
            <span className="font-semibold text-primary-700">{t("howToApply")}: </span>
            {howToApply}
          </p>
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-2">
        <a
          href={scheme.official_link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-primary-600 px-3 py-2.5 text-center text-sm font-bold text-primary-700 active:bg-primary-50"
        >
          {t("officialSite")} ↗
        </a>
        <Link
          href={`/chat/${scheme.slug}`}
          className="rounded-xl bg-primary-600 px-3 py-2.5 text-center text-sm font-bold text-white active:bg-primary-700"
        >
          {t("askScheme")}
        </Link>
      </div>
    </article>
  );
}
