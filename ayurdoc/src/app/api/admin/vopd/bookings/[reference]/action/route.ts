import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/vopd/admin";
import { isBookingReference } from "@/content/vopd";
import {
  cancelBooking,
  completeBooking,
  getAuditTrail,
  getBooking,
  recordCalendarFailure,
  recordCalendarResult,
  rejectPayment,
  rescheduleBooking,
  setManualMeetUrl,
  VopdConflictError,
  verifyPayment,
} from "@/lib/vopd/store";
import { createCalendarEvent, googleConfigured } from "@/lib/vopd/google";
import { sendAdminConfirmation, sendConfirmation, sendMeetLink } from "@/lib/vopd/mailer";
import { db } from "@/db";
import { vopdAuditLog, vopdBookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const ACTIONS = ["verify", "reject", "cancel", "complete", "reschedule", "set-meet", "retry-calendar", "email-meet-link"] as const;
type Action = (typeof ACTIONS)[number];

type MailSummary = { recipient: "patient" | "clinic"; sent: boolean; reason: string };
type MailOutcome = { ok: boolean; message: string; results: MailSummary[] };

/** Sends the patient confirmation and the clinic confirmation together.
 *  Emails are strictly best-effort: a provider outage never changes the
 *  booking status, but the result is returned and written to the audit trail
 *  so a silent failure is impossible. */
async function notifyConfirmation(
  reference: string,
  admin: string,
  send: (booking: NonNullable<Awaited<ReturnType<typeof getBooking>>>) => Promise<{ sent: boolean; reason?: string; code?: string }>
): Promise<MailOutcome> {
  const booking = await getBooking(reference);
  if (!booking) return { ok: false, message: "Booking not found.", results: [] };

  const results: MailSummary[] = [];

  if (booking.email) {
    const patient = await send(booking).catch((error) => ({
      sent: false,
      reason: error instanceof Error ? error.message : "Unexpected email error.",
    }));
    results.push({ recipient: "patient", sent: patient.sent, reason: patient.sent ? "sent" : patient.reason || "unknown" });
    if (patient.sent) {
      await db.update(vopdBookings).set({ confirmationEmailSentAt: new Date() }).where(eq(vopdBookings.reference, reference));
    }
  } else {
    results.push({ recipient: "patient", sent: false, reason: "Booking has no patient email address." });
  }

  const clinic = await sendAdminConfirmation(booking).catch((error) => ({
    sent: false,
    reason: error instanceof Error ? error.message : "Unexpected email error.",
  }));
  results.push({ recipient: "clinic", sent: clinic.sent, reason: clinic.sent ? "sent" : clinic.reason || "unknown" });

  for (const result of results) {
    await db.insert(vopdAuditLog).values({
      reference,
      action: result.sent ? "CONFIRMATION_EMAIL_SENT" : "CONFIRMATION_EMAIL_FAILED",
      actor: admin,
      note: `${result.recipient === "clinic" ? "Clinic" : "Patient"} confirmation email: ${result.reason}`,
    }).catch((error) => console.error("Could not audit confirmation email:", error));
  }

  const failed = results.filter((result) => !result.sent);
  const patientResult = results.find((result) => result.recipient === "patient");
  const clinicResult = results.find((result) => result.recipient === "clinic");
  const message = failed.length === 0
    ? "Confirmation emails sent to the patient and the clinic."
    : `Email ${failed.length === 1 ? "issue" : "issues"} — patient: ${patientResult?.reason ?? "n/a"}, clinic: ${clinicResult?.reason ?? "n/a"}. Booking is confirmed regardless.`;
  return { ok: failed.length === 0, message, results };
}

async function confirmWithCalendar(reference: string, admin: string): Promise<{
  confirmed: boolean;
  calendar: string;
  meetUrl?: string | null;
  message: string;
  email?: MailOutcome;
}> {
  const booking = await getBooking(reference);
  if (!booking) return { confirmed: false, calendar: "NOT_FOUND", message: "Booking not found." };
  if (!googleConfigured()) {
    await recordCalendarFailure(reference, admin, "Google Calendar credentials are not configured.");
    return {
      confirmed: false,
      calendar: "NOT_CONFIGURED",
      message: "Payment is verified, but Google Calendar is not configured. The booking is safe; add a manual Meet link or retry after credentials are set.",
    };
  }
  try {
    const event = await createCalendarEvent(booking);
    const confirmed = await recordCalendarResult(reference, admin, event);
    const email = confirmed ? await notifyConfirmation(reference, admin, sendConfirmation) : undefined;
    return {
      confirmed: true,
      calendar: "CREATED",
      meetUrl: event.meetUrl,
      message: [
        event.meetUrl
          ? "Calendar event and Google Meet link created."
          : "Calendar event created, but Google returned no Meet link.",
        email ? email.message : "No confirmation email was sent because the calendar step did not complete.",
      ].join(" "),
      ...(email ? { email } : {}),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Calendar error";
    await recordCalendarFailure(reference, admin, message);
    return {
      confirmed: false,
      calendar: "FAILED",
      message: `Payment is verified and the booking is safe, but Calendar creation failed: ${message}. Retry once Google access is fixed.`,
    };
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  const { reference } = await params;
  if (!isBookingReference(reference)) return NextResponse.json({ ok: false, error: "Invalid reference." }, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const action = body?.action as Action;
  if (!ACTIONS.includes(action)) return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });

  try {
    if (action === "verify") {
      await verifyPayment(reference, admin);
      const outcome = await confirmWithCalendar(reference, admin);
      const latest = await getBooking(reference);
      return NextResponse.json({ ok: true, outcome, booking: latest, audit: await getAuditTrail(reference) });
    }
    if (action === "retry-calendar") {
      const booking = await getBooking(reference);
      if (!booking || booking.status !== "PAYMENT_VERIFIED") {
        return NextResponse.json({ ok: false, error: "Calendar retry is allowed only while the booking is PAYMENT_VERIFIED." }, { status: 409 });
      }
      const outcome = await confirmWithCalendar(reference, admin);
      return NextResponse.json({ ok: true, outcome, booking: await getBooking(reference), audit: await getAuditTrail(reference) });
    }
    if (action === "reject") {
      const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
      if (reason.length < 3) return NextResponse.json({ ok: false, error: "Add a rejection reason." }, { status: 400 });
      const booking = await rejectPayment(reference, admin, reason);
      return NextResponse.json({ ok: true, booking, audit: await getAuditTrail(reference) });
    }
    if (action === "cancel") {
      const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
      if (reason.length < 3) return NextResponse.json({ ok: false, error: "Add a cancellation reason." }, { status: 400 });
      const booking = await cancelBooking(reference, admin, reason);
      return NextResponse.json({ ok: true, booking, audit: await getAuditTrail(reference) });
    }
    if (action === "complete") {
      return NextResponse.json({ ok: true, booking: await completeBooking(reference, admin), audit: await getAuditTrail(reference) });
    }
    if (action === "reschedule") {
      const slotStartIso = typeof body?.slotStartIso === "string" ? body.slotStartIso : "";
      const booking = await rescheduleBooking(reference, slotStartIso, admin);
      return NextResponse.json({ ok: true, booking, audit: await getAuditTrail(reference) });
    }
    if (action === "set-meet") {
      const meetUrl = typeof body?.meetUrl === "string" ? body.meetUrl.trim() : "";
      if (!/^https:\/\/meet\.google\.com\/[a-z0-9-]{5,}$/i.test(meetUrl)) {
        return NextResponse.json({ ok: false, error: "Enter a valid https://meet.google.com/... link." }, { status: 400 });
      }
      const booking = await setManualMeetUrl(reference, meetUrl, admin);
      const email = await notifyConfirmation(reference, admin, sendMeetLink);
      return NextResponse.json({
        ok: true,
        booking,
        emailSent: email.results.some((result) => result.recipient === "patient" && result.sent),
        outcome: { message: email.message, results: email.results },
        audit: await getAuditTrail(reference),
      });
    }
    if (action === "email-meet-link") {
      const booking = await getBooking(reference);
      if (!booking || booking.status !== "CONFIRMED" || !booking.meetUrl) {
        return NextResponse.json({ ok: false, error: "A confirmed booking with a Meet link is required." }, { status: 409 });
      }
      const email = await notifyConfirmation(reference, admin, sendMeetLink);
      return NextResponse.json({
        ok: email.ok,
        emailSent: email.results.some((result) => result.recipient === "patient" && result.sent),
        error: email.ok ? undefined : email.message,
        message: email.message,
        results: email.results,
      });
    }
    return NextResponse.json({ ok: false, error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    if (error instanceof VopdConflictError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: 409 });
    }
    console.error(`VOPD admin action ${action} failed:`, error);
    return NextResponse.json({ ok: false, error: "The action failed. Nothing was lost; please retry." }, { status: 500 });
  }
}
