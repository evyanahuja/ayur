"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShieldAlert, UserCheck, CalendarCheck, Phone, MapPin } from "lucide-react";
import {
  REVIEW_DATE,
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_HREF,
  CLINIC_WHATSAPP,
} from "@/seo/config";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePagesDict } from "@/i18n/pagesDictionary";

/* ---------- Sync browser tab <title> dynamically when visitor switches language ---------- */
export function LanguageTitleSync({ title }: { title: string }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  return null;
}

/* ---------- Breadcrumbs ---------- */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-forest-800/60">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={`${it.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />}
            {it.href ? (
              <Link href={it.href} className="hover:text-forest-900 hover:underline underline-offset-4">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-forest-950 font-medium">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Author / Medical Reviewer Credential Box ---------- */
export function AuthorBox({ date = REVIEW_DATE }: { date?: string }) {
  const { lang, t } = useLanguage();
  const p = usePagesDict(lang);

  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-saffron-500/25 bg-cream-100 p-4 sm:p-5">
      <span className="grid place-items-center w-10 h-10 rounded-full bg-forest-950 text-saffron-300 shrink-0 mt-0.5">
        <UserCheck className="w-5 h-5" />
      </span>
      <div className="text-[13.5px] leading-relaxed">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <Link href="/about-doctor" className="font-semibold text-forest-950 hover:text-saffron-700 hover:underline underline-offset-4">
            {t.site.doctorName}
          </Link>
          <span className="inline-flex items-center rounded-full bg-forest-950/90 text-cream-50 px-2.5 py-0.5 text-[11px] font-medium">
            {p.seoBlocks.regLabel}
          </span>
        </p>
        <p className="mt-1 text-forest-800/80 text-[12.5px]">{p.seoBlocks.pgLine}</p>
        <p className="text-forest-800/80 text-[12.5px]">{p.seoBlocks.ugLine}</p>
        <p className="mt-1 text-forest-800/65 text-[12px]">
          {p.seoBlocks.reviewerRole} • {p.seoBlocks.reviewedOn}: {date}
        </p>
        <p className="mt-1 text-forest-800/60 text-[12px]">{p.seoBlocks.authorNote}</p>
      </div>
    </div>
  );
}

/* ---------- Medical Disclaimer ---------- */
export function MedicalDisclaimer() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);

  return (
    <div className="rounded-2xl border border-forest-900/10 bg-forest-50 p-4 flex gap-3" role="note" aria-label={p.seoBlocks.disclaimerStrong}>
      <ShieldAlert className="w-5 h-5 shrink-0 text-saffron-700 mt-0.5" />
      <p className="text-[13px] leading-relaxed text-forest-900/75">
        <strong className="font-semibold text-forest-950">{p.seoBlocks.disclaimerStrong}</strong> {p.seoBlocks.disclaimerBody}
      </p>
    </div>
  );
}

/* ---------- CTA Band ---------- */
export function CtaBand({
  title,
  body,
  whatsappMsg,
}: {
  title?: string;
  body?: string;
  whatsappMsg?: string;
}) {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);

  const resolvedTitle = title ?? p.seoBlocks.ctaTitle;
  const resolvedBody = body ?? p.seoBlocks.ctaBody;
  const resolvedWhatsapp = whatsappMsg ?? p.seoBlocks.ctaWhatsappMsg;

  return (
    <div className="rounded-3xl bg-forest-950 text-cream-50 p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-saffron-500/20 blur-[80px]" aria-hidden />
      <h2 className="font-display text-2xl sm:text-[28px] leading-tight relative">{resolvedTitle}</h2>
      <p className="mt-2 text-cream-100/75 text-[14.5px] max-w-2xl relative">{resolvedBody}</p>
      <div className="mt-5 flex flex-wrap gap-3 relative">
        <Link
          href="/contact"
          className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 text-forest-950 font-semibold px-6 py-3 text-[14px]"
        >
          <CalendarCheck className="w-4 h-4" /> {p.seoBlocks.ctaBook}
        </Link>
        <a
          href={`tel:${CLINIC_PHONE_HREF}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[14px] font-medium hover:bg-white/10"
        >
          <Phone className="w-4 h-4" /> {CLINIC_PHONE_DISPLAY}
        </a>
        <a
          href={`https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(resolvedWhatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[14px] font-medium hover:bg-white/10"
        >
          {p.seoBlocks.ctaWhatsapp}
        </a>
      </div>
      <p className="mt-4 text-[12.5px] text-cream-100/60 relative flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 shrink-0" /> {p.seoBlocks.ctaLocationLine}
      </p>
    </div>
  );
}
