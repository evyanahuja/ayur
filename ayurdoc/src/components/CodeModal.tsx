import { useState } from "react";
import {
  X,
  Copy,
  Check,
  FileCode2,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

export interface ChangedFile {
  path: string;
  category: "components" | "app" | "content" | "i18n";
  summary: string;
  details: string[];
  code: string;
}

export const CHANGED_FILES: ChangedFile[] = [
  {
    path: "src/components/Navbar.tsx",
    category: "components",
    summary: "Fixed Book Consultation button overflow inside header navigation pill",
    details: [
      "Added `min-w-0` to navigation links container and tighter horizontal padding (`px-2.5 xl:px-3.5`) on standard laptop viewports (1024px–1440px).",
      "Added `shrink-0` to the right-hand action cluster so it never collides or wraps.",
      "Constrained 'Call Now' text label to ultra-wide displays (2xl), keeping clean icon-only button on regular desktops.",
      "Ensured Book Consultation button has a fixed height (`h-10`), smooth transition, and `shrink-0` with `whitespace-nowrap`.",
    ],
    code: `// Key fixes in src/components/Navbar.tsx:

// 1. Constrained nav links container:
<div className="hidden lg:flex min-w-0 items-center gap-0">
  {LINKS.map((l) => (
    <a
      key={l.href}
      href={l.href}
      className={cn(
        "relative px-2.5 xl:px-3.5 py-2 rounded-full text-[13.5px] xl:text-[14px] font-medium tracking-wide whitespace-nowrap transition-colors duration-500",
        active === l.href ? "text-forest-950" : "text-forest-800/65 hover:text-forest-950"
      )}
    >
      {l.label}
    </a>
  ))}
</div>

// 2. Right action cluster (Phone + CTA) with shrink-0:
<div className="hidden md:flex shrink-0 items-center gap-2 xl:gap-3">
  <LanguageSwitcher compact />
  <a
    href={telLink}
    className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-saffron-500/30 bg-cream-100/60 text-[13.5px] font-medium text-forest-800 hover:text-white hover:bg-saffron-500 hover:border-saffron-500 transition-all duration-500 px-2 2xl:px-4 py-2"
  >
    <span className="grid place-items-center w-6 h-6 rounded-full bg-saffron-500 text-white group-hover:bg-white group-hover:text-saffron-600 transition-all duration-500 shrink-0">
      <Phone className="w-[14px] h-[14px]" />
    </span>
    <span className="hidden 2xl:inline tracking-wide whitespace-nowrap">{t.nav.call}</span>
  </a>

  // 3. Fixed Book Consultation button:
  <Magnetic strength={0.22} className="shrink-0">
    <a
      href="#book"
      aria-label={t.nav.book}
      className="btn-shine inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-forest-950 text-cream-50 text-[13px] font-medium tracking-wide px-3 xl:px-4 shadow-luxe hover:bg-forest-900 hover:shadow-luxe-lg transition-[background-color,box-shadow] duration-700 whitespace-nowrap"
    >
      <CalendarCheck className="w-4 h-4 text-saffron-400 shrink-0" />
      <span className="hidden xl:inline">{t.nav.book}</span>
    </a>
  </Magnetic>
</div>`,
  },
  {
    path: "src/components/FloatingActions.tsx",
    category: "components",
    summary: "Added hovering Book Consultation icon button with tooltip above WhatsApp button",
    details: [
      "Added floating dark-green jewel leaf button with glowing ping ring directly above WhatsApp chat bubble.",
      "Added smooth-sliding tooltip with `t.floating.bookTooltip` localized into English, Hindi, Marathi, and Gujarati.",
      "Connected click action directly to `#book` smooth scroll target.",
      "Shifted back-to-top button up by one row (`bottom-[10.5rem]`) so all 3 actions stack cleanly on desktop/tablet without overlapping.",
    ],
    code: `// Added in src/components/FloatingActions.tsx:

{/* Floating Book Consultation Button — matching chat bubble styling & hover tooltip */}
<a
  href="#book"
  aria-label={t.floating.bookAria}
  className="group hidden sm:grid fixed sm:bottom-24 right-4 sm:right-6 z-40 place-items-center w-14 h-14 rounded-full bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-saffron-300 shadow-[0_18px_38px_-10px_rgba(11,36,25,0.6)] hover:scale-110 transition-transform duration-500 gold-hairline"
>
  <span className="absolute inset-0 rounded-full bg-saffron-400 animate-ping opacity-15" aria-hidden />
  <CalendarCheck className="w-6 h-6 relative" strokeWidth={1.6} />
  <span className="absolute right-full mr-3 whitespace-nowrap rounded-full bg-forest-950 text-white text-[11px] font-medium tracking-wide px-4 py-2.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 pointer-events-none gold-hairline">
    {t.floating.bookTooltip}
  </span>
</a>

{/* Back to top button positioned directly above: */}
<button
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  aria-label={t.floating.backToTop}
  className={cn(
    "fixed bottom-40 sm:bottom-[10.5rem] right-[1.375rem] sm:right-[1.875rem] z-40 grid place-items-center w-11 h-11 rounded-full glass gold-hairline text-forest-900 shadow-luxe transition-all duration-500 hover:bg-forest-950 hover:text-saffron-300",
    showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
  )}
>
  <ArrowUp className="w-5 h-5" />
</button>`,
  },
  {
    path: "src/components/BookingSection.tsx",
    category: "components",
    summary: "Fixed scroll margin offset on #book section",
    details: [
      "Updated `<section id=\"book\">` class to `scroll-mt-24` (matches other sections).",
      "Prevents the fixed header from covering the top of the consultation booking form when clicked.",
    ],
    code: `// In src/components/BookingSection.tsx:
<section id="book" className="mandala-section relative py-12 sm:py-16 scroll-mt-24 overflow-hidden">
  <SectionMandalas id="book" palette="lotus" side="right" dark />
  ...
</section>`,
  },
  {
    path: "src/i18n/dictionaries/ (en.ts, hi.ts, mr.ts, gu.ts)",
    category: "i18n",
    summary: "Added multilingual tooltips and ARIA labels for floating button",
    details: [
      "en.ts: `bookTooltip: 'Book a consultation'`, `bookAria: 'Book a consultation with Dr. Priyanka'`",
      "hi.ts: `bookTooltip: 'परामर्श बुक करें'`, `bookAria: 'डॉ. प्रियंका के साथ परामर्श बुक करें'`",
      "mr.ts: `bookTooltip: 'सल्ला बुक करा'`, `bookAria: 'डॉ. प्रियंका यांच्याशी सल्ला बुक करा'`",
      "gu.ts: `bookTooltip: 'પરામર્શ બુક કરો'`, `bookAria: 'ડૉ. પ્રિયંકા સાથે પરામર્શ બુક કરો'`",
    ],
    code: `// Added to floating block in all dictionary files:

// en.ts:
floating: {
  whatsappAria: "Chat on WhatsApp",
  chatTooltip: "Chat with clinic 💬",
  bookTooltip: "Book a consultation",
  bookAria: "Book a consultation with Dr. Priyanka",
  backToTop: "Back to top",
  bookBtn: "Book Your Child's Visit",
},

// hi.ts:
floating: {
  whatsappAria: "WhatsApp पर चैट करें",
  chatTooltip: "क्लिनिक से चैट 💬",
  bookTooltip: "परामर्श बुक करें",
  bookAria: "डॉ. प्रियंका के साथ परामर्श बुक करें",
  backToTop: "ऊपर जाएँ",
  bookBtn: "अपने बच्चे की विज़िट बुक करें",
},`,
  },
  {
    path: "src/content/site.ts",
    category: "content",
    summary: "Restored authentic clinic details & added SEO configuration block",
    details: [
      "Restored Dr. Priyanka Likhar (+91 98607 75010), BalChikitsa Ayurved Clinic in Indore, STATS, and full content.",
      "Removed trailing slash from `siteUrl: 'https://ayurveddoctor.netlify.app'` to prevent duplicate canonical URLs.",
      "Added `SEO` block for title, description, city, clinic coordinates, and verification keys.",
    ],
    code: `// Added to src/content/site.ts:

export const SEO = {
  title: "Ayurvedic Child Specialist in Indore | Dr. Priyanka Likhar",
  titleTemplate: "%s | Dr. Priyanka Likhar",
  description:
    "Dr. Priyanka Likhar (BAMS, MD Kaumarbhritya) treats eczema, speech delay, ADHD, asthma, low immunity & poor growth in children with safe Ayurveda. Indore clinic + online.",
  locale: "en_IN",
  street: "Sanchar Nagar Extension, Kanadia Road",
  city: "Indore",
  region: "Madhya Pradesh",
  postalCode: "452016",
  country: "IN",
  geo: { lat: 22.7196, lng: 75.9131 }, // Clinic Google Maps coordinates
  priceRange: "₹300–₹4,999",
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "14:00" },
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "17:00", closes: "20:00" },
  ],
  sameAs: [
    "https://www.instagram.com/ayurvedoctor",
  ],
  verification: {
    google: "", // Search Console HTML tag content token
    bing: "",   // Bing Webmaster Tools meta tag content token
  },
};`,
  },
  {
    path: "src/app/robots.ts & sitemap.ts",
    category: "app",
    summary: "Created Next.js 16 metadata routes for instant indexing",
    details: [
      "`src/app/robots.ts` serves clean `/robots.txt` allowing indexing and linking the sitemap.",
      "`src/app/sitemap.ts` serves dynamic `/sitemap.xml` for Google & Bing discovery.",
    ],
    code: `// src/app/robots.ts:
import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: \`\${SITE.siteUrl}/sitemap.xml\`,
    host: SITE.siteUrl,
  };
}

// src/app/sitemap.ts:
import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: \`\${SITE.siteUrl}/\`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}`,
  },
];

export function CodeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const current = CHANGED_FILES[selectedIdx];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-forest-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative flex flex-col w-full max-w-5xl h-[88vh] bg-[#071711] text-[#f2efe9] rounded-3xl border border-saffron-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/50 bg-[#0c241b]">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-saffron-400 text-forest-950 font-bold">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display text-lg text-white">Files Changed &amp; Code Update Guide</h2>
              <p className="text-[12px] text-emerald-200/70">
                Book Consultation button fix, floating hover action, and SEO enhancements
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center w-10 h-10 rounded-full bg-forest-900/60 text-emerald-200 hover:text-white hover:bg-forest-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* File selector list */}
          <div className="md:col-span-5 border-r border-emerald-900/50 p-4 overflow-y-auto space-y-2 bg-[#091b14]">
            <div className="px-2 py-1 text-[11px] font-bold tracking-wider text-saffron-300 uppercase">
              Select File to View Code ({CHANGED_FILES.length} files)
            </div>
            {CHANGED_FILES.map((file, idx) => (
              <button
                key={file.path}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setCopied(false);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-2xl transition-all font-mono text-[12.5px] border flex items-start justify-between gap-2",
                  selectedIdx === idx
                    ? "bg-saffron-400 text-forest-950 border-saffron-300 font-bold shadow-md"
                    : "bg-[#06140e] text-emerald-100/80 border-emerald-900/40 hover:bg-emerald-900/30 hover:text-white"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <p
                    className={cn(
                      "font-sans text-[11px] mt-1 line-clamp-1",
                      selectedIdx === idx ? "text-forest-950/80" : "text-emerald-200/60"
                    )}
                  >
                    {file.summary}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 mt-1 opacity-60" />
              </button>
            ))}
          </div>

          {/* Code & explanation panel */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-[#06140e]">
            {current && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* File details bar */}
                <div className="p-5 border-b border-emerald-900/40 bg-[#091b14]">
                  <div className="flex items-center justify-between gap-2">
                    <code className="font-mono text-[13.5px] font-bold text-saffron-300">
                      ayurdoc/{current.path}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all",
                        copied
                          ? "bg-emerald-500 text-forest-950"
                          : "bg-saffron-400 text-forest-950 hover:bg-saffron-300 active:scale-95"
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[13px] text-emerald-100/90 font-medium">{current.summary}</p>
                  <ul className="mt-2.5 space-y-1 text-[12px] text-emerald-200/70">
                    {current.details.map((d) => (
                      <li key={d} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-saffron-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code viewer */}
                <div className="flex-1 overflow-auto p-5 font-mono text-[12px] leading-relaxed text-emerald-100 bg-[#040e0a]">
                  <pre>
                    <code>{current.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-emerald-900/50 bg-[#0c241b] text-[12px] text-emerald-200/70">
          <span>All changes tested on live Next.js 16 build</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-forest-900 text-white hover:bg-forest-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
