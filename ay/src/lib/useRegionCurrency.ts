"use client";

import { useEffect, useState } from "react";

export type Currency = "INR" | "USD";

function isIndia(): boolean {
  if (typeof window === "undefined") return true;
  const locale = window.navigator.languages?.length ? window.navigator.languages : [window.navigator.language];
  const localeMatch = locale.some((value) => /^en-(in)?$/i.test(value) || /-(in)$/i.test(value) || /^hi($|-)/i.test(value) || /^mr($|-)/i.test(value) || /^gu($|-)/i.test(value));
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const tzMatch = timeZone.toLowerCase() === "asia/kolkata" || timeZone.toLowerCase() === "asia/calcutta";
  return localeMatch || tzMatch;
}

export function useRegionCurrency(): Currency {
  const [currency, setCurrency] = useState<Currency>("INR");

  useEffect(() => {
    setCurrency(isIndia() ? "INR" : "USD");
  }, []);

  return currency;
}
