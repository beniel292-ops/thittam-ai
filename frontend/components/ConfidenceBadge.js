"use client";

import { useLanguage } from "@/lib/i18n";

export default function ConfidenceBadge({ eligible, label }) {
  const { lang } = useLanguage();
  const styles =
    eligible === "yes"
      ? "bg-primary-100 text-primary-700"
      : "bg-amber-100 text-amber-800";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${styles}`}>
      {label?.[lang] ?? label?.en}
    </span>
  );
}
