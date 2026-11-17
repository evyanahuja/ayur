export type RegionCurrency = "INR" | "USD";

/**
 * Resolve the visitor's ISO-3166 alpha-2 country code from CDN/host geo headers.
 *
 * Header priority (first match wins):
 *   - x-vercel-ip-country       (Vercel)
 *   - cf-ipcountry              (Cloudflare; ignores XX=unknown and T1=Tor)
 *   - x-country                 (Netlify, MaxMind-based)
 *   - x-nf-country              (Netlify variant)
 *   - cloudfront-viewer-country (AWS CloudFront)
 *   - x-nf-geo                  (Netlify, base64 JSON: { country: { code } })
 */
export function countryFromHeaders(h: Headers): string | null {
  const candidates = [
    h.get("x-vercel-ip-country"),
    h.get("cf-ipcountry"),
    h.get("x-country"),
    h.get("x-nf-country"),
    h.get("cloudfront-viewer-country"),
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const code = raw.trim().toUpperCase();
    if (/^[A-Z]{2}$/.test(code) && code !== "XX" && code !== "T1") {
      return code;
    }
  }

  const nfGeo = h.get("x-nf-geo");
  if (nfGeo) {
    try {
      const decoded = JSON.parse(Buffer.from(nfGeo, "base64").toString("utf8"));
      const rawCode = typeof decoded?.country?.code === "string" ? decoded.country.code.trim().toUpperCase() : "";
      if (/^[A-Z]{2}$/.test(rawCode) && rawCode !== "XX" && rawCode !== "T1") {
        return rawCode;
      }
    } catch {
      // malformed header — fall through
    }
  }

  return null;
}

/**
 * Convert host-detected country into the applicable billing currency.
 * Returns null when the host did not provide a verified country header.
 */
export function currencyFromHeaders(h: Headers): RegionCurrency | null {
  const country = countryFromHeaders(h);
  if (!country) return null;
  return country === "IN" ? "INR" : "USD";
}

/**
 * Server-authoritative billing currency for booking and enquiry APIs:
 * - When CDN/host geo headers identify the visitor's country, strictly enforce
 *   IN -> INR and outside-IN -> USD (ignoring any browser-supplied currency).
 * - When host geo headers are absent (e.g. local dev / non-CDN environment),
 *   accept an automatically detected client hint of "USD" or default safely to "INR".
 */
export function resolveRequestCurrency(h: Headers, clientHint?: unknown): RegionCurrency {
  const detected = currencyFromHeaders(h);
  if (detected) return detected;
  return clientHint === "USD" ? "USD" : "INR";
}
