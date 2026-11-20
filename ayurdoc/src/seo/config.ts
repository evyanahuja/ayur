/* Central SEO + clinic & practitioner configuration and JSON-LD helpers. */
import { SITE } from "@/content/site";
import { CLINIC_LOCATION, CLINIC_DIRECTIONS_URL, CLINIC_MAP_EMBED_URL as MAP_EMBED_URL } from "@/content/clinicLocation";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ayurveddoctor.netlify.app"
).replace(/\/+$/, "");
export const SITE_NAME = "Prakriti Ayurveda Clinic";
export const DOCTOR_NAME = "Dr. Priyanka Likhar";
export const DOCTOR_REG_NO = SITE.registrationNumber;
export const DOCTOR_REG_AUTHORITY = SITE.registrationAuthority;
export const DOCTOR_CREDS = "BAMS, MD (Ayurvedic Pediatrician — Kaumarbhritya) • Reg. No. 63934";
export const DOCTOR_PG_DEGREE = "MD — Pediatrician (Kaumarbhritya / Balarog)";
export const DOCTOR_PG_COLLEGE = "Institute of Teaching and Research in Ayurveda (ITRA)";
export const DOCTOR_UG_DEGREE = "BAMS (Bachelor of Ayurvedic Medicine & Surgery)";
export const DOCTOR_UG_COLLEGE = "Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur";

export const CLINIC_PHONE_DISPLAY = "+91 98607 75010";
export const CLINIC_PHONE_HREF = "+919860775010";
export const CLINIC_WHATSAPP = "919860775010";
export const CLINIC_EMAIL = "drpriyankalikhar@gmail.com";
export const CLINIC_ADDRESS_FULL = CLINIC_LOCATION.address;
export const CLINIC_AREA = CLINIC_LOCATION.street;
export const CLINIC_CITY = CLINIC_LOCATION.city;
export const CLINIC_STATE = CLINIC_LOCATION.region;
export const CLINIC_PIN = CLINIC_LOCATION.postalCode;
export const CLINIC_COUNTRY = CLINIC_LOCATION.country;
export const CLINIC_HOURS = "Mon–Sat • 10 AM–2 PM & 5 PM–8 PM IST";
export const CLINIC_MAPS_URL = CLINIC_DIRECTIONS_URL;
export const CLINIC_MAP_EMBED_URL = MAP_EMBED_URL;
export const DEFAULT_LOCALE = "en-IN";

export const HOURS_SPEC = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "14:00" },
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "17:00", closes: "20:00" },
];

export const SOCIALS = {
  instagram: "https://www.instagram.com/ayurvedoctor",
  facebook: "",
  youtube: "",
};

export const MEDICAL_REVIEWER = {
  name: DOCTOR_NAME,
  registrationNumber: DOCTOR_REG_NO,
  credentials: DOCTOR_CREDS,
  pgQualification: `${DOCTOR_PG_DEGREE} — ${DOCTOR_PG_COLLEGE}`,
  ugQualification: `${DOCTOR_UG_DEGREE} — ${DOCTOR_UG_COLLEGE}`,
  role: "Author & Medical Reviewer",
};

export const REVIEW_DATE = "2026-11-20";

export function canonical(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const clean = p === "/" ? "/" : p.replace(/\/+$/, "");
  return clean === "/" ? SITE_URL : `${SITE_URL}${clean}`;
}

export function waLink(message: string) {
  return `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/* ---------- Pure Server-Safe Schema.org JSON-LD Builders ---------- */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: canonical(it.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function medicalWebPageJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  about?: string;
  /* Per-page physician review date (YYYY-MM-DD). Falls back to the site-wide REVIEW_DATE. */
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "Article"],
    "@id": `${canonical(opts.path)}#page`,
    url: canonical(opts.path),
    name: opts.name,
    headline: opts.name,
    description: opts.description,
    inLanguage: ["en-IN", "hi-IN", "mr-IN", "gu-IN"],
    dateModified: opts.dateModified ?? REVIEW_DATE,
    author: {
      "@type": "Physician",
      name: MEDICAL_REVIEWER.name,
      identifier: MEDICAL_REVIEWER.registrationNumber,
      jobTitle: MEDICAL_REVIEWER.credentials,
      alumniOf: [MEDICAL_REVIEWER.pgQualification, MEDICAL_REVIEWER.ugQualification],
    },
    reviewedBy: {
      "@type": "Physician",
      name: MEDICAL_REVIEWER.name,
      identifier: MEDICAL_REVIEWER.registrationNumber,
    },
    publisher: {
      "@type": "MedicalClinic",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(opts.about ? { about: { "@type": "MedicalCondition", name: opts.about } } : {}),
  };
}

/* Website + Physician entities. The clinic (MedicalClinic) is described by localBusinessJsonLd below. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#clinic` },
  };
}

export function physicianJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE_URL}/about-doctor#physician`,
    name: DOCTOR_NAME,
    url: `${SITE_URL}/about-doctor`,
    medicalSpecialty: "Pediatric",
    identifier: { "@type": "PropertyValue", name: DOCTOR_REG_AUTHORITY, value: DOCTOR_REG_NO },
    description: DOCTOR_CREDS,
    alumniOf: [
      { "@type": "EducationalOrganization", name: DOCTOR_PG_COLLEGE },
      { "@type": "EducationalOrganization", name: DOCTOR_UG_COLLEGE },
    ],
    worksFor: { "@id": `${SITE_URL}/#clinic` },
    telephone: CLINIC_PHONE_HREF,
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#clinic`,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: CLINIC_PHONE_HREF,
    email: CLINIC_EMAIL,
    priceRange: "₹300–₹4,999",
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC_AREA,
      addressLocality: CLINIC_CITY,
      addressRegion: CLINIC_STATE,
      postalCode: CLINIC_PIN,
      addressCountry: CLINIC_COUNTRY,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "17:00", closes: "20:00" },
    ],
    medicalSpecialty: "Pediatric",
  };
}
