"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Languages, X } from "lucide-react";
import { LANGUAGES, type Language } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({
  compact = false,
  mobile = false,
  fullWidth = false,
}: {
  compact?: boolean;
  mobile?: boolean;
  fullWidth?: boolean;
}) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (mobile && sheetRef.current?.contains(e.target as Node)) return;
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (mobile && e.key === "Tab" && sheetRef.current) {
        const buttons = [...sheetRef.current.querySelectorAll<HTMLButtonElement>("button")];
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobile]);

  useEffect(() => {
    if (!mobile || !open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [mobile, open]);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const pick = (code: Language) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn(mobile ? "shrink-0" : "relative shrink-0", fullWidth && "w-full")}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup={mobile ? "dialog" : "listbox"}
        aria-expanded={open}
        aria-controls={mobile ? "mobile-language-sheet" : undefined}
        aria-label={t.common.selectLanguage}
        title={t.common.selectLanguage}
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-saffron-500/35 bg-white/80 backdrop-blur-md font-semibold text-forest-900 transition-all duration-300 hover:border-saffron-500/65 hover:bg-white hover:shadow-md whitespace-nowrap",
          fullWidth
            ? "h-12 w-full gap-2 px-4 text-[14px]"
            : mobile
              ? "h-10 gap-1 px-2.5 text-xs sm:gap-1.5 sm:px-3"
              : compact
                ? "gap-1.5 px-2.5 py-2 text-xs 2xl:gap-2 2xl:px-3"
                : "gap-2 px-3.5 py-2.5 text-[13px]"
        )}
      >
        <Languages className={cn("shrink-0 text-saffron-600", compact && !mobile ? "w-3.5 h-3.5" : "w-4 h-4")} />
        {fullWidth ? (
          <span className="tracking-wide truncate">{current.native}</span>
        ) : mobile ? (
          <span className="tracking-wide">
            <span className="sm:hidden">{current.short}</span>
            <span className="hidden sm:inline">{current.native}</span>
          </span>
        ) : compact ? (
          <span className="tracking-wide">
            <span className="2xl:hidden">{current.short}</span>
            <span className="hidden 2xl:inline">{current.native}</span>
          </span>
        ) : (
          <span className="tracking-wide">{current.native}</span>
        )}
        <ChevronDown
          className={cn(
            "shrink-0 text-forest-600 transition-transform duration-300",
            compact || (mobile && !fullWidth) ? "w-3 h-3" : "w-3.5 h-3.5",
            open && "rotate-180"
          )}
        />
      </button>

      {!mobile && (
        <div
          role="listbox"
          aria-label={t.common.language}
          className={cn(
            "absolute right-0 top-[calc(100%+8px)] z-[140] w-48 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-forest-100 bg-white/98 p-1.5 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(14,43,33,0.35)] transition-all duration-200 origin-top-right",
            open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          )}
        >
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(l.code)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13.5px] transition-colors",
                  active ? "bg-forest-50 font-bold text-forest-950" : "font-medium text-forest-800/85 hover:bg-cream-100 hover:text-forest-950"
                )}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={cn(
                      "grid place-items-center w-7 h-7 rounded-lg text-[11px] font-bold shrink-0",
                      active ? "bg-forest-900 text-saffron-300" : "bg-forest-50 text-forest-700"
                    )}
                  >
                    {l.short}
                  </span>
                  <span className="truncate">{l.native}</span>
                </span>
                {active && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {mobile &&
        open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[140] flex items-end sm:items-center justify-center bg-forest-950/55 p-3 pb-[max(14px,env(safe-area-inset-bottom))] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              id="mobile-language-sheet"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.common.selectLanguage}
              className="w-full max-w-sm overflow-hidden rounded-[26px] border border-saffron-500/30 bg-cream-50 p-2.5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-forest-900/15 sm:hidden" aria-hidden />
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-[13.5px] font-semibold text-forest-950">{t.common.selectLanguage}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-forest-100 text-forest-900 hover:bg-forest-200 transition-colors"
                  aria-label={t.nav.closeMenu}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-1">
                {LANGUAGES.map((l) => {
                  const active = l.code === lang;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      aria-pressed={active}
                      onClick={() => pick(l.code)}
                      className={cn(
                        "flex min-h-[52px] w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-[15px] transition-colors",
                        active ? "bg-forest-100 font-bold text-forest-950" : "font-medium text-forest-800 hover:bg-cream-200"
                      )}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-lg text-[11px] font-bold shrink-0",
                            active ? "bg-forest-950 text-saffron-300" : "bg-white text-forest-700 border border-forest-900/10"
                          )}
                        >
                          {l.short}
                        </span>
                        <span className="leading-tight">
                          <span className="block">{l.native}</span>
                          {l.code !== "en" && (
                            <span className="block text-[11px] font-normal text-forest-700/65">{l.label}</span>
                          )}
                        </span>
                      </span>
                      {active && <Check className="h-5 w-5 text-emerald-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
