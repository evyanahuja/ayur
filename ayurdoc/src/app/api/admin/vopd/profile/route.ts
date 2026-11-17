import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { doctorProfileTranslations, vopdAuditLog } from "@/db/schema";
import { ensureVopdSchema } from "@/lib/vopd/store";
import { requireAdmin } from "@/lib/vopd/admin";
import { isVopdLocale } from "@/i18n/vopd";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database unavailable." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const { language, introduction, careParagraphs } = body;
  if (!isVopdLocale(language) || typeof introduction !== "string" || introduction.trim().length < 40 || introduction.length > 2000 ||
      !Array.isArray(careParagraphs) || careParagraphs.length < 2 || careParagraphs.length > 4 ||
      careParagraphs.some((paragraph) => typeof paragraph !== "string" || paragraph.trim().length < 40 || paragraph.length > 1500)) {
    return NextResponse.json({ ok: false, error: "Choose a supported language, a 40–2000 character introduction and 2–4 substantial care paragraphs." }, { status: 400 });
  }
  await ensureVopdSchema();
  await db.transaction(async (tx) => {
    await tx.insert(doctorProfileTranslations).values({ language, introduction: introduction.trim(),
      careParagraphsJson: JSON.stringify(careParagraphs.map((p: string) => p.trim())), updatedBy: admin, updatedAt: new Date() })
      .onConflictDoUpdate({ target: doctorProfileTranslations.language, set: {
        introduction: introduction.trim(), careParagraphsJson: JSON.stringify(careParagraphs.map((p: string) => p.trim())),
        updatedBy: admin, updatedAt: new Date(),
      } });
    await tx.insert(vopdAuditLog).values({ reference: `PROFILE-${language}`, action: "DOCTOR_PROFILE_UPDATED", actor: admin,
      note: `Edited ${language} introduction and care paragraphs; credentials and registration unchanged.` });
  });
  return NextResponse.json({ ok: true });
}
