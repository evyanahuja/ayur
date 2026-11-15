import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  adminAuthConfigured,
  createSessionToken,
  loginAllowed,
  resetLoginAttempts,
  verifyPassword,
} from "@/lib/vopd/admin";

export const dynamic = "force-dynamic";

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { ok: false, error: "The admin console is not configured. Set VOPD_ADMIN_PASSWORD and VOPD_ADMIN_SESSION_SECRET." },
      { status: 503 }
    );
  }
  const key = clientKey(request);
  if (!loginAllowed(key)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  const body = await request.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }
  const token = createSessionToken();
  if (!token) return NextResponse.json({ ok: false, error: "Session could not be created." }, { status: 500 });
  resetLoginAttempts(key);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, ADMIN_COOKIE_OPTIONS);
  return NextResponse.json({ ok: true });
}
