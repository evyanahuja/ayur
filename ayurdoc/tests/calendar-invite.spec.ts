import path from "node:path";
import Module from "node:module";
import { expect, test } from "@playwright/test";
import type { VopdBooking } from "../src/db/schema";

// App modules import with the "@/…" alias, which tsconfig.json does not apply to
// the tests folder. Map it to src/ for this process so the real modules load.
const moduleInternals = Module as unknown as {
  _resolveFilename: (request: string, ...rest: unknown[]) => string;
};
const originalResolve = moduleInternals._resolveFilename;
moduleInternals._resolveFilename = function (request: string, ...rest: unknown[]) {
  const mapped = request.startsWith("@/") ? path.join(process.cwd(), "src", request.slice(2)) : request;
  return originalResolve.call(this, mapped, ...rest);
};

/* Unit-level checks for the Google Calendar invite and the parent's confirmation
   email. Network calls are stubbed, so these run without Google or email
   credentials and never contact a real service. */

type Call = { url: string; init?: RequestInit };

const realFetch = globalThis.fetch;
let calls: Call[] = [];

function booking(overrides: Partial<VopdBooking> = {}): VopdBooking {
  return {
    reference: "VOPD-TESTINVT",
    patientKind: "child",
    patientName: "Test Child",
    guardianName: "Test Parent",
    gender: "Boy",
    mode: "online",
    ageOrDob: "2018-01-01 (8 yrs)",
    email: "parent@example.com",
    phone: "+919999999999",
    concernCategory: "general",
    planName: "First Consultation",
    durationMinutes: 30,
    followUpCount: 0,
    followUpMinutes: 0,
    amountMinor: 40000,
    currency: "INR",
    paymentMethod: "UPI",
    status: "CONFIRMED",
    paymentStatus: "VERIFIED",
    slotStart: new Date("2026-12-01T05:00:00.000Z"),
    meetUrl: "https://meet.google.com/abc-defg-hij",
    locale: "en",
    ...overrides,
  } as unknown as VopdBooking;
}

function stubGoogle(handler: (call: Call) => Response | Promise<Response>) {
  calls = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const call = { url, init };
    calls.push(call);
    if (url.includes("oauth2.googleapis.com/token")) {
      return Response.json({ access_token: "token-123", expires_in: 3600 });
    }
    return handler(call);
  }) as typeof fetch;
}

test.beforeEach(() => {
  process.env.GOOGLE_OAUTH_CLIENT_ID = "client";
  process.env.GOOGLE_OAUTH_CLIENT_SECRET = "secret";
  process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "refresh";
});
test.afterEach(() => {
  globalThis.fetch = realFetch;
});

test("invite lists the parent as a guest, is recognisable, and cannot be edited by guests", async () => {
  const { createCalendarEvent } = await import("../src/lib/vopd/google");
  stubGoogle(() =>
    Response.json({
      id: "evt1",
      hangoutLink: "https://meet.google.com/abc-defg-hij",
      organizer: { email: "clinic.sender@gmail.com", displayName: "Dr. Priyanka Likhar" },
    })
  );

  const result = await createCalendarEvent(booking());
  const event = calls.find((call) => call.url.includes("/events?"))!;
  const body = JSON.parse(String(event.init?.body));

  // Google only emails an invite when the guest is on the event and updates are sent.
  expect(event.url).toContain("sendUpdates=all");
  expect(event.url).toContain("conferenceDataVersion=1");
  expect(body.attendees).toEqual([{ email: "parent@example.com", displayName: "Test Child (child)" }]);

  // Recognisable title / location / source so it is clearly the clinic's invite.
  expect(body.summary).toContain("Dr. Priyanka Likhar");
  expect(body.summary).toContain("BalChikitsa Ayurved Clinic");
  expect(body.location).toContain("Google Meet");
  expect(body.source.title).toBe("BalChikitsa Ayurved Clinic");
  expect(body.description).toContain("sent by BalChikitsa Ayurved Clinic");

  // Guests may join but not rewrite or forward the appointment.
  expect(body.guestsCanModify).toBe(false);
  expect(body.guestsCanInviteOthers).toBe(false);
  expect(body.guestsCanSeeOtherGuests).toBe(false);

  // The sender identity Google will show is captured for the confirmation email.
  expect(result.organizer).toEqual({ email: "clinic.sender@gmail.com", displayName: "Dr. Priyanka Likhar" });
  expect(result.meetUrl).toBe("https://meet.google.com/abc-defg-hij");
});

test("no email address means no guest and no invite broadcast", async () => {
  const { createCalendarEvent } = await import("../src/lib/vopd/google");
  stubGoogle(() => Response.json({ id: "evt2", organizer: { email: "clinic.sender@gmail.com" } }));
  await createCalendarEvent(booking({ email: null }));
  const event = calls.find((call) => call.url.includes("/events?"))!;
  expect(event.url).toContain("sendUpdates=none");
  expect(JSON.parse(String(event.init?.body)).attendees).toBeUndefined();
});

test("a rejected guest address never blocks the confirmation", async () => {
  const { createCalendarEvent } = await import("../src/lib/vopd/google");
  let attempt = 0;
  stubGoogle(() => {
    attempt += 1;
    return attempt === 1
      ? Response.json({ error: { message: "Invalid attendee email." } }, { status: 400 })
      : Response.json({ id: "evt3", hangoutLink: "https://meet.google.com/xyz-xyzx-xyz", organizer: { email: "clinic.sender@gmail.com" } });
  });
  const result = await createCalendarEvent(booking());
  const eventCalls = calls.filter((call) => call.url.includes("/events?"));
  expect(eventCalls).toHaveLength(2);
  expect(JSON.parse(String(eventCalls[0].init?.body)).attendees).toHaveLength(1);
  expect(JSON.parse(String(eventCalls[1].init?.body)).attendees).toBeUndefined();
  expect(result.eventId).toBe("evt3");
});

test("health check reports which account the invites come from", async () => {
  const { calendarHealth } = await import("../src/lib/vopd/google");
  stubGoogle(() => Response.json({ id: "clinic.sender@gmail.com", summary: "clinic.sender@gmail.com" }));
  const health = await calendarHealth();
  expect(health.reachable).toBe(true);
  expect(health.senderEmail).toBe("clinic.sender@gmail.com");
  expect(health.message).toContain("clinic.sender@gmail.com");
  expect(health.senderAdvice).toMatch(/display name/i);
});

for (const locale of ["en", "hi", "mr", "gu"] as const) {
  test(`parent email names the invite sender in ${locale}`, async () => {
    process.env.RESEND_API_KEY = "test-key";
    const { sendConfirmation } = await import("../src/lib/vopd/mailer");
    let sent: { html?: string; text?: string; to?: string[] } = {};
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      sent = JSON.parse(String(init?.body));
      return Response.json({ id: "mail1" });
    }) as typeof fetch;

    const result = await sendConfirmation(booking({ locale } as Partial<VopdBooking>), { calendarSender: "clinic.sender@gmail.com" });
    expect(result.sent).toBe(true);
    expect(sent.to).toEqual(["parent@example.com"]);
    // The exact address appears (twice in the sentence), with no placeholder left behind.
    expect(sent.html).toContain("clinic.sender@gmail.com");
    expect(sent.html).not.toContain("{sender}");
    expect(sent.text).toContain("clinic.sender@gmail.com");
    delete process.env.RESEND_API_KEY;
  });
}

test("parent email says nothing about an invite when none was created", async () => {
  process.env.RESEND_API_KEY = "test-key";
  const { sendConfirmation } = await import("../src/lib/vopd/mailer");
  let sent: { html?: string } = {};
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    sent = JSON.parse(String(init?.body));
    return Response.json({ id: "mail2" });
  }) as typeof fetch;
  await sendConfirmation(booking());
  expect(sent.html).not.toMatch(/Google Calendar invitation/i);
  delete process.env.RESEND_API_KEY;
});
