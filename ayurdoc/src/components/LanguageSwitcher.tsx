"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { LANGUAGES, type Language } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const pick = (code: Language) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.common.selectLanguage}
        title={t.common.selectLanguage}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-white/70 backdrop-blur-md font-semibold text-forest-900 transition-all duration-300 hover:border-saffron-500/60 hover:bg-white hover:shadow-md",
          compact ? "px-3 py-2 text-xs" : "px-3.5 py-2.5 text-[13px]"
        )}
      >
        <Languages className={cn("text-saffron-600", compact ? "w-3.5 h-3.5" : "w-4 h-4")} />
        <span className="tracking-wide">{current.native}</span>
        <ChevronDown className={cn("text-forest-600 transition-transform duration-300", compact ? "w-3 h-3" : "w-3.5 h-3.5", open && "rotate-180")} />
      </button>

      <div
        role="listbox"
        aria-label={t.common.language}
        className={cn(
          "absolute right-0 top-[calc(100%+8px)] z-[70] w-44 overflow-hidden rounded-2xl border border-forest-100 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(14,43,33,0.35)] transition-all duration-300 origin-top-right",
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        )}
      >
        {LANGUAGES.map((l) => {
          const active = l.code === lang;
          return (
            <button
              key={l.code}
              role="option"
              aria-selected={active}
              onClick={() => pick(l.code)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left text-[13.5px] transition-colors",
                active ? "bg-forest-50 font-bold text-forest-950" : "font-medium text-forest-800/80 hover:bg-cream-100 hover:text-forest-950"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid place-items-center w-7 h-7 rounded-lg text-[11px] font-bold",
                    active ? "bg-forest-900 text-saffron-300" : "bg-forest-50 text-forest-700"
                  )}
                >
                  {l.short}
                </span>
                {l.native}
              </span>
              {active && <Check className="w-4 h-4 text-emerald-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
