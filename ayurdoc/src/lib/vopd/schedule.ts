/* Clinic-local scheduling. Missing rows preserve the original Mon–Sat schedule.
 * Every administrative write shares a transaction lock with booking creation. */
import { asc, eq, gte, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { vopdAuditLog, vopdDateAvailability, vopdWeeklyAvailability } from "@/db/schema";
import { VOPD_DEFAULTS } from "@/content/vopd";
import { addDaysToDateString, clinicWeekday, isDateString, todayInClinic, type TimeRange } from "./slots";

export type ClinicSchedule = {
  closed: boolean;
  sessions: TimeRange[];
  breaks: TimeRange[];
  intervalMinutes: number;
  reason?: string;
};

const originalSessions: TimeRange[] = [
  { start: VOPD_DEFAULTS.sessionStart, end: VOPD_DEFAULTS.sessionEnd },
  { start: VOPD_DEFAULTS.eveningStart, end: VOPD_DEFAULTS.eveningEnd },
];

export function defaultSchedule(weekday: number): ClinicSchedule {
  return {
    closed: weekday === 0,
    sessions: weekday === 0 ? [] : originalSessions.map((s) => ({ ...s })),
    breaks: [],
    intervalMinutes: VOPD_DEFAULTS.slotIntervalMinutes,
  };
}

function rangesFromJson(value: string): TimeRange[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error("Invalid saved schedule.");
  return parsed as TimeRange[];
}

function fromRow(row: { closed: boolean; sessionsJson: string; breaksJson: string; intervalMinutes: number; reason?: string | null }): ClinicSchedule {
  return {
    closed: row.closed,
    sessions: rangesFromJson(row.sessionsJson),
    breaks: rangesFromJson(row.breaksJson),
    intervalMinutes: row.intervalMinutes,
    ...(row.reason ? { reason: row.reason } : {}),
  };
}

export async function getScheduleForDate(date: string): Promise<ClinicSchedule> {
  if (!isDateString(date)) throw new Error("Invalid clinic date.");
  if (!isDatabaseConfigured()) return defaultSchedule(clinicWeekday(date));
  const [special] = await db.select().from(vopdDateAvailability).where(eq(vopdDateAvailability.date, date)).limit(1);
  if (special) return fromRow(special);
  const [weekly] = await db.select().from(vopdWeeklyAvailability).where(eq(vopdWeeklyAvailability.weekday, clinicWeekday(date))).limit(1);
  return weekly ? fromRow(weekly) : defaultSchedule(clinicWeekday(date));
}

export async function getScheduleSettings() {
  const [weeklyRows, specialRows] = await Promise.all([
    db.select().from(vopdWeeklyAvailability).orderBy(asc(vopdWeeklyAvailability.weekday)),
    db.select().from(vopdDateAvailability)
      .where(gte(vopdDateAvailability.date, addDaysToDateString(todayInClinic(), -30)))
      .orderBy(asc(vopdDateAvailability.date)),
  ]);
  const weekly = Array.from({ length: 7 }, (_, weekday) => {
    const row = weeklyRows.find((r) => r.weekday === weekday);
    return { weekday, ...row ? fromRow(row) : defaultSchedule(weekday), configured: Boolean(row) };
  });
  const exceptions = specialRows.map((row) => ({ date: row.date, ...fromRow(row), updatedBy: row.updatedBy }));
  return { weekly, exceptions, timeZone: "Asia/Kolkata", defaultIntervalMinutes: 30 };
}

function parseRanges(raw: unknown, field: string, max: number): TimeRange[] {
  if (!Array.isArray(raw) || raw.length > max) throw new Error(`Provide up to ${max} ${field} as start/end times.`);
  const ranges: TimeRange[] = raw.map((item) => {
    if (!item || typeof item !== "object") throw new Error(`Invalid ${field} range.`);
    const { start, end } = item as Record<string, unknown>;
    const valid = (time: unknown) => typeof time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
    if (!valid(start) || !valid(end) || (start as string) >= (end as string)) throw new Error(`Invalid ${field} start/end time.`);
    return { start: start as string, end: end as string };
  });
  ranges.sort((a, b) => a.start.localeCompare(b.start));
  if (ranges.some((range, i) => i > 0 && ranges[i - 1].end > range.start)) {
    throw new Error(`${field} cannot overlap.`);
  }
  return ranges;
}

export function validateSchedule(raw: unknown): ClinicSchedule {
  if (!raw || typeof raw !== "object") throw new Error("Provide clinic hours.");
  const value = raw as Record<string, unknown>;
  if (typeof value.closed !== "boolean") throw new Error("Specify whether the clinic is closed.");
  const closed = value.closed;
  const sessions = parseRanges(value.sessions ?? [], "sessions", 8);
  const breaks = parseRanges(value.breaks ?? [], "breaks", 16);
  const intervalMinutes = Number(value.intervalMinutes ?? 30);
  if (!Number.isInteger(intervalMinutes) || intervalMinutes < 5 || intervalMinutes > 60 || intervalMinutes % 5 !== 0) {
    throw new Error("Slot start interval must be a multiple of 5 between 5 and 60 minutes.");
  }
  if (!closed && !sessions.length) throw new Error("Open days need at least one working session.");
  if (!closed && breaks.some((pause) => !sessions.some((session) => pause.start >= session.start && pause.end <= session.end))) {
    throw new Error("Each break must lie entirely inside one working session.");
  }
  const reason = typeof value.reason === "string" ? value.reason.trim().slice(0, 200) : "";
  return { closed, sessions: closed ? [] : sessions, breaks: closed ? [] : breaks, intervalMinutes, ...(reason ? { reason } : {}) };
}

export async function saveWeeklySchedule(weekday: number, schedule: ClinicSchedule, admin: string) {
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) throw new Error("Invalid weekday.");
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('vopd:schedule'))`);
    await tx.insert(vopdWeeklyAvailability).values({
      weekday, closed: schedule.closed, sessionsJson: JSON.stringify(schedule.sessions),
      breaksJson: JSON.stringify(schedule.breaks), intervalMinutes: schedule.intervalMinutes,
      updatedBy: admin, updatedAt: new Date(),
    }).onConflictDoUpdate({ target: vopdWeeklyAvailability.weekday, set: {
      closed: schedule.closed, sessionsJson: JSON.stringify(schedule.sessions),
      breaksJson: JSON.stringify(schedule.breaks), intervalMinutes: schedule.intervalMinutes,
      updatedBy: admin, updatedAt: new Date(),
    } });
    await tx.insert(vopdAuditLog).values({ reference: `SCHEDULE-${weekday}`, action: "WEEKLY_HOURS_UPDATED", actor: admin,
      note: JSON.stringify(schedule).slice(0, 900) });
  });
}

export async function saveDateSchedule(date: string, schedule: ClinicSchedule, admin: string) {
  if (!isDateString(date)) throw new Error("Choose a valid date.");
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('vopd:schedule'))`);
    await tx.insert(vopdDateAvailability).values({
      date, closed: schedule.closed, sessionsJson: JSON.stringify(schedule.sessions),
      breaksJson: JSON.stringify(schedule.breaks), intervalMinutes: schedule.intervalMinutes,
      reason: schedule.reason ?? null, updatedBy: admin, updatedAt: new Date(),
    }).onConflictDoUpdate({ target: vopdDateAvailability.date, set: {
      closed: schedule.closed, sessionsJson: JSON.stringify(schedule.sessions),
      breaksJson: JSON.stringify(schedule.breaks), intervalMinutes: schedule.intervalMinutes,
      reason: schedule.reason ?? null, updatedBy: admin, updatedAt: new Date(),
    } });
    await tx.insert(vopdAuditLog).values({ reference: `DATE-${date}`, action: schedule.closed ? "HOLIDAY_SET" : "SPECIAL_HOURS_SET",
      actor: admin, note: JSON.stringify(schedule).slice(0, 900) });
  });
}

export async function removeDateSchedule(date: string, admin: string) {
  if (!isDateString(date)) throw new Error("Choose a valid date.");
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('vopd:schedule'))`);
    const [removed] = await tx.delete(vopdDateAvailability).where(eq(vopdDateAvailability.date, date)).returning();
    if (!removed) throw new Error("Date override not found.");
    await tx.insert(vopdAuditLog).values({ reference: `DATE-${date}`, action: "DATE_OVERRIDE_REMOVED", actor: admin,
      note: `Removed override (${removed.closed ? "closed" : "special hours"}); weekly schedule applies again.` });
  });
}
