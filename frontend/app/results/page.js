"use client";

/**
 * Ranked results from sessionStorage. Empty storage -> redirect to /check.
 * Zero matches -> closest-miss cards showing which condition blocked each.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SchemeCard from "@/components/SchemeCard";
import { useLanguage } from "@/lib/i18n";
import { loadResults } from "@/lib/session";

const BLOCK_LABEL_KEYS = {
  state: "blockState",
  gender: "blockGender",
  social_category: "blockCategory",
  min_age: "blockMinAge",
  max_age: "blockMaxAge",
  max_income: "blockIncome",
  detailed_rules: "blockRules",
};

export default function ResultsPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [results, setResults] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadResults();
    if (!stored) {
      router.replace("/check");
      return;
    }
    setResults(stored);
    setReady(true);
  }, [router]);

  if (!ready || !results) return null;

  const { matches = [], closest_misses: closestMisses = [] } = results;

  if (matches.length === 0) {
    return (
      <div>
        <h1 className="mb-1 text-2xl font-bold">{t("noMatchesTitle")}</h1>
        <p className="mb-4 text-sm text-gray-600">{t("noMatchesDesc")}</p>
        <div className="flex flex-col gap-3">
          {closestMisses.map((miss) => (
            <article
              key={miss.slug}
              className="rounded-2xl border border-primary-100 bg-white p-4"
            >
              <h3 className="font-bold">
                {lang === "ta" ? miss.name_ta : miss.name_en}
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                {lang === "ta" ? miss.benefit_ta : miss.benefit_en}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {miss.blocked_on.map((block, index) => (
                  <span
                    key={`${block.field}-${index}`}
                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                  >
                    {t("blockedLabel")}: {t(BLOCK_LABEL_KEYS[block.field] ?? "blockRules")}
                    {block.required !== undefined && block.field !== "detailed_rules"
                      ? ` (${block.required})`
                      : ""}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <Link
          href="/check"
          className="mt-6 block w-full rounded-2xl bg-primary-600 px-6 py-4 text-center text-lg font-bold text-white"
        >
          {t("startOver")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("resultsTitle")}</h1>
      <p className="mb-4 mt-1 text-sm text-gray-600">
        <span className="font-bold text-primary-700">{matches.length}</span>{" "}
        {t("matchesFound")}
      </p>
      <div className="flex flex-col gap-3">
        {matches.map((scheme) => (
          <SchemeCard key={scheme.slug} scheme={scheme} />
        ))}
      </div>
      <Link
        href="/check"
        className="mt-6 block w-full rounded-2xl border border-primary-600 px-6 py-3 text-center font-bold text-primary-700"
      >
        {t("startOver")}
      </Link>
    </div>
  );
}
