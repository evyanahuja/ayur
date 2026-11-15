import { NextResponse } from "next/server";
import { publicVopdConfig, getVopdPlans } from "@/lib/vopd/config";
import { isDatabaseConfigured } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = publicVopdConfig();
  return NextResponse.json({
    ok: true,
    bookingAvailable: isDatabaseConfigured(),
    plans: getVopdPlans(),
    config,
  });
}
