"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, toggle } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-card/60 px-3 text-sm font-semibold text-foreground transition-all hover:scale-105 hover:border-accent"
    >
      {lang === "ar" ? "EN" : "ع"}
    </button>
  );
}
