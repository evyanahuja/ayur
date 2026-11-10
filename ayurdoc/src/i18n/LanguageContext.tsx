"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, STORAGE_KEY, type Language } from "./config";
import { getDictionary, type Dictionary } from "./index";

type LanguageContextValue = {
  lang: Language;
  setLang: (l: Language) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitial(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === "en" || saved === "hi" || saved === "mr" || saved === "gu") return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANGUAGE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLangState(readInitial());
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Restore the saved language before writing any preference back to storage.
    if (!hydrated) return;
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang, hydrated]);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
  }, []);

  const t = useMemo(() => getDictionary(lang), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  // Keep the initial render deterministic, then apply the remembered language.
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback for server render / outside provider: English
    return { lang: DEFAULT_LANGUAGE, setLang: () => {}, t: getDictionary(DEFAULT_LANGUAGE) };
  }
  return ctx;
}

export function useDictionary(): Dictionary {
  return useLanguage().t;
}
