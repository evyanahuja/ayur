"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, LEGACY_STORAGE_KEY, STORAGE_KEY, type Language } from "./config";
import { getDictionary, type Dictionary } from "./index";

type LanguageContextValue = {
  lang: Language;
  setLang: (l: Language) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANGUAGE_CHANGE_EVENT = "ayur-language-change";

function readInitial(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const saved = (window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY)) as Language | null;
    if (saved === "en" || saved === "hi" || saved === "mr" || saved === "gu") return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

function subscribeToLanguageChanges(onChange: () => void) {
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getServerLanguage(): Language {
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeToLanguageChanges, readInitial, getServerLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
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
