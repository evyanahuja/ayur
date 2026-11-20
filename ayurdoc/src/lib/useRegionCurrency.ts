"use client";

import { useEffect, useSyncExternalStore } from "react";

export type Currency = "INR" | "USD";

const STORAGE_KEY = "ayur-currency";
const CHANGE_EVENT = "ayur-currency-change";
const AUTO_TTL = 7 * 24 * 60 * 60 * 1000;

type AutoStored = { value: Currency; ts: number; auto: true };

let inFlightDetection: Promise<Currency> | null = null;
let resolvedSessionCurrency: Currency | null = null;

function readAutoCurrency(): Currency | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const item = JSON.parse(raw) as Partial<AutoStored> & { manual?: boolean };
    // Discard any legacy manual selection; currency is strictly location-based.
    if (item?.manual || item?.auto !== true) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (item.value !== "INR" && item.value !== "USD") return null;
    if (typeof item.ts !== "number" || !Number.isFinite(item.ts) || Date.now() - item.ts > AUTO_TTL) {
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
}

function storeAutoCurrency(value: Currency) {
  resolvedSessionCurrency = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, ts: Date.now(), auto: true }));
  } catch {
    // storage unavailable (private mode) — ignore
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Secondary fallback used only when host/CDN IP geo headers are absent
 * (e.g. non-CDN environments). India timezones resolve to INR; concrete
 * non-India IANA timezones resolve to USD; missing or generic UTC/GMT
 * timezones default safely to INR.
 */
function fallbackCurrencyFromTimezone(): Currency {
  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").trim().toLowerCase();
    if (!tz || tz === "utc" || tz === "gmt" || tz === "etc/utc" || tz === "etc/gmt") {
      return "INR";
    }
    if (tz === "asia/kolkata" || tz === "asia/calcutta") {
      return "INR";
    }
    if (tz.includes("/")) {
      return "USD";
    }
    return "INR";
  } catch {
    return "INR";
  }
}

async function detectCurrencyOnce(): Promise<Currency> {
  if (resolvedSessionCurrency) return resolvedSessionCurrency;
  if (!inFlightDetection) {
    inFlightDetection = (async () => {
      try {
        const response = await fetch("/api/geo", { cache: "no-store" });
        if (response.ok) {
          const data = (await response.json()) as { currency?: string | null };
          if (data.currency === "INR" || data.currency === "USD") {
            storeAutoCurrency(data.currency);
            return data.currency;
          }
        }
      } catch {
        // network failure — fall through to timezone/INR fallback
      }
      const fallback = fallbackCurrencyFromTimezone();
      storeAutoCurrency(fallback);
      return fallback;
    })().finally(() => {
      inFlightDetection = null;
    });
  }
  return inFlightDetection;
}

/**
 * Automatic location-based currency (IN -> INR, outside IN -> USD).
 * No manual currency switching is exposed anywhere on the site.
 */
function subscribeToCurrencyChanges(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getCurrencySnapshot(): Currency {
  return resolvedSessionCurrency ?? readAutoCurrency() ?? "INR";
}

function getServerCurrencySnapshot(): Currency {
  return "INR";
}

export function useRegionCurrency(): Currency {
  const currency = useSyncExternalStore(
    subscribeToCurrencyChanges,
    getCurrencySnapshot,
    getServerCurrencySnapshot
  );

  useEffect(() => {
    void detectCurrencyOnce();
  }, []);

  return currency;
}
