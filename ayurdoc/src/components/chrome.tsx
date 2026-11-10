"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, Phone, CalendarCheck, ChevronDown, MapPin, Mail, Clock, Heart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE, telLink } from "@/content/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SocialLinks } from "./SocialLinks";
import { SectionMandalas } from "./ScrollMandala";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePagesDict } from "@/i18n/pagesDictionary";
import { trText } from "@/i18n/contentTranslations";
import { formatCount } from "@/i18n";

const ALL_CONDITIONS = [...CONDITIONS_1, ...CONDITIONS_2];

function useScrolled() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return s;
}

export function SiteHeader() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [headerBottom, setHeaderBottom] = useState(88);
  const pathname = usePathname() || "/";
  const { lang, t } = useLanguage();
  const p = usePagesDict(lang);

  useEffect(() => {
    setOpen(false);
    setDrop(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () => setHeaderBottom(Math.ceil(header.getBoundingClientRect().bottom));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || document.querySelector("[data-language-dialog]")) return;
      setOpen(false);
      setDrop(null);
      if (open) menuButtonRef.current?.focus();
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const isExact = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname === href.replace(/\/$/, "");

  const navClass = (active: boolean) =>
    cn(
      "px-1.5 xl:px-2.5 2xl:px-3.5 py-2 rounded-full text-[11.5px] xl:text-[12.5px] 2xl:text-[13.5px] font-medium tracking-wide transition-colors whitespace-nowrap",
      active ? "text-forest-950 bg-forest-950/5" : "text-forest-800/75 hover:text-forest-950 hover:bg-forest-950/5"
    );

  return (
    <header ref={headerRef} className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", scrolled ? "py-2" : "py-3 sm:py-4")}>
      <div className="mx-auto max-w-[1380px] px-3 sm:px-6">
        <nav
          aria-label={t.nav.primaryNav}
          className={cn(
            "relative z-50 flex min-w-0 items-center justify-between gap-2 rounded-3xl lg:rounded-full border border-saffron-500/15 bg-cream-50/95 px-2.5 sm:px-4 backdrop-blur-xl transition-all duration-500",
            scrolled ? "shadow-luxe py-2" : "py-2.5 shadow-sm"
          )}
        >
          <Link href="/" className="group flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5 lg:flex-none lg:max-w-[156px] xl:max-w-[205px] 2xl:max-w-none" aria-label={`${t.site.doctorName} — ${p.header.homeAria}`}>
            <span className="relative grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-saffron-300 shadow shrink-0 group-hover:scale-105 transition-transform">
              <Leaf className="w-[17px] h-[17px]" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-[15px] sm:text-[16.5px] lg:text-[13.5px] xl:text-[15px] 2xl:text-[16.5px] text-forest-950 truncate">{t.site.doctorName}</span>
              <span className="block text-[8.5px] sm:text-[9px] font-semibold tracking-[0.13em] text-saffron-700 uppercase truncate">
                {t.site.shortCreds} • {p.header.indoreTag}
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex min-w-0 items-center gap-0.5">
            <Link href="/" className={navClass(isExact("/"))}>
              {p.header.home}
            </Link>
            <Link href="/about-doctor" className={navClass(pathname.startsWith("/about-doctor"))}>
              {p.header.doctor}
            </Link>
            <div className="relative" onMouseEnter={() => setDrop("cond")} onMouseLeave={() => setDrop(null)}>
              <Link
                href="/conditions"
                className={cn(navClass(pathname.startsWith("/conditions")), "flex items-center gap-1")}
              >
                {p.header.conditions} <ChevronDown className="w-3 h-3" />
              </Link>
              {drop === "cond" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[560px]">
                  <div className="rounded-2xl border border-forest-900/10 bg-white shadow-luxe-lg p-4 grid grid-cols-2 gap-1 max-h-[420px] overflow-auto">
                    {ALL_CONDITIONS.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/conditions/${c.slug}`}
                        className="rounded-xl px-3 py-2 text-[13px] text-forest-900/80 hover:bg-forest-50 hover:text-forest-950"
                      >
                        <span className="block font-medium">{trText(c.title, lang)}</span>
                        <span className="block text-[11px] text-forest-800/50">{p.categories[c.category] ?? c.category}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" onMouseEnter={() => setDrop("treat")} onMouseLeave={() => setDrop(null)}>
              <Link
                href="/treatments"
                className={cn(navClass(pathname.startsWith("/treatments") || pathname.startsWith("/services")), "flex items-center gap-1")}
              >
                {p.header.treatments} <ChevronDown className="w-3 h-3" />
              </Link>
              {drop === "treat" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[480px]">
                  <div className="rounded-2xl border border-forest-900/10 bg-white shadow-luxe-lg p-4 grid grid-cols-2 gap-1 max-h-[420px] overflow-auto">
                    {TREATMENTS.map((tr) => (
                      <Link
                        key={tr.slug}
                        href={`/${tr.base}/${tr.slug}`}
                        className="rounded-xl px-3 py-2 text-[13px] hover:bg-forest-50"
                      >
                        <span className="block font-medium text-forest-950">{trText(tr.title, lang)}</span>
                        <span className="block text-[11px] text-forest-800/50">{p.categories[tr.category] ?? tr.category}</span>
                      </Link>
                    ))}
                    <Link href="/treatments" onClick={() => setDrop(null)} className="col-span-2 mt-2 border-t border-forest-900/10 px-3 pt-3 text-[12.5px] font-semibold text-saffron-700 hover:text-forest-950">
                      {formatCount(p.homeHubs.allTreatments, TREATMENTS.length)}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/articles" className={navClass(pathname.startsWith("/articles"))}>
              {p.header.articles}
            </Link>
            <Link href="/faq" className={navClass(pathname.startsWith("/faq"))}>
              {p.header.faq}
            </Link>
            <Link href="/contact" className={navClass(pathname.startsWith("/contact"))}>
              {p.header.contact}
            </Link>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="lg:hidden">
              <LanguageSwitcher mobile />
            </div>
            <div className="hidden lg:block">
              <LanguageSwitcher compact />
            </div>
            <a
              href={telLink}
              aria-label={`${p.header.callPrefix} ${SITE.phoneDisplay}`}
              title={`${p.header.callPrefix} ${SITE.phoneDisplay}`}
              className="hidden xl:inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-saffron-500/30 bg-cream-100/70 px-3 py-2 text-[12.5px] font-medium text-forest-800 hover:bg-saffron-500 hover:text-white hover:border-saffron-500 transition-all"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              {/* Always the short label: the full number at 2xl pushed the nav's
                  last links (FAQ / Contact) underneath these actions. */}
              <span>{p.header.callShort}</span>
            </a>
            <Link
              href="/contact"
              className="btn-shine hidden sm:inline-flex items-center gap-2 rounded-full bg-forest-950 text-cream-50 px-3.5 xl:px-4 py-2.5 text-[12.5px] font-medium shadow hover:bg-forest-900 transition-colors whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4 text-saffron-400 shrink-0" /> {p.header.bookVisit}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? p.header.closeMenu : p.header.openMenu}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-950 text-saffron-300 lg:hidden"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col bg-forest-950/40 p-3 pt-1 backdrop-blur-sm lg:hidden" style={{ top: headerBottom }} onClick={() => setOpen(false)}>
          <div
            id="mobile-navigation"
            className="flex min-h-0 max-h-full flex-col overflow-hidden rounded-3xl border border-saffron-500/25 bg-cream-50 shadow-luxe-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid min-h-0 gap-1 overflow-y-auto overscroll-contain p-3 text-[15px] font-medium text-forest-950">
              {p.header.mobileLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-between gap-3 rounded-2xl px-4 py-3 hover:bg-forest-50">
                  {label} <span aria-hidden>→</span>
                </Link>
              ))}
            </div>
            <div className="shrink-0 border-t border-forest-900/10 bg-cream-50 p-3">
            <div className="grid grid-cols-2 gap-2.5">
              <LanguageSwitcher mobile fullWidth />
              <a
                href={telLink}
                aria-label={`${p.header.callPrefix} ${SITE.phoneDisplay}`}
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-saffron-500/40 px-4 text-[14px] font-semibold text-forest-900"
              >
                <Phone className="h-4 w-4 shrink-0 text-saffron-600" />
                {p.header.callShort}
              </a>
            </div>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-shine mt-2.5 flex items-center justify-center gap-2 rounded-full bg-forest-950 text-cream-50 px-4 py-3.5 text-center text-sm font-medium"
            >
              <CalendarCheck className="w-5 h-5 text-saffron-400" /> {p.header.bookChildVisit}
            </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

const FOOTER_CONDITIONS = [
  { slug: "adhd-in-children", title: "ADHD in Children" },
  { slug: "cerebral-palsy", title: "Cerebral Palsy" },
  { slug: "speech-delay-in-children", title: "Speech Delay" },
  { slug: "poor-appetite-children", title: "Poor Appetite" },
  { slug: "constipation-children", title: "Constipation" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { lang, t } = useLanguage();
  const p = usePagesDict(lang);

  return (
    <footer id="footer" className="mandala-section relative bg-forest-950 text-cream-100 overflow-hidden" aria-label={t.footer.footerAria}>
      <SectionMandalas id="footer" palette="marigold" side="right" dark />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.9fr_0.9fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-forest-950 shrink-0">
              <Leaf className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-display text-[19px] text-white">{t.site.doctorName}</span>
              <span className="block text-[10px] tracking-[0.16em] uppercase text-saffron-300 font-semibold">{t.site.shortCreds}</span>
            </span>
          </Link>
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/65 max-w-sm">{p.footer.bio}</p>
          <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-emerald-300/90 max-w-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{p.footer.regBadge}</span>
          </p>
          <div className="mt-4">
            <SocialLinks />
          </div>
        </div>

        <nav aria-label={p.footer.conditionsTitle}>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-saffron-400">{p.footer.conditionsTitle}</p>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            {FOOTER_CONDITIONS.map((item) => (
              <li key={item.slug}>
                <Link href={`/conditions/${item.slug}`} className="text-white/65 hover:text-saffron-300">
                  {trText(item.title, lang)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/conditions" className="text-saffron-300 hover:text-white font-medium">
                {p.footer.allConditions}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={p.footer.treatmentsTitle}>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-saffron-400">{p.footer.treatmentsTitle}</p>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            <li>
              <Link href="/treatments/customized-suvarnaprashan" className="text-white/65 hover:text-saffron-300">
                {trText("Customized Suvarnaprashan", lang)}
              </Link>
            </li>
            <li>
              <Link href="/treatments/panchakarma" className="text-white/65 hover:text-saffron-300">
                {trText("Panchakarma Treatment", lang)}
              </Link>
            </li>
            <li>
              <Link href="/services/ayurvedic-consultation" className="text-white/65 hover:text-saffron-300">
                {p.footer.consultationLink}
              </Link>
            </li>
            <li>
              <Link href="/articles" className="text-white/65 hover:text-saffron-300">
                {p.footer.articlesLink}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-white/65 hover:text-saffron-300">
                {p.footer.faqLink}
              </Link>
            </li>
            <li>
              <Link href="/sitemap" className="text-white/65 hover:text-saffron-300">
                {p.footer.sitemapLink}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-saffron-400">{p.footer.reachTitle}</p>
          <ul className="mt-3 space-y-2.5 text-[13.5px] text-white/70">
            <li>
              <a className="hover:text-saffron-300 flex gap-2" href={telLink}>
                <Phone className="w-4 h-4 mt-0.5 text-saffron-300 shrink-0" />
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-saffron-300 flex gap-2" href={`mailto:${SITE.email}`}>
                <Mail className="w-4 h-4 mt-0.5 text-saffron-300 shrink-0" />
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-2">
              <Clock className="w-4 h-4 mt-0.5 text-saffron-300 shrink-0" />
              <span>{t.site.hours}</span>
            </li>
            <li className="flex gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-saffron-300 shrink-0" />
              <span>{t.site.addressFull}</span>
            </li>
          </ul>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 text-forest-950 font-semibold px-5 py-2.5 text-[13.5px]"
          >
            <CalendarCheck className="w-4 h-4" /> {p.footer.bookBtn}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/45">
          <p>
            © {year} {t.site.doctorName} • {t.site.clinicName}. {p.footer.rights}
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/about-doctor" className="hover:text-white/75">
              {p.footer.aboutDoctor}
            </Link>
            <Link href="/privacy-policy" className="hover:text-white/75">
              {p.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-white/75">
              {p.footer.terms}
            </Link>
          </p>
          <p className="flex items-center gap-1.5">
            {p.footer.madeWith} <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" /> {p.footer.forKids}
          </p>
        </div>
        <p className="mx-auto max-w-7xl px-4 sm:px-6 pb-6 text-[11px] leading-relaxed text-white/40">{p.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
