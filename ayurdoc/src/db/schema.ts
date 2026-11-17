// Patient inquiry schema for Dr. Priyanka Likhar landing page, plus VOPD (video OPD) tables.
import { pgTable, serial, varchar, text, timestamp, integer, boolean, date, customType, index, uniqueIndex } from "drizzle-orm/pg-core";

export const patientInquiries = pgTable("patient_inquiries", {
  id: serial("id").primaryKey(),
  parentName: varchar("parent_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 160 }),
  childName: varchar("child_name", { length: 120 }).notNull(),
  childAge: varchar("child_age", { length: 40 }).notNull(),
    childGender: varchar("child_gender", { length: 20 }),
    patientKind: varchar("patient_kind", { length: 8 }).notNull().default("child"),
    patientGender: varchar("patient_gender", { length: 20 }),
    concernCategory: varchar("concern_category", { length: 40 }).notNull().default("general"),
  symptoms: text("symptoms"),
  preferredMode: varchar("preferred_mode", { length: 20 }).notNull().default("online"),
  preferredDate: varchar("preferred_date", { length: 40 }),
  preferredTime: varchar("preferred_time", { length: 40 }),
  planInterest: varchar("plan_interest", { length: 60 }),
  message: text("message"),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PatientInquiry = typeof patientInquiries.$inferSelect;
export type NewPatientInquiry = typeof patientInquiries.$inferInsert;

/* ============================ VOPD ============================ */

export const vopdBookings = pgTable(
  "vopd_bookings",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 24 }).notNull(),
    mode: varchar("mode", { length: 8 }).notNull().default("vopd"),
    patientKind: varchar("patient_kind", { length: 8 }).notNull(),
    patientName: varchar("patient_name", { length: 120 }).notNull(),
    guardianName: varchar("guardian_name", { length: 120 }),
    ageOrDob: varchar("age_or_dob", { length: 40 }).notNull(),
    gender: varchar("gender", { length: 20 }),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 160 }),
    city: varchar("city", { length: 80 }),
    state: varchar("state", { length: 80 }),
    concernCategory: varchar("concern_category", { length: 40 }).notNull(),
    symptoms: text("symptoms").notNull(),
    duration: varchar("duration", { length: 120 }),
    previousDiagnosis: text("previous_diagnosis"),
    currentTreatment: text("current_treatment"),
    message: text("message"),
    planId: varchar("plan_id", { length: 40 }).notNull(),
    planName: varchar("plan_name", { length: 120 }).notNull(),
    amountMinor: integer("amount_minor"),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    paymentMethod: varchar("payment_method", { length: 32 }).notNull().default("UPI"),
    durationMinutes: integer("duration_minutes").notNull(),
    followUpCount: integer("follow_up_count").notNull().default(0),
    followUpMinutes: integer("follow_up_minutes").notNull().default(0),
    slotStart: timestamp("slot_start", { withTimezone: true }).notNull(),
    slotEnd: timestamp("slot_end", { withTimezone: true }).notNull(),
    status: varchar("status", { length: 40 }).notNull().default("SLOT_RESERVED"),
    paymentStatus: varchar("payment_status", { length: 24 }).notNull().default("PENDING"),
    holdExpiresAt: timestamp("hold_expires_at", { withTimezone: true }),
    payerName: varchar("payer_name", { length: 120 }),
    upiReference: varchar("upi_reference", { length: 80 }),
    paymentSubmittedAt: timestamp("payment_submitted_at", { withTimezone: true }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    verifiedBy: varchar("verified_by", { length: 120 }),
    rejectionReason: text("rejection_reason"),
    meetUrl: text("meet_url"),
    calendarEventId: varchar("calendar_event_id", { length: 200 }),
    calendarStatus: varchar("calendar_status", { length: 24 }).notNull().default("NOT_ATTEMPTED"),
    calendarError: text("calendar_error"),
    confirmationEmailSentAt: timestamp("confirmation_email_sent_at", { withTimezone: true }),
    cancellationReason: text("cancellation_reason"),
    locale: varchar("locale", { length: 5 }).notNull().default("en"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("vopd_bookings_reference_key").on(table.reference),
    index("vopd_bookings_slot_idx").on(table.slotStart),
    index("vopd_bookings_status_idx").on(table.status),
  ]
);

export type VopdBooking = typeof vopdBookings.$inferSelect;
export type NewVopdBooking = typeof vopdBookings.$inferInsert;

export const vopdAuditLog = pgTable(
  "vopd_audit_log",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 24 }).notNull(),
    action: varchar("action", { length: 60 }).notNull(),
    fromStatus: varchar("from_status", { length: 40 }),
    toStatus: varchar("to_status", { length: 40 }),
    actor: varchar("actor", { length: 120 }).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("vopd_audit_reference_idx").on(table.reference)]
);

export const vopdBlockedSlots = pgTable(
  "vopd_blocked_slots",
  {
    id: serial("id").primaryKey(),
    blockedDate: date("blocked_date").notNull(),
    slotStart: timestamp("slot_start", { withTimezone: true }),
    reason: varchar("reason", { length: 200 }),
    createdBy: varchar("created_by", { length: 120 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("vopd_blocked_date_idx").on(table.blockedDate)]
);

// Binary column for optional payment screenshots. Kept in a separate table so
// booking list queries never load image bytes.
const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType: () => "bytea",
});

export const vopdPaymentScreenshots = pgTable("vopd_payment_screenshots", {
  reference: varchar("reference", { length: 24 }).primaryKey(),
  mimeType: varchar("mime_type", { length: 80 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  data: bytea("data").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Custom consultation plans added by the clinic administrator. Active rows
 *  automatically merge into the VOPD Consultation Plan step, the OPD enquiry
 *  dropdown, and (when showOnPricing is true) the homepage Consultation Plans section. */
export const vopdConsultationPlans = pgTable(
  "vopd_consultation_plans",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 40 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    subtitle: varchar("subtitle", { length: 120 }),
    period: varchar("period", { length: 80 }),
    description: text("description").notNull(),
    featuresJson: text("features_json").notNull().default("[]"),
    amountMinorInr: integer("amount_minor_inr"),
    strikeMinorInr: integer("strike_minor_inr"),
    amountMinorUsd: integer("amount_minor_usd"),
    strikeMinorUsd: integer("strike_minor_usd"),
    durationMinutes: integer("duration_minutes").notNull().default(30),
    followUpCount: integer("follow_up_count").notNull().default(0),
    followUpMinutes: integer("follow_up_minutes").notNull().default(0),
    requiresPayment: boolean("requires_payment").notNull().default(true),
    showOnPricing: boolean("show_on_pricing").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(50),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("vopd_consultation_plans_slug_key").on(table.slug),
    index("vopd_consultation_plans_active_idx").on(table.active, table.sortOrder),
  ]
);

export type VopdConsultationPlanRow = typeof vopdConsultationPlans.$inferSelect;
export type NewVopdConsultationPlanRow = typeof vopdConsultationPlans.$inferInsert;

/** Optional per-weekday overrides. Missing rows use the established Mon–Sat
 *  10–14 and 17–20 schedule, Sunday closed. Times are clinic-local HH:mm. */
export const vopdWeeklyAvailability = pgTable("vopd_weekly_availability", {
  weekday: integer("weekday").primaryKey(), // 0 = Sunday
  closed: boolean("closed").notNull().default(false),
  sessionsJson: text("sessions_json").notNull().default("[]"),
  breaksJson: text("breaks_json").notNull().default("[]"),
  intervalMinutes: integer("interval_minutes").notNull().default(30),
  updatedBy: varchar("updated_by", { length: 120 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** A closed date (holiday) or a one-day replacement schedule. Existing
 *  vopd_blocked_slots remain effective and are never removed by this table. */
export const vopdDateAvailability = pgTable("vopd_date_availability", {
  date: date("date").primaryKey(),
  closed: boolean("closed").notNull().default(false),
  sessionsJson: text("sessions_json").notNull().default("[]"),
  breaksJson: text("breaks_json").notNull().default("[]"),
  intervalMinutes: integer("interval_minutes").notNull().default(30),
  reason: varchar("reason", { length: 200 }),
  updatedBy: varchar("updated_by", { length: 120 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Editable copy only. Verified credentials remain in the existing code and
 *  registration number is never editable via the content API. */
export const doctorProfileTranslations = pgTable("doctor_profile_translations", {
  language: varchar("language", { length: 5 }).primaryKey(),
  introduction: text("introduction").notNull(),
  careParagraphsJson: text("care_paragraphs_json").notNull(),
  updatedBy: varchar("updated_by", { length: 120 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
