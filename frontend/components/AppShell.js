"use client";

import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";
import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/lib/i18n";

export default function AppShell({ children }) {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-primary-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-primary-700">
            {t("appName")}
          </Link>
          <LanguageToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">{children}</main>
      <Disclaimer />
    </div>
  );
}
