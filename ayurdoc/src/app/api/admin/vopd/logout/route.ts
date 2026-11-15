import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/vopd/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", { ...{ httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" }, maxAge: 0 });
  return NextResponse.json({ ok: true });
}
