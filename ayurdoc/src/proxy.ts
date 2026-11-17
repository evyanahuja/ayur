import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly middleware) — guarantees security headers on
 * EVERY HTML/RSC/API response, including ones served from Netlify's Durable
 * cache that may have been stored before the headers existed.
 *
 * Strict anti-framing headers (X-Frame-Options: SAMEORIGIN, frame-ancestors 'self',
 * COOP, HSTS, upgrade-insecure-requests) are enforced on Netlify and on the
 * configured production domain, and omitted on non-Netlify preview/local hosts
 * so embedded iframe previews can render the site.
 */
const isDev = process.env.NODE_ENV !== "production";

function configuredProductionHost(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ayurveddoctor.netlify.app";
  try {
    return new URL(raw).host.toLowerCase();
  } catch {
    return "ayurveddoctor.netlify.app";
  }
}

const PROD_HOST = configuredProductionHost();

function shouldEnforceFrameLock(request: NextRequest): boolean {
  if (process.env.ALLOW_PREVIEW_EMBED === "true") return false;
  if (process.env.NETLIFY === "true") return true;
  if (isDev || process.env.E2B_SANDBOX === "true" || Boolean(process.env.E2B_SANDBOX_ID)) {
    return false;
  }
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().toLowerCase();
  const host = forwardedHost || request.headers.get("host")?.trim().toLowerCase() || "";
  if (!host) return false;
  return host === PROD_HOST || host === "ayurveddoctor.netlify.app";
}

function buildCsp(enforceFrameLock: boolean): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://images.pexels.com https://*.pexels.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "child-src 'self' https://www.google.com https://maps.google.com",
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
  ];

  if (enforceFrameLock) {
    directives.push("frame-ancestors 'self'", "upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const enforceFrameLock = shouldEnforceFrameLock(request);

  response.headers.set("Content-Security-Policy", buildCsp(enforceFrameLock));
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );

  if (enforceFrameLock) {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  } else {
    response.headers.delete("X-Frame-Options");
  }

  return response;
}

export const config = {
  // Skip static build assets, images, icons, and search crawler verification files
  matcher: [
    "/((?!_next/static|_next/image|images/|favicon\\.ico|favicon\\.svg|apple-touch-icon\\.png|icon-|site\\.webmanifest|google[a-z0-9]+\\.html|BingSiteAuth\\.xml|indexnow-key\\.txt|sitemap\\.xml|robots\\.txt).*)",
  ],
};
