"use client";

/** Full-screen matching overlay with rotating bilingual status messages —
 * matching takes 5-15s, so the wait has to feel alive. */

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

export default function LoadingMatcher() {
  const { t } = useLanguage();
  const messages = t("loadingMessages");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      2500
    );
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-primary-50/95 px-8">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
      <p className="text-center text-lg font-semibold text-primary-700" aria-live="polite">
        {messages[index]}
      </p>
    </div>
  );
}
