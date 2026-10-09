import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Resolve the visitor's country from CDN/host geo headers.
 *
 * Header priority (first match wins):
 *   - x-vercel-ip-country      (Vercel)
 *   - cf-ipcountry             (Cloudflare)
 *   - x-country                (Netlify, MaxMind-based)
 *   - x-nf-geo                 (Netlify, base64 JSON: { country: { code } })
 *   - x-nf-country             (Netlify variant)
 *   - cloudfront-viewer-country (AWS CloudFront)
 */
function countryFromHeaders(h: Headers): string | null {
  const direct =
    h.get("x-vercel-ip-country") ||
    h.get("cf-ipcountry") ||
    h.get("x-country") ||
    h.get("x-nf-country") ||
    h.get("cloudfront-viewer-country");

  if (direct && /^[a-zA-Z]{2}$/.test(direct.trim())) {
    return direct.trim().toUpperCase();
  }

  const nfGeo = h.get("x-nf-geo");
  if (nfGeo) {
    try {
      const decoded = JSON.parse(Buffer.from(nfGeo, "base64").toString("utf8"));
      const code = decoded?.country?.code;
      if (typeof code === "string" && /^[a-zA-Z]{2}$/.test(code)) {
        return code.toUpperCase();
      }
    } catch {
      // malformed header — fall through
    }
  }

  return null;
}

export async function GET(req: Request) {
  const country = countryFromHeaders(new Headers(req.headers));
  // India sees INR prices; everyone else (incl. NRI abroad) sees USD.
  const currency: "INR" | "USD" | null = !country
    ? null
    : country === "IN"
      ? "INR"
      : "USD";

  return NextResponse.json(
    { country, currency },
    {
      headers: {
        // Per-visitor response; cache briefly at the CDN to absorb reloads.
        "Cache-Control": "private, max-age=300",
      },
    }
  );
}
