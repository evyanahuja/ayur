"use client";

import { useEffect, useState } from "react";

export type Currency = "INR" | "USD";

const STORAGE_KEY = "ayur-currency";
const STORAGE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Legacy fallback: guess from the browser's locale + timezone.
 * This is unreliable for NRIs abroad (their browser often still reports
 * an Indian locale/timezone) and for VPN users, which is why the primary
 * detection is IP-based via /api/geo (see detectCurrencyViaServer).
 */
function isIndia(): boolean {
  if (typeof window === "undefined") return true;
  const locale = window.navigator.languages?.length ? window.navigator.languages : [window.navigator.language];
  const localeMatch = locale.some((value) => /^en-(in)?$/i.test(value) || /-(in)$/i.test(value) || /^hi($|-)/i.test(value) || /^mr($|-)/i.test(value) || /^gu($|-)/i.test(value));
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const tzMatch = timeZone.toLowerCase() === "asia/kolkata" || timeZone.toLowerCase() === "asia/calcutta";
  return localeMatch || tzMatch;
}

function readStoredCurrency(): Currency | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.value !== "INR" && parsed?.value !== "USD") return null;
    if (typeof parsed?.ts !== "number" || Date.now() - parsed.ts > STORAGE_TTL) return null;
    return parsed.value as Currency;
  } catch {
    return null;
  }
}

function storeCurrency(c: Currency) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: c, ts: Date.now() }));
  } catch {
    // storage may be unavailable (private mode) — ignore
  }
}

/** Ask the server where the visitor's IP is located (via host geo headers). */
async function detectCurrencyViaServer(): Promise<Currency | null> {
  try {
    const res = await fetch("/api/geo", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { currency?: string | null };
    if (data.currency === "INR" || data.currency === "USD") return data.currency;
    return null;
  } catch {
    return null;
  }
}

export function useRegionCurrency(): Currency {
  // Start at INR so the first client render matches the static HTML (no
  // hydration mismatch); the effect below corrects it for non-India visitors.
  const [currency, setCurrency] = useState<Currency>("INR");

  useEffect(() => {
    let cancelled = false;

    // Repeat visits: apply the remembered currency instantly (no price flash),
    // then still refresh from the server in case the visitor moved/travelled.
    const stored = readStoredCurrency();
    if (stored) setCurrency(stored);

    detectCurrencyViaServer()
      .then((serverCurrency) => {
        if (cancelled) return;
        const resolved = serverCurrency ?? (isIndia() ? "INR" : "USD");
        storeCurrency(resolved);
        setCurrency(resolved);
      })
      .catch(() => {
        if (cancelled) return;
        const resolved = isIndia() ? "INR" : "USD";
        storeCurrency(resolved);
        setCurrency(resolved);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return currency;
}
