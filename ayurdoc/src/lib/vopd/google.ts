/* Google Calendar + Meet via OAuth 2.0 refresh token.
   A fresh conference is requested for each event (conferenceData.createRequest),
   which Google requires for Meet privacy. No secrets leave the server.
   Nothing here is claimed to work until clinic credentials are connected and an
   end-to-end confirmation test succeeds. */
import type { VopdBooking } from "@/db/schema";
import { VOPD_CONCERN_LABELS, type VopdConcernId } from "@/content/vopd";
import { CLINIC_PHONE, isGoogleConfigured, TIME_ZONE } from "./config";
import { SITE } from "@/content/site";

/** The Google account that owns the calendar. Google sends the invite email
 *  from this identity, so it is exactly what the parent sees as the sender. */
export type CalendarOrganizer = { email: string | null; displayName: string | null };
export type CalendarResult = { eventId: string; meetUrl: string | null; htmlLink: string | null; organizer: CalendarOrganizer };

let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  if (!isGoogleConfigured()) throw new Error("Google Calendar is not configured.");
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!.trim(),
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!.trim(),
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN!.trim(),
      grant_type: "refresh_token",
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string; error?: string };
  if (!response.ok || !payload.access_token) {
    throw new Error(`Google token refresh failed: ${payload.error_description || payload.error || response.status}`);
  }
  cachedToken = { value: payload.access_token, expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000 };
  return payload.access_token;
}

export function googleConfigured(): boolean {
  return isGoogleConfigured();
}

/** Create one calendar event for one booking, with its own Meet conference. */
export async function createCalendarEvent(booking: VopdBooking): Promise<CalendarResult> {
  const token = await accessToken();
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID?.trim() || "primary");
  const startIso = booking.slotStart.toISOString();
  const endIso = new Date(booking.slotStart.getTime() + booking.durationMinutes * 60_000).toISOString();
  const concern = VOPD_CONCERN_LABELS[booking.concernCategory as VopdConcernId] ?? booking.concernCategory;
  const patientLabel = booking.patientKind === "child" ? `${booking.patientName} (child)` : booking.patientName;
  const attendees = booking.email ? [{ email: booking.email.trim(), displayName: patientLabel }] : [];

  const body = {
    // Leads with the doctor and clinic so the invite is recognisable even when
    // Gmail flags the sender as unknown.
    summary: `Video consultation · Dr. Priyanka Likhar · ${SITE.clinicName} (${booking.reference})`,
    description: [
      `Your video consultation with Dr. Priyanka Likhar at ${SITE.clinicName}.`,
      `This invitation was sent by ${SITE.clinicName} because you booked online at ${SITE.siteUrl}.`,
      ``,
      `Booking reference: ${booking.reference}`,
      `Patient: ${patientLabel}${booking.guardianName ? ` · Guardian: ${booking.guardianName}` : ""}`,
      `Category: ${concern}`,
      `Plan: ${booking.planName} (${booking.durationMinutes} minutes)`,
      `Phone: ${booking.phone}`,
      ``,
      `Questions or need to reschedule? Call or WhatsApp ${CLINIC_PHONE}.`,
    ].join("\n"),
    location: `Online — Google Meet · ${SITE.clinicName}`,
    source: { title: SITE.clinicName, url: SITE.siteUrl },
    // Guests may join, but cannot rewrite the appointment or forward it on.
    guestsCanModify: false,
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: false,
    start: { dateTime: startIso, timeZone: TIME_ZONE },
    end: { dateTime: endIso, timeZone: TIME_ZONE },
    // Google Calendar ignores conferenceData unless conferenceDataVersion=1 is sent.
    conferenceData: {
      createRequest: {
        requestId: `${booking.reference}-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    extendedProperties: { private: { vopdReference: booking.reference } },
    // Without attendees Google sends no invite email at all. The contact on the
    // booking is added as the guest so they receive the invite + Meet link.
    ...(attendees.length ? { attendees } : {}),
  };

  // sendUpdates=all mails the invite to attendees; without attendees there is
  // nobody to notify, so we keep the request quiet in that case.
  const sendUpdates = attendees.length ? "all" : "none";
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=${sendUpdates}`;
  const send = (payloadBody: object) =>
    fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payloadBody),
    });

  let response = await send(body);

  let payload = (await response.json().catch(() => ({}))) as {
    id?: string;
    hangoutLink?: string;
    htmlLink?: string;
    organizer?: { email?: string; displayName?: string };
    conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] };
    error?: { message?: string };
  };

  // A malformed guest address must never block the confirmation itself: fall back
  // to creating the event without attendees (the patient then gets our own
  // confirmation email with the Meet link instead).
  if (!response.ok && attendees.length && /attendee|invalid|permission/i.test(payload.error?.message || "")) {
    const { attendees: _drop, ...withoutAttendees } = body;
    console.error("Google Calendar rejected attendees, retrying without guests:", payload.error?.message);
    response = await send(withoutAttendees);
    payload = (await response.json().catch(() => ({}))) as typeof payload;
  }

  if (!response.ok || !payload.id) {
    throw new Error(`Google Calendar rejected the event: ${payload.error?.message || response.status}`);
  }

  const meetUrl =
    payload.hangoutLink ??
    payload.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri ??
    null;

  return {
    eventId: payload.id,
    meetUrl,
    htmlLink: payload.htmlLink ?? null,
    organizer: { email: payload.organizer?.email ?? null, displayName: payload.organizer?.displayName ?? null },
  };
}

/** Diagnostic used by the admin console: reports configuration without exposing secrets. */
export async function calendarHealth(): Promise<{
  configured: boolean;
  reachable: boolean;
  message: string;
  /** Account Google will show as the sender of every invite. */
  senderEmail?: string | null;
  senderAdvice?: string;
}> {
  if (!isGoogleConfigured()) {
    return { configured: false, reachable: false, message: "Google OAuth credentials are not configured. Use a manual Meet link." };
  }
  try {
    const token = await accessToken();
    const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID?.trim() || "primary");
    let senderEmail: string | null = null;
    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const calendar = (await response.json().catch(() => ({}))) as { id?: string };
      if (response.ok && calendar.id) senderEmail = calendar.id;
    } catch {
      /* identity lookup is informational only */
    }
    return {
      configured: true,
      reachable: true,
      message: senderEmail
        ? `Google credentials accepted. Calendar invites are sent from ${senderEmail}.`
        : "Google credentials accepted. Create a test booking to verify Meet generation.",
      senderEmail,
      senderAdvice:
        "Parents see this Google account's name as the sender. Set its display name to “Dr. Priyanka Likhar – Prakriti Ayurveda Clinic” in Google Account → Personal info → Name, and add a profile photo, so the invite is recognised.",
    };
  } catch (error) {
    return { configured: true, reachable: false, message: error instanceof Error ? error.message : "Google token request failed." };
  }
}
