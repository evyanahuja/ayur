import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { SITE } from "@/content/site";

export const dynamic = "force-dynamic";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function GET() {
  const key = (process.env.INDEXNOW_KEY || "").trim();
  const entries = sitemap();
  const siteHost = new URL(SITE.siteUrl).host;

  return NextResponse.json({
    ok: true,
    configured: Boolean(key),
    host: siteHost,
    siteUrl: SITE.siteUrl,
    keyLocation: `${SITE.siteUrl}/indexnow-key.txt`,
    endpoint: INDEXNOW_ENDPOINT,
    urlCount: entries.length,
    sampleUrls: entries.slice(0, 6).map((e) => e.url),
  });
}

export async function POST(req: Request) {
  const key = (process.env.INDEXNOW_KEY || "").trim();
  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error:
          "INDEXNOW_KEY is not set. Add INDEXNOW_KEY (a 16-32 character hex/alphanumeric string) to your hosting environment variables, redeploy, and run again.",
      },
      { status: 400 }
    );
  }

  const adminSecret = (process.env.INDEXNOW_ADMIN_SECRET || "").trim();
  if (adminSecret) {
    const provided = req.headers.get("x-indexnow-secret")?.trim() || "";
    if (provided !== adminSecret) {
      return NextResponse.json(
        { ok: false, error: "Invalid x-indexnow-secret header." },
        { status: 401 }
      );
    }
  }

  const body = await req.json().catch(() => ({}));
  const defaultUrls = sitemap().map((entry) => entry.url);
  const requestedUrls = Array.isArray(body?.urls)
    ? body.urls.filter((u: unknown): u is string => typeof u === "string" && u.startsWith("http"))
    : defaultUrls;

  const urlList = Array.from(new Set(requestedUrls));
  const siteHost = new URL(SITE.siteUrl).host;
  const keyLocation = `${SITE.siteUrl}/indexnow-key.txt`;

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: siteHost,
        key,
        keyLocation,
        urlList,
      }),
    });

    const responseText = await res.text().catch(() => "");
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      submittedCount: urlList.length,
      host: siteHost,
      keyLocation,
      message: res.ok
        ? `Submitted ${urlList.length} canonical URLs to IndexNow (Bing, Copilot, Yandex, Seznam, Naver).`
        : `IndexNow returned HTTP ${res.status}: ${responseText || res.statusText}`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to reach api.indexnow.org",
      },
      { status: 502 }
    );
  }
}
