export const dynamic = "force-dynamic";

export async function GET() {
  const key = (process.env.INDEXNOW_KEY || "").trim();

  if (!key) {
    return new Response(
      "INDEXNOW_KEY is not configured. Set INDEXNOW_KEY in your environment variables to enable instant Bing/Copilot URL indexing.",
      {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
