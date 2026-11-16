import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/vopd/store";
import { isDateString } from "@/lib/vopd/slots";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? "";
  const planId = url.searchParams.get("plan") || "first";
  if (!isDateString(date)) {
    return NextResponse.json({ ok: false, error: "Choose a valid consultation date." }, { status: 400 });
  }
  try {
    const availability = await getAvailability(date, planId);
    return NextResponse.json({ ok: true, ...availability });
  } catch (error) {
    console.error("VOPD availability failed:", error);
    return NextResponse.json({ ok: false, error: "Could not load available times. Please try again." }, { status: 500 });
  }
}
