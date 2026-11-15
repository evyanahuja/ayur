/* Minimal, dependency-free administrator session for the VOPD console.
   - Password: VOPD_ADMIN_PASSWORD (or VOPD_ADMIN_PASSWORD_SHA256)
   - Session: HMAC-SHA256 signed, HttpOnly, SameSite=Lax cookie
   - Rotation: change VOPD_ADMIN_SESSION_SECRET to invalidate all sessions. */
import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "vopd_admin";
export const SESSION_MINUTES = 120;
export const ADMIN_NAME = process.env.VOPD_ADMIN_NAME?.trim() || "Clinic administrator";

type SessionPayload = { sub: string; exp: number };

function secret(): string | null {
  const value = process.env.VOPD_ADMIN_SESSION_SECRET?.trim();
  return value && value.length >= 32 ? value : null;
}

function sign(payload: string): string | null {
  const key = secret();
  if (!key) return null;
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function adminAuthConfigured(): boolean {
  const password = process.env.VOPD_ADMIN_PASSWORD?.trim();
  const hash = process.env.VOPD_ADMIN_PASSWORD_SHA256?.trim();
  return Boolean((password || hash) && secret());
}

export function verifyPassword(candidate: string): boolean {
  const plain = process.env.VOPD_ADMIN_PASSWORD?.trim();
  const sha = process.env.VOPD_ADMIN_PASSWORD_SHA256?.trim().toLowerCase();
  if (!plain && !sha) return false;
  const supplied = Buffer.from(candidate ?? "", "utf8");
  if (sha) {
    const digest = Buffer.from(createHash("sha256").update(supplied).digest("hex"), "utf8");
    const expected = Buffer.from(sha, "utf8");
    return digest.length === expected.length && timingSafeEqual(digest, expected);
  }
  const expected = Buffer.from(plain as string, "utf8");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function createSessionToken(): string | null {
  const signature = sign("");
  if (!signature) return null;
  const payload: SessionPayload = { sub: ADMIN_NAME, exp: Date.now() + SESSION_MINUTES * 60_000 };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = sign(encoded);
  return sig ? `${encoded}.${sig}` : null;
}

export function readSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  if (!expected) return null;
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (typeof payload.sub !== "string" || !payload.sub) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Admins calling route handlers. Returns the administrator name or null. */
export async function requireAdmin(): Promise<string | null> {
  const store = await cookies();
  return readSessionToken(store.get(ADMIN_COOKIE)?.value)?.sub ?? null;
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MINUTES * 60,
};

/* Best-effort login throttling (per server instance). */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 6;

export function loginAllowed(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_ATTEMPTS;
}

export function resetLoginAttempts(key: string) {
  attempts.delete(key);
}
