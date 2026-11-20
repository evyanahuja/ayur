/* VOPD persistence, dynamic plan management, and booking state machine.
   All money, durations and slot validity are recomputed on the server;
   PostgreSQL rows are the single source of truth. */
import { randomBytes } from "node:crypto";
import { and, asc, desc, eq, gt, gte, inArray, lt, or, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import {
  vopdAuditLog,
  vopdBlockedSlots,
  vopdBookings,
  vopdConsultationPlans,
  vopdPaymentScreenshots,
  type VopdBooking,
} from "@/db/schema";
import {
  BUILTIN_PLAN_IDS,
  canTransition,
  formatClinicDateTime,
  type BookingStatus,
  type PaymentStatus,
  type VopdPlan,
} from "@/content/vopd";
import { ADVANCE_DAYS, BUFFER_MINUTES, HOLD_MINUTES, SLOT_INTERVAL_MINUTES, getResolvedVopdPlan, getVopdPlan, rowToVopdPlan } from "./config";
import {
  addDaysToDateString,
  candidateSlots,
  clinicDateString,
  clinicWallTimeToUtc,
  clinicWeekday,
  getStoredEnd,
  isDateString,
  isFutureSlot,
  slotsOverlap,
  todayInClinic,
  type SlotSession,
} from "./slots";
import type { BookingInput, CustomPlanInput } from "./validation";
import { getScheduleForDate } from "./schedule";

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

let schemaReadyPromise: Promise<void> | null = null;

/** Idempotently ensures all VOPD & inquiry tables exist even on a fresh database
 *  before the first migration runs — prevents slot availability 500s on deploy. */
export async function ensureVopdSchema(): Promise<void> {
  if (!isDatabaseConfigured()) return;
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS patient_inquiries (
          id serial PRIMARY KEY,
          parent_name varchar(120) NOT NULL,
          phone varchar(20) NOT NULL,
          email varchar(160),
          child_name varchar(120) NOT NULL,
          child_age varchar(40) NOT NULL,
          child_gender varchar(20),
          concern_category varchar(40) NOT NULL DEFAULT 'general',
          symptoms text,
          preferred_mode varchar(20) NOT NULL DEFAULT 'online',
          preferred_date varchar(40),
          preferred_time varchar(40),
          plan_interest varchar(60),
          message text,
          status varchar(20) NOT NULL DEFAULT 'new',
          created_at timestamp NOT NULL DEFAULT now()
        )
      `);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS vopd_bookings (
          id serial PRIMARY KEY,
          reference varchar(24) NOT NULL UNIQUE,
          mode varchar(8) NOT NULL DEFAULT 'vopd',
          patient_kind varchar(8) NOT NULL,
          patient_name varchar(120) NOT NULL,
          guardian_name varchar(120),
          age_or_dob varchar(40) NOT NULL,
          gender varchar(20),
          phone varchar(20) NOT NULL,
          email varchar(160),
          city varchar(80),
          state varchar(80),
          concern_category varchar(40) NOT NULL,
          symptoms text NOT NULL,
          duration varchar(120),
          previous_diagnosis text,
          current_treatment text,
          message text,
          plan_id varchar(40) NOT NULL,
          plan_name varchar(120) NOT NULL,
          amount_minor integer,
          currency varchar(3) NOT NULL DEFAULT 'INR',
          duration_minutes integer NOT NULL,
          follow_up_count integer NOT NULL DEFAULT 0,
          follow_up_minutes integer NOT NULL DEFAULT 0,
          slot_start timestamptz NOT NULL,
          slot_end timestamptz NOT NULL,
          status varchar(40) NOT NULL DEFAULT 'SLOT_RESERVED',
          payment_status varchar(24) NOT NULL DEFAULT 'PENDING',
          hold_expires_at timestamptz,
          payer_name varchar(120),
          upi_reference varchar(80),
          payment_submitted_at timestamptz,
          verified_at timestamptz,
          verified_by varchar(120),
          rejection_reason text,
          meet_url text,
          calendar_event_id varchar(200),
          calendar_status varchar(24) NOT NULL DEFAULT 'NOT_ATTEMPTED',
          calendar_error text,
          confirmation_email_sent_at timestamptz,
          cancellation_reason text,
          locale varchar(5) NOT NULL DEFAULT 'en',
          consent_at timestamptz NOT NULL DEFAULT now(),
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS vopd_bookings_slot_idx ON vopd_bookings (slot_start)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS vopd_bookings_status_idx ON vopd_bookings (status)`);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS vopd_audit_log (
          id serial PRIMARY KEY,
          reference varchar(24) NOT NULL,
          action varchar(60) NOT NULL,
          from_status varchar(40),
          to_status varchar(40),
          actor varchar(120) NOT NULL,
          note text,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS vopd_audit_reference_idx ON vopd_audit_log (reference)`);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS vopd_blocked_slots (
          id serial PRIMARY KEY,
          blocked_date date NOT NULL,
          slot_start timestamptz,
          reason varchar(200),
          created_by varchar(120) NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS vopd_blocked_date_idx ON vopd_blocked_slots (blocked_date)`);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS vopd_payment_screenshots (
          reference varchar(24) PRIMARY KEY,
          mime_type varchar(80) NOT NULL,
          size_bytes integer NOT NULL,
          data bytea NOT NULL,
          uploaded_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS vopd_consultation_plans (
          id serial PRIMARY KEY,
          slug varchar(40) NOT NULL UNIQUE,
          name varchar(120) NOT NULL,
          subtitle varchar(120),
          period varchar(80),
          description text NOT NULL,
          features_json text NOT NULL DEFAULT '[]',
          amount_minor_inr integer,
          strike_minor_inr integer,
          amount_minor_usd integer,
          strike_minor_usd integer,
          duration_minutes integer NOT NULL DEFAULT 30,
          follow_up_count integer NOT NULL DEFAULT 0,
          follow_up_minutes integer NOT NULL DEFAULT 0,
          requires_payment boolean NOT NULL DEFAULT true,
          show_on_pricing boolean NOT NULL DEFAULT true,
          featured boolean NOT NULL DEFAULT false,
          active boolean NOT NULL DEFAULT true,
          sort_order integer NOT NULL DEFAULT 50,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS vopd_consultation_plans_active_idx ON vopd_consultation_plans (active, sort_order)`);
      await db.execute(sql`ALTER TABLE patient_inquiries ADD COLUMN IF NOT EXISTS patient_kind varchar(8) NOT NULL DEFAULT 'child'`);
      await db.execute(sql`ALTER TABLE patient_inquiries ADD COLUMN IF NOT EXISTS patient_gender varchar(20)`);
      await db.execute(sql`ALTER TABLE vopd_bookings ADD COLUMN IF NOT EXISTS payment_method varchar(32) NOT NULL DEFAULT 'UPI'`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS vopd_weekly_availability (
        weekday integer PRIMARY KEY, closed boolean NOT NULL DEFAULT false,
        sessions_json text NOT NULL DEFAULT '[]', breaks_json text NOT NULL DEFAULT '[]',
        interval_minutes integer NOT NULL DEFAULT 30, updated_by varchar(120) NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS vopd_date_availability (
        date date PRIMARY KEY, closed boolean NOT NULL DEFAULT false,
        sessions_json text NOT NULL DEFAULT '[]', breaks_json text NOT NULL DEFAULT '[]',
        interval_minutes integer NOT NULL DEFAULT 30, reason varchar(200),
        updated_by varchar(120) NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
      )`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS doctor_profile_translations (
        language varchar(5) PRIMARY KEY, introduction text NOT NULL,
        care_paragraphs_json text NOT NULL, updated_by varchar(120) NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`);
    })().catch((err) => {
      schemaReadyPromise = null;
      throw err;
    });
  }
  return schemaReadyPromise;
}

function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return `VOPD-${out}`;
}

export async function expireStaleHolds(): Promise<number> {
  await ensureVopdSchema();
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

function dayBounds(date: string): { start: Date; end: Date } {
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

export type AvailabilitySlotItem = { startIso: string; label: string; session: SlotSession };

export type Availability = {
  date: string;
  timeZone: "Asia/Kolkata";
  planId: string;
  durationMinutes: number;
  intervalMinutes: number;
  bufferMinutes: number;
  hoursLabel: string;
  slots: AvailabilitySlotItem[];
  nextAvailableDate?: string | null;
  code?: string;
  message?: string;
};

async function findNextOpenDateAfter(fromDate: string, durationMinutes: number, now: Date): Promise<string | null> {
  const today = todayInClinic(now);
  const maxDate = addDaysToDateString(today, ADVANCE_DAYS);
  let blockedAllDay = new Set<string>();
  if (isDatabaseConfigured()) {
    try {
      const rows = await db
        .select({ blockedDate: vopdBlockedSlots.blockedDate, slotStart: vopdBlockedSlots.slotStart })
        .from(vopdBlockedSlots)
        .where(gte(vopdBlockedSlots.blockedDate, today));
      blockedAllDay = new Set(rows.filter((r) => !r.slotStart).map((r) => r.blockedDate));
    } catch {
      blockedAllDay = new Set();
    }
  }
  for (let i = 1; i <= ADVANCE_DAYS; i++) {
    const candidate = addDaysToDateString(fromDate, i);
    if (candidate < today) continue;
    if (candidate > maxDate) break;
    if (blockedAllDay.has(candidate)) continue;
    const schedule = await getScheduleForDate(candidate);
    const hasOpen = candidateSlots(candidate, durationMinutes, { ...schedule, interval: schedule.intervalMinutes })
      .some((slot) => isFutureSlot(new Date(slot.startIso), now));
    if (hasOpen) return candidate;
  }
  return null;
}

/** Returns upcoming open clinic dates (ignoring blocked full-day dates and Sundays). */
export async function getOpenClinicDates(durationMinutes = 30, count = 6): Promise<string[]> {
  const now = new Date();
  const today = todayInClinic(now);
  let blockedAllDay = new Set<string>();
  if (isDatabaseConfigured()) {
    try {
      await ensureVopdSchema();
      const rows = await db
        .select({ blockedDate: vopdBlockedSlots.blockedDate, slotStart: vopdBlockedSlots.slotStart })
        .from(vopdBlockedSlots)
        .where(gte(vopdBlockedSlots.blockedDate, today));
      blockedAllDay = new Set(rows.filter((r) => !r.slotStart).map((r) => r.blockedDate));
    } catch {
      blockedAllDay = new Set();
    }
  }
  const dates: string[] = [];
  for (let offset = 0; offset <= ADVANCE_DAYS && dates.length < count; offset++) {
    const candidate = addDaysToDateString(today, offset);
    if (blockedAllDay.has(candidate)) continue;
    const schedule = await getScheduleForDate(candidate);
    const hasOpen = candidateSlots(candidate, durationMinutes, { ...schedule, interval: schedule.intervalMinutes })
      .some((slot) => isFutureSlot(new Date(slot.startIso), now));
    if (hasOpen) dates.push(candidate);
  }
  return dates;
}

export async function getAvailability(date: string, planId: string): Promise<Availability> {
  if (isDatabaseConfigured()) {
    try {
      await ensureVopdSchema();
    } catch (err) {
      console.error("ensureVopdSchema warning:", err);
    }
  }
  const resolvedPlan = await getResolvedVopdPlan(planId);
  const durationMinutes = resolvedPlan?.bookingMinutes ?? 30;
  const base = {
    date,
    timeZone: "Asia/Kolkata" as const,
    planId: resolvedPlan?.id ?? planId,
    durationMinutes,
    intervalMinutes: SLOT_INTERVAL_MINUTES,
    bufferMinutes: BUFFER_MINUTES,
    hoursLabel: "",
    slots: [] as AvailabilitySlotItem[],
  };
  if (!isDateString(date)) return { ...base, code: "INVALID_DATE", message: "Please select a valid consultation date." };
  if (!resolvedPlan) return { ...base, code: "INVALID_PLAN", message: "Choose an active consultation plan." };
  const now = new Date();
  const today = todayInClinic(now);
  if (date < today) {
    const nextAvailableDate = await findNextOpenDateAfter(addDaysToDateString(today, -1), durationMinutes, now);
    return { ...base, code: "PAST_DATE", nextAvailableDate, message: "Past dates cannot be booked. Please choose an upcoming date." };
  }
  if (date > addDaysToDateString(today, ADVANCE_DAYS)) {
    return { ...base, code: "OUT_OF_RANGE", message: `Bookings are open for the next ${ADVANCE_DAYS} days.` };
  }
  const schedule = await getScheduleForDate(date);
  base.intervalMinutes = schedule.intervalMinutes;
  base.hoursLabel = schedule.sessions.map((session) => `${session.start}–${session.end}`).join(" · ") + " IST";
  if (schedule.closed) {
    const nextAvailableDate = await findNextOpenDateAfter(date, durationMinutes, now);
    return { ...base, code: clinicWeekday(date) === 0 ? "SUNDAY_CLOSED" : "DAY_BLOCKED", nextAvailableDate,
      message: "The clinic is closed on this date. Please choose another day." };
  }

  let busy: { reference: string; start: Date; durationMinutes: number }[] = [];
  let blocked: { id: number; slotStart: Date | null; reason: string | null }[] = [];
  if (isDatabaseConfigured()) {
    try {
      await expireStaleHolds();
      const { start, end } = dayBounds(date);
      [busy, blocked] = await Promise.all([blockingRowsBetween(start, end), blockedRows(date)]);
    } catch (err) {
      console.error("VOPD availability DB lookup failed:", err);
      throw err; // Never display bookable times if conflict checks could not run.
    }
  }

  const allDayBlocked = blocked.some((row) => !row.slotStart);
  if (allDayBlocked) {
    const nextAvailableDate = await findNextOpenDateAfter(date, durationMinutes, now);
    return { ...base, code: "DAY_BLOCKED", nextAvailableDate, message: "The clinic is unavailable on this date. Please select another day." };
  }

  const blockedInstants = new Set(
    blocked.filter((row) => row.slotStart).map((row) => row.slotStart?.getTime())
  );

  const slots = candidateSlots(date, durationMinutes, { ...schedule, interval: schedule.intervalMinutes })
    .filter((slot) => {
      const slotStart = new Date(slot.startIso);
      if (!isFutureSlot(slotStart, now)) return false;
      if (blockedInstants.has(slotStart.getTime())) return false;
      return !busy.some((appt) => slotsOverlap({ start: slotStart, durationMinutes }, appt));
    })
    .map((slot) => ({ startIso: slot.startIso, label: slot.label, session: slot.session }));

  if (!slots.length) {
    const nextAvailableDate = await findNextOpenDateAfter(date, durationMinutes, now);
    const code = date === today ? "TODAY_ENDED" : "NO_SLOTS";
    const message = date === today
      ? "Today's video consultation hours have ended. Please pick the next available day."
      : "All slots are booked on this date. Please choose another day.";
    return { ...base, slots: [], code, nextAvailableDate, message };
  }

  return { ...base, slots };
}

export type BookingRecord = VopdBooking;

export async function createBooking(
  input: BookingInput & { start: Date; durationMinutes: number; plan: VopdPlan }
): Promise<BookingRecord> {
  await ensureVopdSchema();
  const date = clinicDateString(input.start);
  const bounds = dayBounds(date);
  const reference = makeReference();
  if (!isFutureSlot(input.start)) throw new VopdConflictError("That time has passed.", "PAST_SLOT");
  if (date > addDaysToDateString(todayInClinic(), ADVANCE_DAYS)) throw new VopdConflictError("Date is outside the booking window.", "INVALID_SLOT");

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('vopd:schedule'))`);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('vopd:plans'))`);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`vopd:${date}`}))`);
    const freshPlan = await getResolvedVopdPlan(input.planId);
    if (!freshPlan) throw new VopdConflictError("This plan is no longer active.", "INVALID_PLAN");
    const durationMinutes = freshPlan.bookingMinutes;
    const amountMinor = freshPlan.requiresPayment
      ? (input.currency === "USD" ? freshPlan.amountMinorUsd : freshPlan.amountMinor) ?? null : null;
    if (freshPlan.requiresPayment && (amountMinor == null || amountMinor <= 0)) {
      throw new VopdConflictError(`This plan has no ${input.currency} price set.`, "CURRENCY_UNAVAILABLE");
    }
    const schedule = await getScheduleForDate(date);
    if (schedule.closed || !candidateSlots(date, durationMinutes, { ...schedule, interval: schedule.intervalMinutes })
      .some((slot) => slot.startIso === input.start.toISOString())) {
      throw new VopdConflictError("That time is no longer a valid consultation slot.", "INVALID_SLOT");
    }
    if (!isFutureSlot(input.start)) throw new VopdConflictError("That time has passed.", "PAST_SLOT");
    await tx
      .update(vopdBookings)
      .set({ status: "EXPIRED", updatedAt: new Date() })
      .where(and(inArray(vopdBookings.status, ACTIVE_UNPAID), lt(vopdBookings.holdExpiresAt, new Date())));

    const sameDay = await tx
      .select({ reference: vopdBookings.reference, slotStart: vopdBookings.slotStart, durationMinutes: vopdBookings.durationMinutes })
      .from(vopdBookings)
      .where(and(inArray(vopdBookings.status, BLOCKING), gte(vopdBookings.slotStart, bounds.start), lt(vopdBookings.slotStart, bounds.end)));

    const conflict = sameDay.some((row) =>
      slotsOverlap({ start: input.start, durationMinutes: durationMinutes }, { start: row.slotStart, durationMinutes: row.durationMinutes })
    );
    if (conflict) throw new VopdConflictError("That slot was just taken. Please choose another time.", "SLOT_TAKEN");

    const blocked = await tx
      .select({ slotStart: vopdBlockedSlots.slotStart })
      .from(vopdBlockedSlots)
      .where(eq(vopdBlockedSlots.blockedDate, date));
    if (blocked.some((row) => !row.slotStart || row.slotStart?.getTime() === input.start.getTime())) {
      throw new VopdConflictError("The clinic is unavailable at that time.", "SLOT_BLOCKED");
    }

    const holdExpiresAt = freshPlan.requiresPayment ? new Date(Date.now() + HOLD_MINUTES * 60_000) : null;
    const initialStatus: BookingStatus = freshPlan.requiresPayment ? "PAYMENT_PENDING" : "PAYMENT_VERIFICATION_PENDING";
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
        planId: freshPlan.id,
        planName: freshPlan.name,
        amountMinor: amountMinor,
        currency: input.currency,
        paymentMethod: freshPlan.requiresPayment ? (input.currency === "USD" ? "MANUAL_USD" : "UPI") : "NOT_REQUIRED",
        durationMinutes: durationMinutes,
        followUpCount: freshPlan.followUpCount,
        followUpMinutes: freshPlan.followUpMinutes,
        slotStart: input.start,
        slotEnd: getStoredEnd(input.start, durationMinutes),
        status: initialStatus,
        paymentStatus: freshPlan.requiresPayment ? "PENDING" : "NOT_REQUIRED",
        holdExpiresAt,
        locale: input.locale,
      })
      .returning();

    await tx.insert(vopdAuditLog).values({
      reference,
      action: "BOOKING_CREATED",
      fromStatus: null,
      toStatus: initialStatus,
      actor: "patient",
      note: `VOPD reservation for ${freshPlan.name} (${durationMinutes} mins), ${input.currency} ${amountMinor == null ? "fee on confirmation" : (amountMinor / 100).toFixed(2)}.`,
    });

    return row;
  });
}

export async function getBooking(reference: string): Promise<BookingRecord | undefined> {
  await ensureVopdSchema();
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
    paymentMethod: row.paymentMethod,
    durationMinutes: row.durationMinutes,
    slotStart: row.slotStart.toISOString(),
    status: row.status,
    paymentStatus: row.paymentStatus,
    locale: row.locale,
    holdExpiresAt: row.holdExpiresAt?.toISOString() ?? null,
    meetUrl: row.status === "CONFIRMED" ? row.meetUrl : null,
    createdAt: row.createdAt.toISOString(),
  };
}

export type ScreenshotInput = { mimeType: string; sizeBytes: number; data: Buffer };

export async function submitPayment(reference: string, payment: { payerName: string; upiReference: string }, screenshot?: ScreenshotInput) {
  await ensureVopdSchema();
  return db.transaction(async (tx) => {
    const now = new Date();
    const [updated] = await tx.update(vopdBookings).set({
      payerName: payment.payerName, upiReference: payment.upiReference,
      paymentStatus: "SUBMITTED", paymentSubmittedAt: now,
      status: "PAYMENT_VERIFICATION_PENDING", holdExpiresAt: null, updatedAt: now,
    }).where(and(
      eq(vopdBookings.reference, reference),
      inArray(vopdBookings.status, ACTIVE_UNPAID),
      eq(vopdBookings.paymentStatus, "PENDING"),
      gt(vopdBookings.holdExpiresAt, now),
    )).returning();

    if (!updated) {
      const [existing] = await tx.select().from(vopdBookings).where(eq(vopdBookings.reference, reference)).limit(1);
      if (!existing) throw new VopdConflictError("Booking not found.", "NOT_FOUND");
      if (["SUBMITTED", "VERIFIED"].includes(existing.paymentStatus)) {
        throw new VopdConflictError("Payment details have already been submitted for this booking.", "PAYMENT_ALREADY_SUBMITTED");
      }
      throw new VopdConflictError("This reservation has expired or been cancelled. Please call the clinic if you already paid.", "RESERVATION_CLOSED");
    }
    if (screenshot) {
      await tx.insert(vopdPaymentScreenshots)
        .values({ reference, mimeType: screenshot.mimeType, sizeBytes: screenshot.sizeBytes, data: screenshot.data })
        .onConflictDoUpdate({ target: vopdPaymentScreenshots.reference,
          set: { mimeType: screenshot.mimeType, sizeBytes: screenshot.sizeBytes, data: screenshot.data, uploadedAt: now } });
    }
    await tx.insert(vopdAuditLog).values({
      reference, action: "PAYMENT_SUBMITTED", fromStatus: "PAYMENT_PENDING",
      toStatus: "PAYMENT_VERIFICATION_PENDING", actor: "patient",
      note: `${updated.paymentMethod} reference recorded; ${updated.currency} ${updated.amountMinor == null ? "no fee" : (updated.amountMinor / 100).toFixed(2)}. Screenshot: ${screenshot ? "yes" : "no"}. Pending manual bank verification.`,
    });
    return updated;
  });
}

export async function getScreenshot(reference: string) {
  await ensureVopdSchema();
  const [row] = await db.select().from(vopdPaymentScreenshots).where(eq(vopdPaymentScreenshots.reference, reference)).limit(1);
  return row;
}

export async function verifyPayment(reference: string, admin: string) {
  await ensureVopdSchema();
  return db.transaction(async (tx) => {
    const now = new Date();
    const [updated] = await tx.update(vopdBookings)
      .set({ paymentStatus: "VERIFIED", status: "PAYMENT_VERIFIED", verifiedAt: now, verifiedBy: admin, updatedAt: now })
      .where(and(eq(vopdBookings.reference, reference), eq(vopdBookings.status, "PAYMENT_VERIFICATION_PENDING"),
        inArray(vopdBookings.paymentStatus, ["SUBMITTED", "NOT_REQUIRED"]))).returning();
    if (!updated) throw new VopdConflictError("This payment was already verified, rejected, or is not pending verification.", "NOT_VERIFIABLE");
    await tx.insert(vopdAuditLog).values({ reference, action: "PAYMENT_VERIFIED",
      fromStatus: "PAYMENT_VERIFICATION_PENDING", toStatus: "PAYMENT_VERIFIED", actor: admin,
      note: `Administrator independently confirmed ${updated.currency} ${updated.amountMinor == null ? "no fee" : (updated.amountMinor / 100).toFixed(2)} (${updated.paymentMethod}).` });
    return updated;
  });
}

export async function recordCalendarResult(reference: string, admin: string, result: { eventId: string; meetUrl: string | null; htmlLink?: string | null }) {
  await ensureVopdSchema();
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
  await ensureVopdSchema();
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
  await ensureVopdSchema();
  const existing = await getBooking(reference);
  // Manual fallback: when Google Calendar/Meet is unavailable the booking stays
  // PAYMENT_VERIFIED after verification. Attaching a verified Meet link then
  // confirms it (CONFIRMED is only reachable after PAYMENT_VERIFIED).
  const [updated] = await db
    .update(vopdBookings)
    .set({ meetUrl, calendarStatus: "MANUAL_LINK", status: "CONFIRMED", updatedAt: new Date() })
    .where(and(eq(vopdBookings.reference, reference), inArray(vopdBookings.status, ["PAYMENT_VERIFIED", "CONFIRMED"])))
    .returning();
  if (!updated) throw new VopdConflictError("Add a Meet link only after the payment has been verified.", "NOT_VERIFIED");
  await db.insert(vopdAuditLog).values({
    reference,
    action: "MEET_LINK_SET_MANUALLY",
    fromStatus: existing?.status ?? "PAYMENT_VERIFIED",
    toStatus: "CONFIRMED",
    actor: admin,
    note: "Administrator attached a manually generated Meet link and confirmed the appointment.",
  });
  return updated;
}

export async function rejectPayment(reference: string, admin: string, reason: string) {
  await ensureVopdSchema();
  return db.transaction(async (tx) => {
    const now = new Date();
    const [updated] = await tx.update(vopdBookings)
      .set({ paymentStatus: "REJECTED", status: "REJECTED", rejectionReason: reason.slice(0, 1000), holdExpiresAt: null, updatedAt: now })
      .where(and(eq(vopdBookings.reference, reference), eq(vopdBookings.status, "PAYMENT_VERIFICATION_PENDING")))
      .returning();
    if (!updated) throw new VopdConflictError("Only bookings awaiting verification can be rejected.", "NOT_REJECTABLE");
    await tx.insert(vopdAuditLog).values({ reference, action: "PAYMENT_REJECTED",
      fromStatus: "PAYMENT_VERIFICATION_PENDING", toStatus: "REJECTED", actor: admin, note: reason.slice(0, 900) });
    return updated;
  });
}

export async function cancelBooking(reference: string, admin: string, reason: string) {
  await ensureVopdSchema();
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
  await ensureVopdSchema();
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
  await ensureVopdSchema();
  const start = new Date(newStartIso);
  if (Number.isNaN(start.getTime()) || !isFutureSlot(start)) throw new VopdConflictError("Choose a future slot.", "INVALID_SLOT");
  const existing = await getBooking(reference);
  if (!existing) throw new VopdConflictError("Booking not found.", "NOT_FOUND");
  const reschedulable: BookingStatus[] = ["SLOT_RESERVED", "PAYMENT_PENDING", "PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED"];
  if (!reschedulable.includes(existing.status as BookingStatus)) throw new VopdConflictError("This booking cannot be rescheduled.", "NOT_RESCHEDULABLE");

  const date = clinicDateString(start);
  const bounds = dayBounds(date);

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('vopd:schedule'))`);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`vopd:${date}`}))`);
    const schedule = await getScheduleForDate(date);
    if (schedule.closed || !candidateSlots(date, existing.durationMinutes, { ...schedule, interval: schedule.intervalMinutes })
      .some((slot) => slot.startIso === start.toISOString())) {
      throw new VopdConflictError("That time is not a valid slot for this plan.", "INVALID_SLOT");
    }
    const blocked = await tx.select({ slotStart: vopdBlockedSlots.slotStart }).from(vopdBlockedSlots)
      .where(eq(vopdBlockedSlots.blockedDate, date));
    if (blocked.some((row) => !row.slotStart || row.slotStart.getTime() === start.getTime())) {
      throw new VopdConflictError("The clinic is unavailable at that time.", "SLOT_BLOCKED");
    }
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
      note: `Moved to ${formatClinicDateTime(start.toISOString())} IST.${
        existing.calendarEventId ? " Existing Calendar event must be updated or retried." : ""
      }`,
    });
    return updated;
  });
}

export async function getOverviewStats() {
  await ensureVopdSchema();
  const result = await db.execute(sql`
    SELECT count(*)::int AS total,
      count(*) FILTER (WHERE status = 'PAYMENT_VERIFICATION_PENDING')::int AS pending,
      count(*) FILTER (WHERE status = 'CONFIRMED')::int AS confirmed,
      count(*) FILTER (WHERE payment_status = 'VERIFIED')::int AS verified_payments,
      count(*) FILTER (WHERE status = 'REJECTED')::int AS rejected,
      count(*) FILTER (WHERE status = 'COMPLETED')::int AS completed
    FROM vopd_bookings
  `);
  return result.rows[0];
}

export async function listBookings(filters: { status?: string; query?: string } = {}) {
  await ensureVopdSchema();
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
      gender: vopdBookings.gender,
      ageOrDob: vopdBookings.ageOrDob,
      phone: vopdBookings.phone,
      email: vopdBookings.email,
      concernCategory: vopdBookings.concernCategory,
      planId: vopdBookings.planId,
      planName: vopdBookings.planName,
      amountMinor: vopdBookings.amountMinor,
      currency: vopdBookings.currency,
      paymentMethod: vopdBookings.paymentMethod,
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
  await ensureVopdSchema();
  return db
    .select()
    .from(vopdAuditLog)
    .where(eq(vopdAuditLog.reference, reference))
    .orderBy(asc(vopdAuditLog.createdAt))
    .limit(100);
}

export async function blockDate(date: string, admin: string, reason?: string) {
  await ensureVopdSchema();
  if (!isDateString(date)) throw new VopdConflictError("Invalid date.", "INVALID_DATE");
  const [row] = await db.insert(vopdBlockedSlots).values({ blockedDate: date, createdBy: admin, reason: reason?.slice(0, 200) ?? null }).returning();
  await db.insert(vopdAuditLog).values({ reference: `DATE-${date}`, action: "DATE_BLOCKED", actor: admin, note: reason?.slice(0, 900) ?? null });
  return row;
}

export async function listBlockedDates() {
  await ensureVopdSchema();
  return db.select().from(vopdBlockedSlots).orderBy(asc(vopdBlockedSlots.blockedDate)).limit(100);
}

export async function unblockDate(id: number, admin: string) {
  await ensureVopdSchema();
  const [row] = await db.delete(vopdBlockedSlots).where(eq(vopdBlockedSlots.id, id)).returning();
  if (row) await db.insert(vopdAuditLog).values({ reference: `DATE-${row.blockedDate}`, action: "DATE_UNBLOCKED", actor: admin, note: null });
  return row;
}

export function markPaymentStatus(reference: string, status: PaymentStatus) {
  return db.update(vopdBookings).set({ paymentStatus: status }).where(eq(vopdBookings.reference, reference));
}

/* ==================== CUSTOM CONSULTATION PLANS ==================== */

function slugifyPlan(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return base || `plan-${randomBytes(3).toString("hex")}`;
}

export async function listCustomPlans(): Promise<VopdPlan[]> {
  await ensureVopdSchema();
  const rows = await db
    .select()
    .from(vopdConsultationPlans)
    .orderBy(asc(vopdConsultationPlans.sortOrder), asc(vopdConsultationPlans.id));
  return rows.map(rowToVopdPlan).filter((plan) => plan.isCustom && plan.id !== "wellness" && plan.name.toLowerCase() !== "bal wellness program");
}

export async function createCustomPlan(input: CustomPlanInput, admin: string): Promise<VopdPlan> {
  await ensureVopdSchema();
  let slug = input.slug || slugifyPlan(input.name);
  if ((BUILTIN_PLAN_IDS as readonly string[]).includes(slug) || slug === "wellness") {
    slug = `${slug}-${randomBytes(2).toString("hex")}`;
  }
  const [existing] = await db.select({ id: vopdConsultationPlans.id }).from(vopdConsultationPlans).where(eq(vopdConsultationPlans.slug, slug)).limit(1);
  if (existing) slug = `${slug.slice(0, 33)}-${randomBytes(2).toString("hex")}`;

  const [created] = await db
    .insert(vopdConsultationPlans)
    .values({
      slug,
      name: input.name,
      subtitle: input.subtitle ?? null,
      period: input.period ?? `${input.durationMinutes} mins consultation`,
      description: input.description,
      featuresJson: JSON.stringify(input.features),
      amountMinorInr: input.requiresPayment ? input.amountMinorInr : null,
      strikeMinorInr: input.strikeMinorInr ?? null,
      amountMinorUsd: input.amountMinorUsd ?? null,
      strikeMinorUsd: input.strikeMinorUsd ?? null,
      durationMinutes: input.durationMinutes,
      followUpCount: input.followUpCount,
      followUpMinutes: input.followUpMinutes,
      requiresPayment: input.requiresPayment,
      showOnPricing: input.showOnPricing,
      featured: input.featured,
      active: input.active,
      sortOrder: input.sortOrder,
    })
    .returning();

  await db.insert(vopdAuditLog).values({
    reference: `PLAN-${slug}`.slice(0, 24),
    action: "PLAN_CREATED",
    actor: admin,
    note: `Created plan "${input.name}" (${input.durationMinutes} mins).`,
  });

  return rowToVopdPlan(created);
}

export async function updateCustomPlan(
  slug: string,
  patch: Partial<{ active: boolean; showOnPricing: boolean; featured: boolean; name: string; description: string; durationMinutes: number; amountMinorInr: number | null; amountMinorUsd: number | null; followUpCount: number; followUpMinutes: number; requiresPayment: boolean; features: string[]; subtitle: string | null; period: string | null }>,
  admin: string
): Promise<VopdPlan> {
  await ensureVopdSchema();
  // A built-in remains code-backed until its first admin edit. At that point
  // snapshot the *existing* published settings once; never seed over DB data.
  const builtin = getVopdPlan(slug);
  if (builtin) {
    await db.insert(vopdConsultationPlans).values({
      slug, name: builtin.name, subtitle: builtin.subtitle ?? null,
      period: builtin.period ?? null, description: builtin.description,
      featuresJson: JSON.stringify(builtin.inclusions), amountMinorInr: builtin.amountMinor,
      amountMinorUsd: builtin.amountMinorUsd ?? null, durationMinutes: builtin.bookingMinutes,
      followUpCount: builtin.followUpCount, followUpMinutes: builtin.followUpMinutes,
      requiresPayment: builtin.requiresPayment, showOnPricing: builtin.showOnPricing !== false,
      featured: Boolean(builtin.featured), active: true, sortOrder: builtin.sortOrder ?? 50,
    }).onConflictDoNothing();
  }
  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof patch.active === "boolean") values.active = patch.active;
  if (typeof patch.showOnPricing === "boolean") values.showOnPricing = patch.showOnPricing;
  if (typeof patch.featured === "boolean") values.featured = patch.featured;
  if (typeof patch.name === "string" && patch.name.trim().length >= 2) values.name = patch.name.trim().slice(0, 120);
  if (typeof patch.description === "string" && patch.description.trim().length >= 4) values.description = patch.description.trim().slice(0, 600);
  if (typeof patch.durationMinutes === "number" && patch.durationMinutes >= 10 && patch.durationMinutes <= 120) values.durationMinutes = Math.round(patch.durationMinutes);
  if (patch.amountMinorInr !== undefined) values.amountMinorInr = patch.amountMinorInr;
  if (patch.amountMinorUsd !== undefined) values.amountMinorUsd = patch.amountMinorUsd;
  if (typeof patch.followUpCount === "number") values.followUpCount = Math.max(0, Math.round(patch.followUpCount));
  if (typeof patch.followUpMinutes === "number") values.followUpMinutes = Math.max(0, Math.round(patch.followUpMinutes));
  if (typeof patch.requiresPayment === "boolean") values.requiresPayment = patch.requiresPayment;
  if (Array.isArray(patch.features)) values.featuresJson = JSON.stringify(patch.features);
  if (patch.subtitle !== undefined) values.subtitle = patch.subtitle;
  if (patch.period !== undefined) values.period = patch.period;

  const [updated] = await db
    .update(vopdConsultationPlans)
    .set(values)
    .where(eq(vopdConsultationPlans.slug, slug))
    .returning();

  if (!updated) throw new VopdConflictError("Consultation plan not found.", "NOT_FOUND");
  await db.insert(vopdAuditLog).values({
    reference: `PLAN-${slug}`.slice(0, 24),
    action: "PLAN_UPDATED",
    actor: admin,
    note: `Updated "${updated.name}" (active=${updated.active}, INR=${updated.amountMinorInr}, USD=${updated.amountMinorUsd}, duration=${updated.durationMinutes}).`,
  });
  return rowToVopdPlan(updated);
}

/** Historical plan references are immutable. DELETE is a soft-deactivation too. */
export async function deleteCustomPlan(slug: string, admin: string): Promise<void> {
  await updateCustomPlan(slug, { active: false }, admin);
  await db.insert(vopdAuditLog).values({
    reference: `PLAN-${slug}`.slice(0, 24), action: "PLAN_DEACTIVATED", actor: admin,
    note: "Plan deactivated; historical bookings and prices remain unchanged.",
  });
}
