/* VOPD persistence and state machine. All money, durations and slot validity are
   recomputed here; database rows are the source of truth (never localStorage). */
import { randomBytes } from "node:crypto";
import { and, asc, desc, eq, gte, inArray, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { vopdAuditLog, vopdBlockedSlots, vopdBookings, vopdPaymentScreenshots, type VopdBooking } from "@/db/schema";
import { canTransition, type BookingStatus, type PaymentStatus } from "@/content/vopd";
import { BUFFER_MINUTES, HOLD_MINUTES, getVopdPlan, getVopdPlans } from "./config";
import {
  addDaysToDateString,
  candidateSlots,
  clinicDateString,
  clinicWallTimeToUtc,
  getStoredEnd,
  isDateString,
  isFutureSlot,
  slotsOverlap,
  todayInClinic,
} from "./slots";
import type { BookingInput } from "./validation";

const BLOCKING: BookingStatus[] = [
  "SLOT_RESERVED",
  "PAYMENT_PENDING",
  "PAYMENT_VERIFICATION_PENDING",
  "PAYMENT_VERIFIED",
  "CONFIRMED",
];
const ACTIVE_UNPAID: BookingStatus[] = ["SLOT_RESERVED", "PAYMENT_PENDING"];

export class VopdConflictError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return `VOPD-${out}`;
}

export async function expireStaleHolds(): Promise<number> {
  const now = new Date();
  const stale = await db
    .update(vopdBookings)
    .set({ status: "EXPIRED", updatedAt: now })
    .where(and(inArray(vopdBookings.status, ACTIVE_UNPAID), lt(vopdBookings.holdExpiresAt, now)))
    .returning({ reference: vopdBookings.reference });
  if (stale.length) {
    await db.insert(vopdAuditLog).values(
      stale.map((row) => ({
        reference: row.reference,
        action: "HOLD_EXPIRED",
        fromStatus: "SLOT_RESERVED",
        toStatus: "EXPIRED",
        actor: "system",
        note: "Unpaid reservation hold expired automatically.",
      }))
    );
  }
  return stale.length;
}

async function dayBounds(date: string): Promise<{ start: Date; end: Date }> {
  return { start: clinicWallTimeToUtc(date, "00:00"), end: clinicWallTimeToUtc(addDaysToDateString(date, 1), "00:00") };
}

async function blockingRowsBetween(start: Date, end: Date, excludeReference?: string) {
  const rows = await db
    .select({
      reference: vopdBookings.reference,
      slotStart: vopdBookings.slotStart,
      durationMinutes: vopdBookings.durationMinutes,
    })
    .from(vopdBookings)
    .where(and(inArray(vopdBookings.status, BLOCKING), lt(vopdBookings.slotStart, end), gte(vopdBookings.slotStart, start)));
  return rows.filter((row) => row.reference !== excludeReference).map((row) => ({
    reference: row.reference,
    start: row.slotStart,
    durationMinutes: row.durationMinutes,
  }));
}

async function blockedRows(date: string) {
  return db
    .select({ id: vopdBlockedSlots.id, slotStart: vopdBlockedSlots.slotStart, reason: vopdBlockedSlots.reason })
    .from(vopdBlockedSlots)
    .where(eq(vopdBlockedSlots.blockedDate, date));
}

export type Availability = {
  date: string;
  timeZone: "Asia/Kolkata";
  planId: string;
  durationMinutes: number;
  intervalMinutes: number;
  bufferMinutes: number;
  slots: { startIso: string; label: string }[];
  message?: string;
};

export async function getAvailability(date: string, planId: string): Promise<Availability> {
  const plan = getVopdPlan(planId);
  const base = {
    date,
    timeZone: "Asia/Kolkata" as const,
    planId,
    durationMinutes: plan?.bookingMinutes ?? 30,
    intervalMinutes: 30,
    bufferMinutes: BUFFER_MINUTES,
    slots: [] as { startIso: string; label: string }[],
  };
  if (!plan) return { ...base, message: "Choose a consultation plan to see available times." };
  if (!isDateString(date)) return { ...base, message: "Choose a valid date." };
  const today = todayInClinic();
  if (date < today) return { ...base, message: "Past dates cannot be booked." };
  if (date > addDaysToDateString(today, 30)) return { ...base, message: "Bookings open only for the next 30 days." };

  const now = new Date();
  if (now > new Date(clinicWallTimeToUtc(date, "23:59").getTime())) return { ...base, message: "This clinic day has ended." };

  await expireStaleHolds();
  const { start, end } = await dayBounds(date);
  const [busy, blocked] = await Promise.all([blockingRowsBetween(start, end), blockedRows(date)]);
  const allDayBlocked = blocked.some((row) => !row.slotStart);
  if (allDayBlocked) return { ...base, message: "The clinic is unavailable on this date. Please choose another day." };

  const blockedInstants = new Set(
    blocked.filter((row) => row.slotStart).map((row) => row.slotStart?.getTime())
  );

  const slots = candidateSlots(date, plan.bookingMinutes)
    .filter((slot) => {
      const slotStart = new Date(slot.startIso);
      if (!isFutureSlot(slotStart, now)) return false;
      if (blockedInstants.has(slotStart.getTime())) return false;
      return !busy.some((appt) => slotsOverlap({ start: slotStart, durationMinutes: plan.bookingMinutes }, appt));
    })
    .map((slot) => ({ startIso: slot.startIso, label: slot.label }));

  return { ...base, slots, message: slots.length ? undefined : "No matching slots remain on this date. Please try another day." };
}

export type BookingRecord = VopdBooking;

export async function createBooking(
  input: BookingInput & { start: Date; durationMinutes: number; plan: NonNullable<ReturnType<typeof getVopdPlan>> }
): Promise<BookingRecord> {
  const date = clinicDateString(input.start);
  const bounds = await dayBounds(date);
  const reference = makeReference();
  const allowed = candidateSlots(date, input.durationMinutes).some((slot) => slot.startIso === input.start.toISOString());
  if (!allowed) throw new VopdConflictError("That time is not a valid consultation slot.", "INVALID_SLOT");
  if (!isFutureSlot(input.start)) throw new VopdConflictError("That time has passed.", "PAST_SLOT");

  return db.transaction(async (tx) => {
    // Serialise booking attempts for the same clinic day.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`vopd:${date}`}))`);
    await tx
      .update(vopdBookings)
      .set({ status: "EXPIRED", updatedAt: new Date() })
      .where(and(inArray(vopdBookings.status, ACTIVE_UNPAID), lt(vopdBookings.holdExpiresAt, new Date())));

    const sameDay = await tx
      .select({ reference: vopdBookings.reference, slotStart: vopdBookings.slotStart, durationMinutes: vopdBookings.durationMinutes })
      .from(vopdBookings)
      .where(and(inArray(vopdBookings.status, BLOCKING), gte(vopdBookings.slotStart, bounds.start), lt(vopdBookings.slotStart, bounds.end)));

    const conflict = sameDay.some((row) =>
      slotsOverlap({ start: input.start, durationMinutes: input.durationMinutes }, { start: row.slotStart, durationMinutes: row.durationMinutes })
    );
    if (conflict) throw new VopdConflictError("That slot was just taken. Please choose another time.", "SLOT_TAKEN");

    const blocked = await tx
      .select({ slotStart: vopdBlockedSlots.slotStart })
      .from(vopdBlockedSlots)
      .where(eq(vopdBlockedSlots.blockedDate, date));
    if (blocked.some((row) => !row.slotStart || row.slotStart?.getTime() === input.start.getTime())) {
      throw new VopdConflictError("The clinic is unavailable at that time.", "SLOT_BLOCKED");
    }

    const holdExpiresAt = input.plan.requiresPayment ? new Date(Date.now() + HOLD_MINUTES * 60_000) : null;
    const [row] = await tx
      .insert(vopdBookings)
      .values({
        reference,
        mode: "vopd",
        patientKind: input.patientKind,
        patientName: input.patientName,
        guardianName: input.guardianName ?? null,
        ageOrDob: input.ageOrDob,
        gender: input.gender ?? null,
        phone: input.phone,
        email: input.email ?? null,
        city: input.city ?? null,
        state: input.state ?? null,
        concernCategory: input.concernCategory,
        symptoms: input.symptoms,
        duration: input.duration ?? null,
        previousDiagnosis: input.previousDiagnosis ?? null,
        currentTreatment: input.currentTreatment ?? null,
        message: input.message ?? null,
        planId: input.plan.id,
        planName: input.plan.name,
        amountMinor: input.plan.amountMinor,
        currency: "INR",
        durationMinutes: input.durationMinutes,
        followUpCount: input.plan.followUpCount,
        followUpMinutes: input.plan.followUpMinutes,
        slotStart: input.start,
        slotEnd: getStoredEnd(input.start, input.durationMinutes),
        status: "PAYMENT_PENDING",
        paymentStatus: input.plan.requiresPayment ? "PENDING" : "NOT_REQUIRED",
        holdExpiresAt,
      })
      .returning();

    await tx.insert(vopdAuditLog).values({
      reference,
      action: "BOOKING_CREATED",
      fromStatus: null,
      toStatus: "PAYMENT_PENDING",
      actor: "patient",
      note: `VOPD reservation for ${input.plan.name} (server-computed fee).`,
    });

    return row;
  });
}

export async function getBooking(reference: string): Promise<BookingRecord | undefined> {
  const [row] = await db.select().from(vopdBookings).where(eq(vopdBookings.reference, reference)).limit(1);
  return row;
}

export async function getPublicBooking(reference: string) {
  const row = await getBooking(reference);
  if (!row) return undefined;
  return {
    reference: row.reference,
    patientKind: row.patientKind,
    patientName: row.patientName,
    planName: row.planName,
    amountMinor: row.amountMinor,
    currency: row.currency,
    durationMinutes: row.durationMinutes,
    slotStart: row.slotStart.toISOString(),
    status: row.status,
    paymentStatus: row.paymentStatus,
    holdExpiresAt: row.holdExpiresAt?.toISOString() ?? null,
    meetUrl: row.status === "CONFIRMED" ? row.meetUrl : null,
    createdAt: row.createdAt.toISOString(),
  };
}

export type ScreenshotInput = { mimeType: string; sizeBytes: number; data: Buffer };

export async function submitPayment(reference: string, payment: { payerName: string; upiReference: string }, screenshot?: ScreenshotInput) {
  const now = new Date();
  const [updated] = await db
    .update(vopdBookings)
    .set({
      payerName: payment.payerName,
      upiReference: payment.upiReference,
      paymentStatus: "SUBMITTED",
      paymentSubmittedAt: now,
      status: "PAYMENT_VERIFICATION_PENDING",
      holdExpiresAt: null,
      updatedAt: now,
    })
    .where(
      and(
        eq(vopdBookings.reference, reference),
        inArray(vopdBookings.status, ACTIVE_UNPAID),
        eq(vopdBookings.paymentStatus, "PENDING")
      )
    )
    .returning();

  if (!updated) {
    const existing = await getBooking(reference);
    if (!existing) throw new VopdConflictError("Booking not found.", "NOT_FOUND");
    if (existing.paymentStatus === "SUBMITTED" || existing.paymentStatus === "VERIFIED") {
      throw new VopdConflictError("Payment details have already been submitted for this booking.", "PAYMENT_ALREADY_SUBMITTED");
    }
    throw new VopdConflictError("This reservation has expired or been cancelled. Please start a new booking.", "RESERVATION_CLOSED");
  }

  if (screenshot) {
    await db
      .insert(vopdPaymentScreenshots)
      .values({ reference, mimeType: screenshot.mimeType, sizeBytes: screenshot.sizeBytes, data: screenshot.data })
      .onConflictDoUpdate({
        target: vopdPaymentScreenshots.reference,
        set: { mimeType: screenshot.mimeType, sizeBytes: screenshot.sizeBytes, data: screenshot.data, uploadedAt: now },
      });
  }

  await db.insert(vopdAuditLog).values({
    reference,
    action: "PAYMENT_SUBMITTED",
    fromStatus: "PAYMENT_PENDING",
    toStatus: "PAYMENT_VERIFICATION_PENDING",
    actor: "patient",
    note: `UTR on file. Screenshot: ${screenshot ? "yes" : "no"}. State: pending manual verification.`,
  });

  return updated;
}

export async function getScreenshot(reference: string) {
  const [row] = await db.select().from(vopdPaymentScreenshots).where(eq(vopdPaymentScreenshots.reference, reference)).limit(1);
  return row;
}

/** Step 1 of verification: mark money received. Atomic guard prevents duplicates. */
export async function verifyPayment(reference: string, admin: string) {
  const now = new Date();
  const [updated] = await db
    .update(vopdBookings)
    .set({ paymentStatus: "VERIFIED", status: "PAYMENT_VERIFIED", verifiedAt: now, verifiedBy: admin, updatedAt: now })
    .where(
      and(
        eq(vopdBookings.reference, reference),
        eq(vopdBookings.status, "PAYMENT_VERIFICATION_PENDING"),
        inArray(vopdBookings.paymentStatus, ["SUBMITTED", "NOT_REQUIRED"])
      )
    )
    .returning();
  if (!updated) throw new VopdConflictError("This payment was already verified, rejected, or the booking is not pending verification.", "NOT_VERIFIABLE");
  await db.insert(vopdAuditLog).values({
    reference,
    action: "PAYMENT_VERIFIED",
    fromStatus: "PAYMENT_VERIFICATION_PENDING",
    toStatus: "PAYMENT_VERIFIED",
    actor: admin,
    note: "Administrator confirmed receipt of payment (or confirmed a no-fee enquiry).",
  });
  return updated;
}

export async function recordCalendarResult(reference: string, admin: string, result: { eventId: string; meetUrl: string | null; htmlLink?: string | null }) {
  const now = new Date();
  const [updated] = await db
    .update(vopdBookings)
    .set({
      status: "CONFIRMED",
      calendarStatus: "CREATED",
      calendarEventId: result.eventId,
      meetUrl: result.meetUrl,
      calendarError: null,
      updatedAt: now,
    })
    .where(and(eq(vopdBookings.reference, reference), eq(vopdBookings.status, "PAYMENT_VERIFIED")))
    .returning();
  if (!updated) return undefined;
  await db.insert(vopdAuditLog).values({
    reference,
    action: "CALENDAR_EVENT_CREATED",
    fromStatus: "PAYMENT_VERIFIED",
    toStatus: "CONFIRMED",
    actor: admin,
    note: result.meetUrl ? "Google Calendar event and Meet link created." : "Calendar event created; Meet link pending.",
  });
  return updated;
}

export async function recordCalendarFailure(reference: string, admin: string, message: string) {
  const [updated] = await db
    .update(vopdBookings)
    .set({ calendarStatus: "FAILED", calendarError: message.slice(0, 1000), updatedAt: new Date() })
    .where(and(eq(vopdBookings.reference, reference), eq(vopdBookings.status, "PAYMENT_VERIFIED")))
    .returning();
  if (updated) {
    await db.insert(vopdAuditLog).values({
      reference,
      action: "CALENDAR_EVENT_FAILED",
      fromStatus: "PAYMENT_VERIFIED",
      toStatus: "PAYMENT_VERIFIED",
      actor: admin,
      note: `Calendar creation failed; payment remains verified. ${message}`.slice(0, 900),
    });
  }
  return updated;
}

export async function setManualMeetUrl(reference: string, meetUrl: string, admin: string) {
  const [updated] = await db
    .update(vopdBookings)
    .set({ meetUrl, calendarStatus: "MANUAL_LINK", updatedAt: new Date() })
    .where(and(eq(vopdBookings.reference, reference), eq(vopdBookings.status, "CONFIRMED")))
    .returning();
  if (!updated) throw new VopdConflictError("Add a Meet link only after the appointment is confirmed.", "NOT_CONFIRMED");
  await db.insert(vopdAuditLog).values({
    reference,
    action: "MEET_LINK_SET_MANUALLY",
    fromStatus: "CONFIRMED",
    toStatus: "CONFIRMED",
    actor: admin,
    note: "Administrator attached a manually generated Meet link.",
  });
  return updated;
}

export async function rejectPayment(reference: string, admin: string, reason: string) {
  const now = new Date();
  const [updated] = await db
    .update(vopdBookings)
    .set({ paymentStatus: "REJECTED", status: "REJECTED", rejectionReason: reason.slice(0, 1000), holdExpiresAt: null, updatedAt: now })
    .where(and(eq(vopdBookings.reference, reference), eq(vopdBookings.status, "PAYMENT_VERIFICATION_PENDING")))
    .returning();
  if (!updated) throw new VopdConflictError("Only bookings awaiting verification can be rejected.", "NOT_REJECTABLE");
  await db.insert(vopdAuditLog).values({
    reference, action: "PAYMENT_REJECTED", fromStatus: "PAYMENT_VERIFICATION_PENDING", toStatus: "REJECTED", actor: admin, note: reason.slice(0, 900),
  });
  return updated;
}

export async function cancelBooking(reference: string, admin: string, reason: string) {
  const now = new Date();
  const cancellable: BookingStatus[] = ["SLOT_RESERVED", "PAYMENT_PENDING", "PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED"];
  const [existing] = await db.select().from(vopdBookings).where(eq(vopdBookings.reference, reference)).limit(1);
  if (!existing) throw new VopdConflictError("Booking not found.", "NOT_FOUND");
  if (!cancellable.includes(existing.status as BookingStatus) || !canTransition(existing.status as BookingStatus, "CANCELLED")) {
    throw new VopdConflictError("This booking can no longer be cancelled.", "NOT_CANCELLABLE");
  }
  const [updated] = await db
    .update(vopdBookings)
    .set({ status: "CANCELLED", cancellationReason: reason.slice(0, 1000), holdExpiresAt: null, updatedAt: now })
    .where(and(eq(vopdBookings.reference, reference), inArray(vopdBookings.status, cancellable)))
    .returning();
  await db.insert(vopdAuditLog).values({
    reference, action: "BOOKING_CANCELLED", fromStatus: existing.status, toStatus: "CANCELLED", actor: admin, note: reason.slice(0, 900),
  });
  return updated;
}

export async function completeBooking(reference: string, admin: string) {
  const [updated] = await db
    .update(vopdBookings)
    .set({ status: "COMPLETED", updatedAt: new Date() })
    .where(and(eq(vopdBookings.reference, reference), eq(vopdBookings.status, "CONFIRMED")))
    .returning();
  if (!updated) throw new VopdConflictError("Only confirmed appointments can be completed.", "NOT_COMPLETABLE");
  await db.insert(vopdAuditLog).values({
    reference, action: "APPOINTMENT_COMPLETED", fromStatus: "CONFIRMED", toStatus: "COMPLETED", actor: admin, note: null,
  });
  return updated;
}

export async function rescheduleBooking(reference: string, newStartIso: string, admin: string) {
  const start = new Date(newStartIso);
  if (Number.isNaN(start.getTime()) || !isFutureSlot(start)) throw new VopdConflictError("Choose a future slot.", "INVALID_SLOT");
  const existing = await getBooking(reference);
  if (!existing) throw new VopdConflictError("Booking not found.", "NOT_FOUND");
  const reschedulable: BookingStatus[] = ["SLOT_RESERVED", "PAYMENT_PENDING", "PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED"];
  if (!reschedulable.includes(existing.status as BookingStatus)) throw new VopdConflictError("This booking cannot be rescheduled.", "NOT_RESCHEDULABLE");

  const date = clinicDateString(start);
  const bounds = await dayBounds(date);
  const allowed = candidateSlots(date, existing.durationMinutes).some((slot) => slot.startIso === start.toISOString());
  if (!allowed) throw new VopdConflictError("That time is not a valid slot for this plan.", "INVALID_SLOT");

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`vopd:${date}`}))`);
    const sameDay = await tx
      .select({ reference: vopdBookings.reference, slotStart: vopdBookings.slotStart, durationMinutes: vopdBookings.durationMinutes })
      .from(vopdBookings)
      .where(and(inArray(vopdBookings.status, BLOCKING), gte(vopdBookings.slotStart, bounds.start), lt(vopdBookings.slotStart, bounds.end)));
    const conflict = sameDay.some((row) =>
      row.reference !== reference && slotsOverlap({ start, durationMinutes: existing.durationMinutes }, { start: row.slotStart, durationMinutes: row.durationMinutes })
    );
    if (conflict) throw new VopdConflictError("That slot overlaps another appointment.", "SLOT_TAKEN");

    const [updated] = await tx
      .update(vopdBookings)
      .set({
        slotStart: start,
        slotEnd: getStoredEnd(start, existing.durationMinutes),
        calendarStatus: existing.status === "CONFIRMED" ? "RESYNC_REQUIRED" : existing.calendarStatus,
        updatedAt: new Date(),
      })
      .where(eq(vopdBookings.reference, reference))
      .returning();
    await tx.insert(vopdAuditLog).values({
      reference,
      action: "APPOINTMENT_RESCHEDULED",
      fromStatus: existing.status,
      toStatus: updated.status,
      actor: admin,
      note: `Moved to ${start.toISOString()} (Asia/Kolkata display).${
        existing.calendarEventId ? " Existing Calendar event must be updated or retried." : ""
      }`,
    });
    return updated;
  });
}

export async function listBookings(filters: { status?: string; query?: string } = {}) {
  const conditions = [];
  if (filters.status && filters.status !== "all") conditions.push(eq(vopdBookings.status, filters.status));
  if (filters.query) {
    const like = `%${filters.query.replace(/[%_]/g, "")}%`;
    conditions.push(
      or(
        sql`${vopdBookings.reference} ilike ${like}`,
        sql`${vopdBookings.patientName} ilike ${like}`,
        sql`${vopdBookings.phone} ilike ${like}`,
        sql`${vopdBookings.upiReference} ilike ${like}`
      )
    );
  }
  const rows = await db
    .select({
      reference: vopdBookings.reference,
      patientKind: vopdBookings.patientKind,
      patientName: vopdBookings.patientName,
      guardianName: vopdBookings.guardianName,
      phone: vopdBookings.phone,
      email: vopdBookings.email,
      concernCategory: vopdBookings.concernCategory,
      planId: vopdBookings.planId,
      planName: vopdBookings.planName,
      amountMinor: vopdBookings.amountMinor,
      currency: vopdBookings.currency,
      durationMinutes: vopdBookings.durationMinutes,
      followUpCount: vopdBookings.followUpCount,
      slotStart: vopdBookings.slotStart,
      status: vopdBookings.status,
      paymentStatus: vopdBookings.paymentStatus,
      upiReference: vopdBookings.upiReference,
      payerName: vopdBookings.payerName,
      holdExpiresAt: vopdBookings.holdExpiresAt,
      meetUrl: vopdBookings.meetUrl,
      calendarStatus: vopdBookings.calendarStatus,
      calendarError: vopdBookings.calendarError,
      createdAt: vopdBookings.createdAt,
      verifiedAt: vopdBookings.verifiedAt,
      verifiedBy: vopdBookings.verifiedBy,
      hasScreenshot: sql<boolean>`exists (select 1 from vopd_payment_screenshots s where s.reference = ${vopdBookings.reference})`,
    })
    .from(vopdBookings)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(vopdBookings.createdAt))
    .limit(100);
  return rows;
}

export async function getAuditTrail(reference: string) {
  return db
    .select()
    .from(vopdAuditLog)
    .where(eq(vopdAuditLog.reference, reference))
    .orderBy(asc(vopdAuditLog.createdAt))
    .limit(100);
}

export async function blockDate(date: string, admin: string, reason?: string) {
  if (!isDateString(date)) throw new VopdConflictError("Invalid date.", "INVALID_DATE");
  const [row] = await db.insert(vopdBlockedSlots).values({ blockedDate: date, createdBy: admin, reason: reason?.slice(0, 200) ?? null }).returning();
  await db.insert(vopdAuditLog).values({ reference: `DATE-${date}`, action: "DATE_BLOCKED", actor: admin, note: reason?.slice(0, 900) ?? null });
  return row;
}

export async function listBlockedDates() {
  return db.select().from(vopdBlockedSlots).orderBy(asc(vopdBlockedSlots.blockedDate)).limit(100);
}

export async function unblockDate(id: number, admin: string) {
  const [row] = await db.delete(vopdBlockedSlots).where(eq(vopdBlockedSlots.id, id)).returning();
  if (row) await db.insert(vopdAuditLog).values({ reference: `DATE-${row.blockedDate}`, action: "DATE_UNBLOCKED", actor: admin, note: null });
  return row;
}

export function markPaymentStatus(reference: string, status: PaymentStatus) {
  return db.update(vopdBookings).set({ paymentStatus: status }).where(eq(vopdBookings.reference, reference));
}
