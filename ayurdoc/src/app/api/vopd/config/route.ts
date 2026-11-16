import { NextResponse } from "next/server";
import { ADVANCE_DAYS, getAllActiveVopdPlans, publicVopdConfig } from "@/lib/vopd/config";
import { ensureVopdSchema, getOpenClinicDates } from "@/lib/vopd/store";
import { addDaysToDateString, todayInClinic } from "@/lib/vopd/slots";
import { isDatabaseConfigured } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbReady = isDatabaseConfigured();
  if (dbReady) {
    try {
      await ensureVopdSchema();
    } catch (err) {
      console.error("VOPD config schema init warning:", err);
    }
  }
  const [plans, openDates] = await Promise.all([
    getAllActiveVopdPlans(),
    getOpenClinicDates(30, 6),
  ]);
  const config = publicVopdConfig();
  const today = todayInClinic();
  const maxDate = addDaysToDateString(today, ADVANCE_DAYS);
  return NextResponse.json({
    ok: true,
    bookingAvailable: dbReady,
    today,
    maxDate,
    openDates,
    defaultDate: openDates[0] ?? today,
    plans,
    config,
  });
}
