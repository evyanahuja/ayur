# AyurvedDoctor master update — implementation notes

## Scope preserved
The existing Next.js App Router + PostgreSQL/Drizzle architecture, OPD enquiry flow, VOPD booking flow, manual UPI verification, email transport, Google Calendar/Meet hooks, i18n languages (en/hi/mr/gu), and Netlify configuration were retained. Existing production plan records were not overwritten or seeded. The retired Bal Wellness Program was not recreated.

## Main changes
- Shared patient-type/gender category policy for OPD and VOPD, enforced in UI and API.
- Independent INR/USD plan prices; built-in plans can now receive database overrides; strictly automatic location-based currency (India → INR, outside India → USD, safe INR default when unknown, no manual switcher anywhere on the site); server-authoritative charged amount/currency snapshots.
- USD bookings use manual international transfer guidance, not an INR UPI QR.
- Weekly availability, multiple sessions, breaks, holidays, special dates, and configurable slot start interval (default 30 minutes) with Asia/Kolkata arithmetic.
- Booking/rescheduling revalidate schedule, plan, duration, price, holds, and overlap under transaction locks.
- Payment submission/approval/rejection audit entries are transactional; duplicate approvals are prevented.
- Admin dashboard sections: overview, appointments, plans/pricing, availability, holidays, payments/history, doctor profile.
- About Doctor copy translated into English, Hindi, Marathi, Gujarati; admin can edit introduction/care paragraphs per language; credentials/registration remain read-only.
- Registration authority centralized as `Madhya Pradesh Ayurveda, Unani & Naturopathy Board`; registration number remains `63934`.
- Clinic address/coordinates centralized from the existing repository Google Maps short link; embed, directions, and structured data use the same pin.

## Database changes (additive)
Apply with `npx drizzle-kit push` against the target database, or run equivalent SQL:

```sql
ALTER TABLE patient_inquiries ADD COLUMN IF NOT EXISTS patient_kind varchar(8) NOT NULL DEFAULT 'child';
ALTER TABLE patient_inquiries ADD COLUMN IF NOT EXISTS patient_gender varchar(20);
ALTER TABLE vopd_bookings ADD COLUMN IF NOT EXISTS payment_method varchar(32) NOT NULL DEFAULT 'UPI';

CREATE TABLE IF NOT EXISTS vopd_weekly_availability (
  weekday integer PRIMARY KEY,
  closed boolean NOT NULL DEFAULT false,
  sessions_json text NOT NULL DEFAULT '[]',
  breaks_json text NOT NULL DEFAULT '[]',
  interval_minutes integer NOT NULL DEFAULT 30,
  updated_by varchar(120) NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vopd_date_availability (
  date date PRIMARY KEY,
  closed boolean NOT NULL DEFAULT false,
  sessions_json text NOT NULL DEFAULT '[]',
  breaks_json text NOT NULL DEFAULT '[]',
  interval_minutes integer NOT NULL DEFAULT 30,
  reason varchar(200),
  updated_by varchar(120) NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doctor_profile_translations (
  language varchar(5) PRIMARY KEY,
  introduction text NOT NULL,
  care_paragraphs_json text NOT NULL,
  updated_by varchar(120) NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

No existing booking/plan rows are deleted. Plan DELETE is a soft deactivation.

## Netlify configuration
No Netlify build settings change is required. Keep the existing `netlify.toml` and production environment variables. Add/update only:
- `VOPD_USD_PAYMENT_INSTRUCTIONS` (optional public guidance for manual USD transfers).
- Ensure existing `DATABASE_URL`, admin, email, UPI, and Google variables remain set.

After deploying, apply the additive schema changes once against the production database. Do not commit `.env` or secrets.

## WhatsApp decision
Official Meta WhatsApp Business Platform pricing was reviewed. Cloud API access itself is free, but business-initiated utility/template messages and service messages beyond conditional free allowances can incur per-message charges. The requested admin payment-submitted alert cannot be guaranteed to occur inside a free customer-service/free-entry window, and patient confirmation may also require a chargeable utility template. Because the requirement is genuinely zero-cost for all required notifications, automated WhatsApp was skipped. Existing email notifications remain. No unofficial automation or paid provider was added.

## Testing
Regression tests live in `tests/master-update.spec.ts`, with updated legacy coverage in `tests/vopd.spec.ts` and `tests/regional-pricing.spec.ts`. Admin tests require local/test admin credentials; public tests do not. Google Calendar/Meet and outbound email were not configured in the sandbox, so those integrations were tested for failure isolation rather than live delivery.
