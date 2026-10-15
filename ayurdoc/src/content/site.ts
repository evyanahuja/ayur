/* Stand-in for ayurdoc/src/content/site.ts — only what this demo needs. */

export const SITE = {
  doctorName: "Dr. Priyanka Likhar",
  shortCreds: "MD Kaumarbhritya • BAMS",
  clinicName: "BalChikitsa Ayurveda",
  phoneDisplay: "+91 98765 43210",
  phoneHref: "+919876543210",
  whatsapp: "919876543210",
  whatsappMessage:
    "Namaste Doctor, I would like to book a consultation for my child.",
  email: "care@balchikitsa.in",
  languages: "English • हिंदी • मराठी",
  hours: "Mon–Sat · 10:00 AM – 7:00 PM IST",
} as const;

export const telLink = `tel:${SITE.phoneHref}`;

export function waLink(message: string = SITE.whatsappMessage) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: "Audit", href: "#seo-audit" },
  { label: "Plan", href: "#seo-steps" },
  { label: "SEO patches", href: "#seo-patches" },
  { label: "CTA fix", href: "#changelog" },
  { label: "Demo", href: "#book" },
];

export const COPY = {
  nav: {
    call: "Call Now",
    book: "Book Consultation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  floating: {
    chatTooltip: "Chat on WhatsApp",
    chatAria: "Chat with the clinic on WhatsApp",
    /* NEW strings */
    bookTooltip: "Book a consultation",
    bookAria: "Book a consultation with Dr. Priyanka",
    backToTop: "Back to top",
    bookBtn: "Book Consultation",
  },
  book: {
    eyebrow: "Consultations",
    title: "Book your child's consultation",
    sub: "Share a few details and the clinic confirms your slot on WhatsApp within a few hours.",
  },
} as const;
