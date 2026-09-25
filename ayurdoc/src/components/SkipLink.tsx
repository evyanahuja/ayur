"use client";

import { useLanguage } from "@/i18n/LanguageContext";

export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-forest-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
    >
      {t.common.skip}
    </a>
  );
}
