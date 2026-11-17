import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { doctorProfileTranslations } from "@/db/schema";
import { ensureVopdSchema } from "@/lib/vopd/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: true, translations: {} });
  try {
    await ensureVopdSchema();
    const rows = await db.select().from(doctorProfileTranslations);
    return NextResponse.json({ ok: true, translations: Object.fromEntries(rows.map((row) => [row.language, {
      introduction: row.introduction,
      careParagraphs: JSON.parse(row.careParagraphsJson) as string[],
    }])) });
  } catch (error) {
    console.error("Doctor profile unavailable; translated defaults remain visible:", error);
    return NextResponse.json({ ok: true, translations: {} });
  }
}
