/* Central SEO + business configuration.
   Everything the templates, sitemap, robots and JSON-LD need lives here.
   Verified values come from src/content/site.ts. Anything marked
   NEEDS_OWNER must be supplied by the clinic owner (see /owner-checklist). */

export const SITE_URL = "https://ayurveddoctor.netlify.app";
export const SITE_NAME = "BalChikitsa Ayurved Clinic";
export const DOCTOR_NAME = "Dr. Priyanka Likhar";
export const DOCTOR_CREDS = "BAMS, MD Kaumarbhritya (Balarog)";
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

/* Owner must verify / supply these — rendered as editable placeholders, never invented */
export const NEEDS_OWNER = {
  registrationNumber: "NEEDS_OWNER: State Ayurvedic Council registration number + year",
  registrationCouncil: "NEEDS_OWNER: e.g. Madhya Pradesh Ayurvedic Evam Unani Chikitsa Paddhati Evam Prakritik Chikitsa Board",
  clinicGeo: "NEEDS_OWNER: exact clinic latitude,longitude from Google Maps pin",
  onlineConsultAvailable: "NEEDS_OWNER: confirm online video consultation is offered (assumed YES from existing site copy)",
  suvarnaprashanDetails: "NEEDS_OWNER: exact Suvarnaprashan formulation, preparation method, quality controls, price",
  panchakarmaOffered: "NEEDS_OWNER: confirm which Panchakarma therapies are actually offered in-clinic (Abhyanga? Shirodhara? Basti? Nasya?)",
  awards: "NEEDS_OWNER: any awards/affiliations — do not publish until verified",
} as const;

export const HOURS_SPEC = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "14:00" },
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "17:00", closes: "20:00" },
];

export const SOCIALS = {
  instagram: "https://www.instagram.com/ayurvedoctor",
  facebook: "",
  youtube: "",
};

/* Advertising: centrally managed, OFF by default. No fake IDs. */
export const ADS_CONFIG = {
  enabled: false,
  provider: "adsense" as const,
  publisherId: "", // e.g. "ca-pub-XXXXXXXXXXXXXXXX" — only when approved
  slots: {
    inArticle: "",
    sidebar: "",
    belowHero: "",
  },
};

export const MEDICAL_REVIEWER = {
  name: DOCTOR_NAME,
  credentials: DOCTOR_CREDS,
  role: "Author & medical reviewer",
};

export const REVIEW_DATE = "2026-10-15";

export function canonical(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const clean = p === "/" ? "/" : p.endsWith("/") ? p : `${p}/`;
  return `${SITE_URL}${clean}`;
}

export function waLink(message: string) {
  return `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
