/* Reusable conversion + content blocks used across disease, treatment and category pages.
   Server-compatible (no hooks, no client state) so they render fully in the initial HTML. */
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  Flower2,
  HeartPulse,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  User,
  UserCheck,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIconKey } from "@/content/categories";
import {
  CLINIC_ADDRESS_FULL,
  CLINIC_HOURS,
  CLINIC_MAPS_URL,
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_HREF,
  DOCTOR_NAME,
  DOCTOR_REG_NO,
  waLink,
} from "@/seo/config";

export const CATEGORY_ICONS: Record<CategoryIconKey, LucideIcon> = {
  baby: Baby,
  sparkles: Sparkles,
  leaf: Leaf,
  wind: Wind,
  brain: Brain,
  bone: Bone,
  flower: Flower2,
  user: User,
  activity: Activity,
  heart: HeartPulse,
};

const DEFAULT_CTA_TITLE = "Don't Ignore Your Health Concerns. Get an Individualised Assessment.";
const DEFAULT_CTA_BODY =
  "Consult Dr. Priyanka Likhar at BalChikitsa Ayurved Clinic, Indore, to discuss your health concerns and explore suitable treatment options.";

/* Appointment call-to-action: Book Appointment, Call Clinic, WhatsApp Enquiry, Get Directions + address. */
export function AppointmentCta({
  compact = false,
  title = DEFAULT_CTA_TITLE,
  body = DEFAULT_CTA_BODY,
  whatsappMessage = "Namaste Dr. Priyanka, I would like to enquire about an Ayurvedic consultation.",
}: {
  compact?: boolean;
  title?: string;
  body?: string;
  whatsappMessage?: string;
}) {
  return (
    <section
      aria-label="Book an Ayurvedic consultation"
      className={`relative overflow-hidden rounded-3xl bg-forest-950 text-cream-50 ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8"}`}
    >
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-saffron-500/20 blur-[80px]" aria-hidden />
      <div className="relative">
        <h2 className={`font-display leading-tight ${compact ? "text-[22px] sm:text-[24px]" : "text-2xl sm:text-[28px]"}`}>
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-cream-100/75">{body}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 px-6 py-3 text-[14px] font-semibold text-forest-950"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden /> Book Appointment
          </Link>
          <a
            href={`tel:${CLINIC_PHONE_HREF}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[14px] font-medium hover:bg-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden /> Call Clinic {CLINIC_PHONE_DISPLAY}
          </a>
          <a
            href={waLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[14px] font-medium hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp Enquiry
          </a>
          <a
            href={CLINIC_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[14px] font-medium hover:bg-white/10"
          >
            <MapPin className="h-4 w-4" aria-hidden /> Get Directions
          </a>
        </div>
        <p className="mt-4 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-cream-100/60">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            {CLINIC_ADDRESS_FULL} • {CLINIC_HOURS}
          </span>
        </p>
      </div>
    </section>
  );
}

/* "Looking for an Ayurvedic Consultation?" — doctor introduction limited to verified qualifications. */
export function DoctorHelp() {
  return (
    <section aria-labelledby="doctor-help-h" className="rounded-3xl border border-saffron-500/25 bg-cream-100 p-6 sm:p-8">
      <p className="eyebrow text-saffron-700">About your consultation</p>
      <h2 id="doctor-help-h" className="mt-2 font-display text-[26px] leading-tight text-forest-950">
        Looking for an Ayurvedic Consultation?
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-forest-900/80">
        Every individual experiences health problems differently. {DOCTOR_NAME} assesses the patient&apos;s symptoms,
        health history, lifestyle and individual constitution to understand the condition and discuss appropriate
        treatment options.
      </p>
      <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-forest-900/80">
        <li className="flex items-start gap-2.5">
          <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden />
          <span>BAMS — Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur</span>
        </li>
        <li className="flex items-start gap-2.5">
          <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden />
          <span>MD (Kaumarbhritya / Pediatrics) — Institute of Teaching and Research in Ayurveda (ITRA)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden />
          <span>Registration No. {DOCTOR_REG_NO}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden />
          <span>Clinical areas: Ayurvedic pediatrics, Panchakarma, skin conditions and general health</span>
        </li>
      </ul>
      <p className="mt-4 text-[13px] leading-relaxed text-forest-800/70">
        A consultation is an assessment and discussion, not an emergency service. If you have any warning sign described
        on this page, seek urgent medical care first.
      </p>
      <Link
        href="/about-doctor"
        className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-saffron-700 hover:text-forest-950"
      >
        Read Dr. Priyanka Likhar&apos;s profile <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </section>
  );
}

/* "On this page" navigation for longer guides. Plain anchor links, crawlable and keyboard friendly. */
export function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="rounded-2xl border border-forest-900/10 bg-white p-4 sm:p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-700">On this page</p>
      <ol className="mt-3 grid gap-1 text-[14px] sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block rounded-lg px-2 py-1.5 text-forest-900/80 hover:bg-forest-50 hover:text-forest-950"
            >
              <span className="mr-2 text-saffron-700">{index + 1}.</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* Shown on guides that have not yet been approved by the physician (status "draft"). */
export function DraftNotice() {
  return (
    <div role="status" className="rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-[13.5px] leading-relaxed text-amber-900">
      <strong className="font-semibold">Draft for physician review.</strong> This guide has not yet been approved by Dr.
      Priyanka Likhar. It is not indexed by search engines and should not be relied on as medical advice until it has
      been reviewed.
    </div>
  );
}
