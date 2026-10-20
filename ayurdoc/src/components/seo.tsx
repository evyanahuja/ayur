import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldAlert, UserCheck, CalendarCheck, Phone, MapPin } from "lucide-react";
import { SITE_URL, canonical, MEDICAL_REVIEWER, REVIEW_DATE, CLINIC_PHONE_DISPLAY, CLINIC_PHONE_HREF, CLINIC_WHATSAPP } from "@/seo/config";

/* ---------- Head management (title, meta, canonical, OG, JSON-LD) ---------- */
export interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  jsonLd?: object | object[];
  noindex?: boolean;
  image?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({ title, description, path, type = "website", jsonLd, noindex, image }: SeoProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertLink("canonical", canonical(path));
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type === "article" ? "article" : "website");
    upsertMeta("property", "og:url", canonical(path));
    upsertMeta("property", "og:site_name", "BalChikitsa Ayurved Clinic");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    if (image) {
      upsertMeta("property", "og:image", image.startsWith("http") ? image : `${SITE_URL}${image}`);
      upsertMeta("name", "twitter:image", image.startsWith("http") ? image : `${SITE_URL}${image}`);
    }
    // JSON-LD
    document.head.querySelectorAll('script[data-managed="seo-jsonld"]').forEach((n) => n.remove());
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      arr.forEach((obj, i) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-managed", "seo-jsonld");
        s.setAttribute("data-idx", String(i));
        s.textContent = JSON.stringify(obj);
        document.head.appendChild(s);
      });
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [title, description, path, type, noindex, image, JSON.stringify(jsonLd)]);
}

/* ---------- JSON-LD builders ---------- */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
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
    inLanguage: "en-IN",
    dateModified: REVIEW_DATE,
    author: { "@type": "Person", name: MEDICAL_REVIEWER.name, jobTitle: "BAMS, MD Kaumarbhritya (Balarog)" },
    reviewedBy: { "@type": "Person", name: MEDICAL_REVIEWER.name },
    publisher: {
      "@type": "MedicalClinic",
      name: "BalChikitsa Ayurved Clinic",
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
    name: "BalChikitsa Ayurved Clinic",
    url: SITE_URL,
    telephone: `+${CLINIC_WHATSAPP}`,
    email: "drpriyankalikhar@gmail.com",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sanchar Nagar Extension, Kanadia Road",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      postalCode: "452016",
      addressCountry: "IN",
    },
    geo: undefined,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "17:00", closes: "20:00" },
    ],
    medicalSpecialty: "Ayurvedic",
  };
}

/* ---------- Breadcrumbs ---------- */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-forest-800/60">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />}
            {it.href ? (
              <Link to={it.href} className="hover:text-forest-900 hover:underline underline-offset-4">{it.label}</Link>
            ) : (
              <span aria-current="page" className="text-forest-950 font-medium">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Author / reviewer ---------- */
export function AuthorBox({ date = REVIEW_DATE }: { date?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-saffron-500/25 bg-cream-100 p-4">
      <span className="grid place-items-center w-10 h-10 rounded-full bg-forest-950 text-saffron-300 shrink-0">
        <UserCheck className="w-5 h-5" />
      </span>
      <div className="text-[13.5px] leading-relaxed">
        <p><strong className="font-semibold text-forest-950">{MEDICAL_REVIEWER.name}</strong> <span className="text-forest-800/70">({MEDICAL_REVIEWER.credentials})</span></p>
        <p className="text-forest-800/70">{MEDICAL_REVIEWER.role} • Last medically reviewed: {date}</p>
        <p className="mt-1 text-forest-800/60 text-[12.5px]">Educational information only — not a substitute for an individual consultation, diagnosis or emergency care.</p>
      </div>
    </div>
  );
}

/* ---------- Disclaimer ---------- */
export function MedicalDisclaimer() {
  return (
    <div className="rounded-2xl border border-forest-900/10 bg-forest-50 p-4 flex gap-3" role="note" aria-label="Medical disclaimer">
      <ShieldAlert className="w-5 h-5 shrink-0 text-saffron-700 mt-0.5" />
      <p className="text-[13px] leading-relaxed text-forest-900/75">
        <strong className="font-semibold text-forest-950">Medical disclaimer:</strong> This page provides general health education and does not replace professional medical advice, diagnosis or treatment. Ayurvedic care here is complementary and coordinated with paediatric care — never stop prescribed medicines, therapy or rehabilitation without your treating doctor's guidance. In emergencies (breathing difficulty, seizures, dehydration, injury), seek immediate medical care.
      </p>
    </div>
  );
}

/* ---------- CTA band ---------- */
export function CtaBand({ title = "Not sure what your child needs?", body = "Describe the concern once — get an honest opinion on whether Ayurvedic consultation can help, and what to do first.", whatsappMsg = "Namaste Doctor Priyanka, I want guidance for my child's concern." }: { title?: string; body?: string; whatsappMsg?: string }) {
  return (
    <div className="rounded-3xl bg-forest-950 text-cream-50 p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-saffron-500/20 blur-[80px]" aria-hidden />
      <h2 className="font-display text-2xl sm:text-[28px] leading-tight relative">{title}</h2>
      <p className="mt-2 text-cream-100/75 text-[14.5px] max-w-2xl relative">{body}</p>
      <div className="mt-5 flex flex-wrap gap-3 relative">
        <Link to="/contact/" className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 text-forest-950 font-semibold px-6 py-3 text-[14px]">
          <CalendarCheck className="w-4 h-4" /> Book Appointment
        </Link>
        <a href={`tel:${CLINIC_PHONE_HREF}`} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[14px] font-medium hover:bg-white/10">
          <Phone className="w-4 h-4" /> {CLINIC_PHONE_DISPLAY}
        </a>
        <a href={`https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[14px] font-medium hover:bg-white/10">
          WhatsApp Enquiry
        </a>
      </div>
      <p className="mt-4 text-[12.5px] text-cream-100/60 relative flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Sanchar Nagar Extension, Kanadia Road, Indore • Mon–Sat 10–2 & 5–8 IST • Online across MP & India</p>
    </div>
  );
}

/* ---------- Ad placeholder (disabled by default, CLS-safe) ---------- */
export function AdSlot({ slot, label = "Advertisement" }: { slot: string; label?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest-900/15 bg-forest-50/60 min-h-[90px] grid place-items-center text-center px-4 py-4" role="complementary" aria-label={`${label} placeholder — disabled`}>
      <p className="text-[11.5px] tracking-wide uppercase text-forest-800/45 font-semibold">{label} • {slot} • Off until AdSense approved (no fake ads)</p>
    </div>
  );
}
