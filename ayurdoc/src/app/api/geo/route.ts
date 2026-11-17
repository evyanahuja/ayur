import { NextResponse } from "next/server";
import { countryFromHeaders, currencyFromHeaders } from "@/lib/geo";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const headers = new Headers(req.headers);
  const country = countryFromHeaders(headers);
  // India sees INR prices; visitors outside India see independently stored USD prices.
  const currency = currencyFromHeaders(headers);

  return NextResponse.json(
    { country, currency },
    {
      headers: {
        // Per-visitor response; never allow shared caches to mix countries.
        "Cache-Control": "private, no-store, must-revalidate",
        Vary: "x-vercel-ip-country, cf-ipcountry, x-country, x-nf-country, x-nf-geo, cloudfront-viewer-country",
      },
    }
  );
}
