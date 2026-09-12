// Patient inquiry schema for Dr. Priyanka Likhar landing page
import { pgTable, serial, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const concernEnum = pgEnum("concern_category", [
  "skin",
  "neurodevelopmental",
  "growth",
  "respiratory",
  "allergy_immunity",
  "lifestyle",
  "general",
  "other",
]);

export const modeEnum = pgEnum("consult_mode", ["online", "in_clinic"]);
export const statusEnum = pgEnum("inquiry_status", ["new", "contacted", "booked", "closed"]);

export const patientInquiries = pgTable("patient_inquiries", {
  id: serial("id").primaryKey(),
  parentName: varchar("parent_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 160 }),
  childName: varchar("child_name", { length: 120 }).notNull(),
  childAge: varchar("child_age", { length: 20 }).notNull(),
  childGender: varchar("child_gender", { length: 20 }),
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
