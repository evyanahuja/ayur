/* Central SEO + verified clinic & practitioner configuration + pure JSON-LD helpers.
   Pure TypeScript module (safe in both Server Components and Client Components). */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ayurveddoctor.netlify.app"
).replace(/\/+$/, "");
export const SITE_NAME = "BalChikitsa Ayurved Clinic";
export const DOCTOR_NAME = "Dr. Priyanka Likhar";
export const DOCTOR_REG_NO = "63934";
export const DOCTOR_CREDS = "BAMS, MD (Ayurvedic Pediatrician — Kaumarbhritya) • Reg. No. 63934";
export const DOCTOR_PG_DEGREE = "MD — Pediatrician (Kaumarbhritya / Balarog)";
export const DOCTOR_PG_COLLEGE = "Institute of Teaching and Research in Ayurveda (ITRA)";
export const DOCTOR_UG_DEGREE = "BAMS (Bachelor of Ayurvedic Medicine & Surgery)";
export const DOCTOR_UG_COLLEGE = "Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur";

export const CLINIC_PHONE_DISPLAY = "+91 98607 75010";
export const CLINIC_PHONE_HREF = "+919860775010";
export const CLINIC_WHATSAPP = "919860775010";
export const CLINIC_EMAIL = "drpriyankalikhar@gmail.com";
export const CLINIC_ADDRESS_FULL = "Sanchar Nagar Extension, Kanadia Road, Indore, Madhya Pradesh 452016";
export const CLINIC_AREA = "Sanchar Nagar Extension, Kanadia Road";
export const CLINIC_CITY = "Indore";
export const CLINIC_STATE = "Madhya Pradesh";
export const CLINIC_PIN = "452016";
export const CLINIC_COUNTRY = "IN";
export const CLINIC_HOURS = "Mon–Sat • 10 AM–2 PM & 5 PM–8 PM IST";
export const CLINIC_MAPS_URL = "https://maps.app.goo.gl/vhRYqg63chcGXLrr6";
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

export const REVIEW_DATE = "2026-04-15";

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

export function medicalWebPageJsonLd(opts: { path: string; name: string; description: string; about?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "Article"],
    "@id": `${canonical(opts.path)}#page`,
    url: canonical(opts.path),
    name: opts.name,
    headline: opts.name,
    description: opts.description,
    inLanguage: ["en-IN", "hi-IN", "mr-IN", "gu-IN"],
    dateModified: REVIEW_DATE,
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
