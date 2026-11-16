# VOPD — Video OPD with 30-minute slots, manual UPI verification and conditional patient forms

## What was built

A **VOPD (online video consultation)** workflow now sits beside the existing **OPD (in-clinic enquiry)** flow inside the
existing `PatientEnquiryForm` used on `/contact` and the homepage booking section. OPD remains the default and its
fields, validation, API and email notifications are unchanged.

VOPD adds:

1. **Consultation type selector** at the top of the form: OPD (in-clinic) or VOPD (video). Only one workflow renders at a time.
2. **Adult/child conditional fields.** Child: parent/guardian name required, child name, age/DOB, optional gender,
   parent mobile, email, city, state. Adult: patient name, age/DOB, optional gender, mobile, email, city, state and
   **no guardian field**.
3. **Category dropdown** reusing the ten existing health-concern category IDs plus Panchakarma, General and Other.
4. **Plan selection from the existing `PLANS` configuration.** Fees are server-authoritative; Suvarnaprashan and
   "Not sure" have **no invented price** and are enquiry-only.
5. **Asia/Kolkata 30-minute start grid** within Mon–Sat 10:00–14:00 and 17:00–20:00. Appointment duration (30 / 20 mins) plus a configurable buffer determines overlap, so 30 mins bookings block adjacent starts.
   Past slots, blocked dates, expired holds and existing appointments are excluded.
6. **15-minute unpaid hold** (configurable), released automatically; availability and admin lists expire stale holds.
7. **Manual UPI payment:** QR/beneficiary/instructions, UTR required, optional screenshot (≤2 MB, PNG/JPG/WebP).
   Payment becomes `PAYMENT_VERIFICATION_PENDING`; the appointment remains `PENDING_CONFIRMATION` semantics
   (`PAYMENT_VERIFICATION_PENDING`) and the UI states it is **not confirmed**.
8. **Admin console** at `/admin/vopd` (noindex, robots-disallowed) to verify, reject, cancel, reschedule, complete,
   retry Calendar, attach a manual Meet link, block/unblock dates, view screenshots and audit history.
9. **Google Calendar + Meet** creation after verification, with failure isolation and retry.
10. **Emails** (acknowledgement, admin new booking, payment submitted, confirmation with Meet link, Meet-link email)
    through the existing Resend/SMTP transport.
11. **Statuses** with validated transitions: `SLOT_RESERVED`, `PAYMENT_PENDING`, `PAYMENT_VERIFICATION_PENDING`,
    `PAYMENT_VERIFIED`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`, `EXPIRED`. `CONFIRMED` is reachable only from
    `PAYMENT_VERIFIED`.

## Files

### Created
- `src/content/vopd.ts` — shared VOPD types, statuses, plan metadata bridge, category IDs, formatters.
- `src/lib/vopd/config.ts` — server-only plans/config, UPI and Google configuration detection.
- `src/lib/vopd/slots.ts` — timezone-safe slot grid, overlap and lead-time helpers.
- `src/lib/vopd/validation.ts` — server-side booking and payment validation.
- `src/lib/vopd/admin.ts` — hashed/plain password check, HMAC-signed admin cookie, login throttling.
- `src/lib/vopd/store.ts` — persistence, hold expiry, transactional double-booking prevention, status transitions, audit.
- `src/lib/vopd/google.ts` — OAuth refresh-token Calendar event + unique Meet conference creation.
- `src/lib/vopd/mailer.ts` — VOPD email templates using the shared transport.
- `src/components/VopdBookingForm.tsx` — 7-step patient UI.
- `src/components/VopdAdminConsole.tsx` — admin login and verification console.
- `src/app/admin/vopd/page.tsx` — noindex admin page.
- API routes:
  - public: `/api/vopd/config`, `/api/vopd/availability`, `/api/vopd/bookings`,
    `/api/vopd/bookings/[reference]`, `/api/vopd/bookings/[reference]/payment`
  - admin (authenticated): `/api/admin/vopd/login`, `/api/admin/vopd/logout`, `/api/admin/vopd/bookings`,
    `/api/admin/vopd/bookings/[reference]`, `/api/admin/vopd/bookings/[reference]/action`,
    `/api/admin/vopd/bookings/[reference]/screenshot`, `/api/admin/vopd/blocked`
- `tests/vopd.spec.ts` — 9 VOPD tests.
- `.env.example` — complete configuration reference (no secrets).
- `docs/VOPD.md` — this document.

### Modified
- `src/db/schema.ts` — added `vopd_bookings`, `vopd_audit_log`, `vopd_blocked_slots`, `vopd_payment_screenshots`.
  Existing `patient_inquiries` is untouched (legacy enums were not deleted to avoid breaking deployments).
- `src/lib/email.ts` — appended `sendSystemEmail`; existing OPD functions unchanged.
- `src/components/PatientEnquiryForm.tsx` — added OPD/VOPD selector and conditional VOPD render; OPD path preserved.
- `src/app/robots.ts` — disallow `/admin/`.

## Database changes

| Table | Purpose |
|---|---|
| `vopd_bookings` | booking, patient, `locale` (en/hi/mr/gu), plan snapshot, server fee, slot, statuses, hold, UTR/payer, verification, Calendar/Meet fields |
| `vopd_audit_log` | immutable action history: creation, payment submitted, verified, rejected, cancelled, rescheduled, calendar created/failed, manual Meet, blocked dates |
| `vopd_blocked_slots` | full-day clinic blocks |
| `vopd_payment_screenshots` | optional screenshot bytes (separate table so list queries never load images) |

Apply with `npx drizzle-kit push`. No existing table was altered.

**Money model:** VOPD charges the INR list price from `PLANS`. Paid plans store server-computed minor units
(`₹400 → 40000`). The browser cannot set the fee; `amountMinor` from the client is ignored. The UI shows the USD guide
price for international visitors but clearly states UPI is charged in INR. International card payment is **not** offered.

## Environment variables

See `.env.example`. VOPD-specific (all server-only, never `NEXT_PUBLIC_`):

- `VOPD_ADMIN_PASSWORD` or `VOPD_ADMIN_PASSWORD_SHA256`, `VOPD_ADMIN_SESSION_SECRET` (≥32 chars), optional `VOPD_ADMIN_NAME`.
- `VOPD_UPI_NAME`, `VOPD_UPI_ID`, `VOPD_UPI_QR_PATH` (default `/images/upi-qr.png`).
- `VOPD_SLOT_INTERVAL_MINUTES` (30), `VOPD_BUFFER_MINUTES` (10), `VOPD_HOLD_MINUTES` (15), `VOPD_ADVANCE_DAYS` (30),
  `VOPD_MIN_LEAD_MINUTES` (60).
- Google: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` (default `primary`).
- Existing email: `RESEND_API_KEY` + `FROM_EMAIL`, or SMTP variables; `DOCTOR_EMAIL` is the admin notification inbox.

If admin or UPI variables are absent the feature degrades safely: the admin console reports "not configured", and
patients are told to call/WhatsApp instead of paying into an unverified account.

## Google account permissions and setup

Google Meet has no standalone creation API: a fresh conference is requested on a Calendar event
(`conferenceData.createRequest` with `conferenceDataVersion=1`), and Google returns `hangoutLink`/`entryPoints`.

1. Create/select a Google Cloud project, enable **Google Calendar API**.
2. Configure an OAuth consent screen and add scope `https://www.googleapis.com/auth/calendar.events`
   (or narrower `calendar.events.owned` if suitable). Publishing/verification may be needed for external use.
3. Create OAuth client credentials, then obtain a **refresh token for the doctor's own Google account** with offline
   access (authorization code flow, `access_type=offline&prompt=consent`). A Google Workspace service account with
   domain-wide delegation and impersonation can be used instead if the clinic uses Workspace; personal Gmail cannot
   delegate to a service account.
4. Set `GOOGLE_OAUTH_*` and `GOOGLE_CALENDAR_ID` in Netlify, redeploy.
5. The clinic account must be allowed to create Meet conferences on that calendar; otherwise Google returns no Meet link.

**Not verified in this environment.** No Google credentials exist in the sandbox. The code path is implemented but has
only been tested for failure isolation (booking remains `PAYMENT_VERIFIED`, Calendar marked `FAILED`, retry available).
A real end-to-end test — verify payment → event appears in the doctor's calendar → unique Meet link in the email — is
still required before claiming Calendar/Meet works.

## UPI QR setup

1. Generate a QR for the clinic's own UPI ID (for example `clinic@okaxis`) using the clinic's banking/UPI app. The QR
   must encode the clinic's beneficiary and UPI ID; never a personal number belonging to a developer.
2. Save it as `public/images/upi-qr.png` (or set `VOPD_UPI_QR_PATH` to another public path) and redeploy.
3. Set `VOPD_UPI_NAME` and `VOPD_UPI_ID` so the patient sees the same details as the QR.
4. Cross-check name, UPI ID and amount on a real phone before launch. The website does not validate QR contents.
5. Payment stays manual: no gateway, no webhook, no automatic confirmation.

## Admin payment verification

1. Open `/admin/vopd` and sign in with the configured administrator password (2-hour signed session, throttled logins).
2. Filter **PAYMENT_VERIFICATION_PENDING**; open a booking.
3. Confirm the amount and payer in the clinic bank/UPI account. Treat the UTR and screenshot as supporting evidence only.
4. Choose **Verify payment & confirm**. This atomically marks payment verified (duplicate verification returns a conflict),
   then attempts Calendar + Meet creation and sends the confirmation email.
5. If Calendar fails, the payment stays verified. Use **Retry Google Calendar** after fixing credentials, or paste a
   manually generated `https://meet.google.com/...` link (the patient is emailed the link). **Reject** with a reason,
   **Cancel**, **Reschedule** or **Mark completed** as appropriate. Every action is written to the audit log.
6. Blocked dates can be added/removed at the bottom of the console.

## Status handling

`CONFIRMED` requires `PAYMENT_VERIFIED`. A rejected/cancelled/expired booking never becomes confirmed. If a patient paid
but the 15-minute hold expired, submission is refused with a clear message to contact the clinic with the reference;
the administrator can resolve it manually (new booking or refund handled outside the site). Slot time can never be
double-booked: creation/reschedule run inside a PostgreSQL transaction with a per-day advisory lock plus overlap checks.

## Testing performed (sandbox)

Environment: local PostgreSQL, production build served locally, Playwright Chromium. Email/Google/UPI were not real.

Run with admin credentials exported (never commit them): `VOPD_ADMIN_PASSWORD=… VOPD_ADMIN_SESSION_SECRET=… npx playwright test tests/vopd.spec.ts`.

`npx playwright test tests/vopd.spec.ts` — **14/14 passed** (9 domain/API + 5 multilingual/UI):

**Multilingual additions (v2)**
- `src/i18n/vopd.ts` holds the full patient-flow dictionary for EN/HI/MR/GU (labels, errors, statuses, payment copy, emails).
- The visitor's language is sent to `/api/vopd/bookings` as `locale`, validated server-side, stored in
  `vopd_bookings.locale`, and used to localize the acknowledgement, confirmation and Meet-link emails.
- Browser tests verify fully translated VOPD journeys in Hindi, Marathi and Gujarati (selector, steps, child/adult copy,
  validation messages, concern fields) and that `locale` reaches the API.

**Original suite**
1. OPD remains the default consultation type with existing fields.
2. VOPD reveals child fields incl. required guardian; Adult hides guardian fields.
3. Config returns ₹400 / ₹4,999 / ₹300 and enquiry-only Suvarnaprashan with no amount.
4. 30-minute start grid; first consultation blocks the overlapping next start; overlap rejected.
5. Follow-up reserves 20 minutes and allows the adjacent 30-minute start.
6. Server rejects tampered amount, past slot and child booking without guardian.
7. Payment submission stores UTR, returns `PAYMENT_VERIFICATION_PENDING`, warns it is not confirmed; duplicate submission rejected.
8. Unauthenticated verification rejected; admin verification sets `PAYMENT_VERIFIED`; with Google unconfigured the
   booking stays safe with Calendar `FAILED`, and retry reports not configured; duplicate verification returns 409;
   audit trail contains creation/payment/verification/calendar-failure; cancellation recorded.
9. Rejection requires admin and sets `REJECTED`.
10. Optional PNG screenshot stored; screenshot endpoint 401 without admin, 200 with admin.
11. Blocked date removes availability.

`npx playwright test tests/expansion-release.spec.ts` — **7/7 passed** (4 languages, mobile nav, draft SEO, consent 400),
confirming the OPD enquiry path and multilingual pages still work. A 390px check showed **0px** horizontal overflow in
the VOPD flow. Type generation, `tsc --noEmit`, production build and platform health check passed.

### Not tested / not verifiable here
- Real Netlify deploy (files still need to be pushed/uploaded).
- Real Resend/SMTP delivery to patient and doctor inboxes.
- Real Google OAuth, Calendar event and Meet link creation.
- Real UPI transfer, QR correctness, bank reconciliation.
- Production DB migration (schema applied to the sandbox DB only).
- VOPD **patient flow and patient emails support all four site languages** (English, Hindi, Marathi, Gujarati). The
  **admin console remains English-only** by design (single internal clinic operator tool). Clinical/consent wording in
  HI/MR/GU still needs physician and native-speaker review before launch.
- Automated browser tests used the sandbox admin credentials in a temporary `.env.local`; that file was removed. Production
  credentials must be set in Netlify.

## Remaining manual setup before launch

1. Add the Netlify environment variables (database, email, admin, UPI, Google) and redeploy; run `npx drizzle-kit push`
   against the production database.
2. Replace the test admin password with a strong unique value and a 32+ character session secret; confirm login works.
3. Upload a real UPI QR and verify beneficiary/UPI ID on a live phone.
4. Complete the Google OAuth refresh-token flow, connect the doctor's account, and run one end-to-end test including the
   Meet link and confirmation email. Until then, use the manual Meet-link fallback.
5. Confirm `DOCTOR_EMAIL` inbox and sender domain/SPF/DKIM for reliable delivery.
6. Decide refund/no-show policy, consent/retention wording, and how administrators will handle "paid after hold expired".
7. Translate the VOPD flow and have the doctor approve all English/translated clinical and consent wording.
8. Consider a cron/scheduled cleanup for holds (currently lazy expiry on availability/admin reads), and a shared rate-limit
   store if traffic grows. Calendar reschedule currently marks `RESYNC_REQUIRED`; retry creates a new event rather than
   updating the original — add event update/delete for cleaner calendar hygiene.

## Payment QR (auto-generated)

The patient payment QR no longer depends on uploading an image. When `VOPD_UPI_ID` and `VOPD_UPI_NAME` are set,
`GET /api/vopd/bookings/{reference}/upi-qr` returns an SVG QR encoding
`upi://pay?pa=<VPA>&pn=<beneficiary>&am=<server amount>&cu=INR&tn=<booking reference>`.
The payee and amount are taken from server environment variables and the stored booking, never from the client.
`VOPD_UPI_QR_PATH` remains an optional override for a static clinic QR image (must be served from our own origin or an
allowed CSP host). If UPI is not configured, patients see the phone/WhatsApp fallback and no QR is rendered.

`VOPD_UPI_DEMO=true` marks the configuration as a sandbox test: the payment panel shows a
"Test configuration — do not send real money" banner in all four languages. **Never set this in production.**

## Verifying a payment (administrator walkthrough)

1. Sign in at `/admin/vopd` with `VOPD_ADMIN_PASSWORD` (sessions are HttpOnly, SameSite=Lax, expire after 2 hours).
2. The default filter is `PAYMENT_VERIFICATION_PENDING`. Open the booking and compare the payer name, UTR/transaction
   reference and **exact amount** against the clinic's actual bank/UPI statement. A UTR or screenshot alone is never proof.
3. Click **Verify payment & confirm**. The payment becomes `VERIFIED` and the server attempts Google Calendar + Meet.
   - Google configured and reachable → status `CONFIRMED`, Meet link stored, confirmation email attempted.
   - Google missing/failing → status stays `PAYMENT_VERIFIED`, a warning is shown, and the booking is safe.
     Paste a `https://meet.google.com/...` link and click **Save & email link**: this confirms the appointment
     (`CONFIRMED`) and emails the patient. **Retry Google Calendar** is available once credentials are fixed.
4. **Reject payment** requires a reason and moves the booking to `REJECTED` (slot freed). **Cancel booking** frees the slot
   at any pre-completion stage. Every action is written to `vopd_audit_log` with the administrator name.
5. Duplicate verification/rejection is rejected server-side; patients cannot call any admin endpoint without a session.

## Google Calendar + Meet configuration (for automatic links)

1. In Google Cloud Console create a project and enable the **Google Calendar API**.
2. Configure the OAuth consent screen (External, testing mode is fine) and add the doctor's Google account as a test user.
3. Create an **OAuth client ID** (Web application or Desktop) and note the client ID/secret.
4. Obtain a refresh token for the doctor's account with scope `https://www.googleapis.com/auth/calendar.events`
   (OAuth Playground or a one-off local script with `access_type=offline&prompt=consent`).
5. Set in Netlify: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`,
   and optionally `GOOGLE_CALENDAR_ID` (defaults to `primary`).
6. Redeploy, then run one real booking end to end: verify payment → confirm the event appears in the doctor's calendar
   with a `meet.google.com` link → confirm the patient email contains the join link. Until this passes, use the manual
   Meet-link fallback; the system never reports a Meet link that was not actually created.

## Sandbox preview testing

The preview `.env.local` contains placeholder UPI (`VOPD_UPI_DEMO=true`) and preview-only admin credentials so the whole
flow (QR → UTR → manual verification → manual Meet link → confirmed) can be exercised without real money or Google
credentials. These values must never be copied to Netlify. Automated coverage: `tests/hero-and-upi.spec.ts`
(three-line hero headline, QR generation, pending-until-verified, admin-only actions, manual Meet confirmation).
