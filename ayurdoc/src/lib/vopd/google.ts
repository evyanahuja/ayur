/* Google Calendar + Meet via OAuth 2.0 refresh token.
   A fresh conference is requested for each event (conferenceData.createRequest),
   which Google requires for Meet privacy. No secrets leave the server.
   Nothing here is claimed to work until clinic credentials are connected and an
   end-to-end confirmation test succeeds. */
import type { VopdBooking } from "@/db/schema";
import { VOPD_CONCERN_LABELS, type VopdConcernId } from "@/content/vopd";
import { isGoogleConfigured, TIME_ZONE } from "./config";

type CalendarResult = { eventId: string; meetUrl: string | null; htmlLink: string | null };

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

  const body = {
    summary: `VOPD · ${patientLabel} · ${booking.reference}`,
    description: [
      `Video OPD consultation with Dr. Priyanka Likhar.`,
      `Booking reference: ${booking.reference}`,
      `Patient: ${patientLabel}${booking.guardianName ? ` · Guardian: ${booking.guardianName}` : ""}`,
      `Category: ${concern}`,
      `Plan: ${booking.planName} (${booking.durationMinutes} minutes)`,
      `Phone: ${booking.phone}`,
    ].join("\n"),
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
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=none`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const payload = (await response.json().catch(() => ({}))) as {
    id?: string;
    hangoutLink?: string;
    htmlLink?: string;
    conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] };
    error?: { message?: string };
  };

  if (!response.ok || !payload.id) {
    throw new Error(`Google Calendar rejected the event: ${payload.error?.message || response.status}`);
  }

  const meetUrl =
    payload.hangoutLink ??
    payload.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri ??
    null;

  return { eventId: payload.id, meetUrl, htmlLink: payload.htmlLink ?? null };
}

/** Diagnostic used by the admin console: reports configuration without exposing secrets. */
export async function calendarHealth(): Promise<{ configured: boolean; reachable: boolean; message: string }> {
  if (!isGoogleConfigured()) {
    return { configured: false, reachable: false, message: "Google OAuth credentials are not configured. Use a manual Meet link." };
  }
  try {
    await accessToken();
    return { configured: true, reachable: true, message: "Google credentials accepted. Create a test booking to verify Meet generation." };
  } catch (error) {
    return { configured: true, reachable: false, message: error instanceof Error ? error.message : "Google token request failed." };
  }
}
