"use client";

import { useLanguage } from "@/lib/i18n";

export default function Disclaimer() {
  const { t } = useLanguage();
  return (
    <footer className="mx-auto w-full max-w-xl px-4 pb-6 pt-2">
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-center text-xs leading-relaxed text-amber-900">
        {t("disclaimer")}
      </p>
    </footer>
  );
}
