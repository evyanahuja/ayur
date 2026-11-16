/* Pure Asia/Kolkata slot arithmetic. India uses a fixed +05:30 offset (no DST),
   so wall-clock conversions are done explicitly and are deterministic on any server. */
import { BUFFER_MINUTES, MIN_LEAD_MINUTES, SESSIONS, SLOT_INTERVAL_MINUTES } from "./config";

export const IST_OFFSET_MINUTES = 330;
const DAY_MS = 24 * 60 * 60 * 1000;

export function isDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** "YYYY-MM-DD" + "HH:mm" in clinic time -> UTC instant. */
export function clinicWallTimeToUtc(dateString: string, timeString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hour, minute] = timeString.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET_MINUTES * 60_000);
}

/** Date part of an instant as seen in the clinic timezone. */
export function clinicDateString(instant: Date): string {
  const shifted = new Date(instant.getTime() + IST_OFFSET_MINUTES * 60_000);
  return shifted.toISOString().slice(0, 10);
}

export function clinicTimeString(instant: Date): string {
  const shifted = new Date(instant.getTime() + IST_OFFSET_MINUTES * 60_000);
  return shifted.toISOString().slice(11, 16);
}

export function clinicWeekday(dateString: string): number {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0 = Sunday
}

export function addDaysToDateString(dateString: string, days: number): string {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day) + days * DAY_MS).toISOString().slice(0, 10);
}

export type SlotSession = "morning" | "evening";
export type SlotCandidate = { startIso: string; endIso: string; label: string; session: SlotSession };

/** Format a clinic-time label such as "10:30 AM". */
export function slotLabel(instant: Date): string {
  const shifted = new Date(instant.getTime() + IST_OFFSET_MINUTES * 60_000);
  const hours = shifted.getUTCHours();
  const minutes = shifted.getUTCMinutes();
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function minutesFromTime(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

/**
 * Candidate start times for a date. A start is only included when the full
 * appointment duration fits before the session ends, so 30 mins and 20 mins
 * plans never overrun clinic closing times (10:00–14:00 & 17:00–20:00 IST).
 */
export function candidateSlots(
  dateString: string,
  durationMinutes: number,
  options: { interval?: number } = {}
): SlotCandidate[] {
  const interval = Math.max(5, options.interval ?? SLOT_INTERVAL_MINUTES);
  const safeDuration = Math.max(10, durationMinutes || 30);
  const weekday = clinicWeekday(dateString);
  if (weekday === 0) return []; // Mon–Sat clinic
  const slots: SlotCandidate[] = [];
  for (let sIdx = 0; sIdx < SESSIONS.length; sIdx++) {
    const session = SESSIONS[sIdx];
    const sessionKind: SlotSession = sIdx === 0 ? "morning" : "evening";
    const sessionStart = minutesFromTime(session.start);
    const sessionEnd = minutesFromTime(session.end);
    for (let minute = sessionStart; minute + safeDuration <= sessionEnd; minute += interval) {
      const time = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
      const start = clinicWallTimeToUtc(dateString, time);
      const end = new Date(start.getTime() + safeDuration * 60_000);
      slots.push({ startIso: start.toISOString(), endIso: end.toISOString(), label: slotLabel(start), session: sessionKind });
    }
  }
  return slots;
}

export type BusyInterval = { start: Date; end: Date; durationMinutes: number };

export type BookingSlot = { start: Date; durationMinutes: number };

/** Two appointments conflict when their occupied windows (duration + buffer) overlap. */
export function slotsOverlap(a: BookingSlot, b: BookingSlot, buffer = BUFFER_MINUTES): boolean {
  const aStart = a.start.getTime();
  const aEnd = aStart + (a.durationMinutes + buffer) * 60_000;
  const bStart = b.start.getTime();
  const bEnd = bStart + (b.durationMinutes + buffer) * 60_000;
  return aStart < bEnd && bStart < aEnd;
}

export function isFutureSlot(start: Date, now = new Date(), leadMinutes = MIN_LEAD_MINUTES): boolean {
  return start.getTime() >= now.getTime() + leadMinutes * 60_000;
}

export function getStoredEnd(start: Date, durationMinutes: number): Date {
  return new Date(start.getTime() + durationMinutes * 60_000);
}

export function todayInClinic(now = new Date()): string {
  return clinicDateString(now);
}

/** Next N open clinic dates (Mon–Sat) in IST with at least one future candidate slot. */
export function upcomingClinicDates(durationMinutes = 30, count = 6, maxLookahead = 30, now = new Date()): string[] {
  const today = todayInClinic(now);
  const out: string[] = [];
  for (let offset = 0; offset <= maxLookahead && out.length < count; offset++) {
    const candidate = addDaysToDateString(today, offset);
    if (clinicWeekday(candidate) === 0) continue;
    const hasFuture = candidateSlots(candidate, durationMinutes).some((slot) =>
      isFutureSlot(new Date(slot.startIso), now)
    );
    if (hasFuture) out.push(candidate);
  }
  return out;
}
