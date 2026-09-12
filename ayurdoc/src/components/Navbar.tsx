"use client";

import { useEffect, useState } from "react";
import { Leaf, Menu, X, Phone, CalendarCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE, telLink } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Magnetic } from "./luxe";

const HREFS = ["#doctor", "#specialties", "#method", "#stories", "#plans", "#faq"];

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");

  const LINKS = t.nav.links.map((label, i) => ({ label, href: HREFS[i] }));

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    HREFS.map((h) => h.replace("#", "")).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent" aria-hidden>
        <div
          className="h-full bg-gradient-to-r from-forest-800 via-saffron-400 to-saffron-600 transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled ? "py-2.5" : "py-5"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            aria-label={t.nav.primaryNav}
            className={cn(
              "flex items-center justify-between gap-3 rounded-full px-4 sm:px-6 transition-all duration-700",
              scrolled
                ? "glass gold-hairline shadow-luxe py-2.5"
                : "bg-white/25 backdrop-blur-md border border-white/40 py-3.5"
            )}
          >
            <a href="#top" className="flex items-center gap-3 group shrink-0" aria-label={`${SITE.doctorName} — Home`}>
              <span className="relative grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-saffron-300 shadow-lg group-hover:scale-105 group-hover:rotate-[5deg] transition-transform duration-700">
                <Leaf className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-saffron-300 to-saffron-500 ring-2 ring-cream-50" />
              </span>
              <span className="leading-tight">
                <span className="block font-display font-normal text-[17px] sm:text-[19px] text-forest-950 tracking-[-0.02em]">
                  {SITE.doctorName}
                </span>
                <span className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-semibold tracking-[0.12em] text-saffron-700 uppercase mt-0.5 whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5 shrink-0" /> {SITE.shortCreds}
                </span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-0.5">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-[14px] font-medium tracking-wide transition-colors duration-500",
                    active === l.href ? "text-forest-950" : "text-forest-800/65 hover:text-forest-950"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 bottom-1 h-px bg-gradient-to-r from-transparent via-saffron-500 to-transparent transition-all duration-500",
                      active === l.href ? "w-6 opacity-100" : "w-0 opacity-0"
                    )}
                  />
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher compact />
              <a
                href={telLink}
                className="hidden xl:flex items-center gap-2.5 text-[13.5px] font-medium text-forest-800 hover:text-forest-950 transition-colors group"
              >
                <span className="grid place-items-center w-9 h-9 rounded-full border border-saffron-500/30 bg-cream-100/60 group-hover:bg-saffron-500 group-hover:text-white group-hover:border-saffron-500 transition-all duration-500">
                  <Phone className="w-[15px] h-[15px]" />
                </span>
                <span className="tracking-wide">{SITE.phoneDisplay}</span>
              </a>
              <Magnetic strength={0.22}>
                <a
                  href="#book"
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-forest-950 text-cream-50 text-[13.5px] font-medium tracking-wide px-6 py-3.5 shadow-luxe hover:shadow-luxe-lg transition-shadow duration-700 whitespace-nowrap"
                >
                  <CalendarCheck className="w-4 h-4 text-saffron-400" />
                  {t.nav.book}
                </a>
              </Magnetic>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher compact />
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden grid place-items-center w-11 h-11 rounded-full bg-forest-950 text-saffron-300 hover:bg-forest-900 transition-colors"
                aria-expanded={open}
                aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="hidden md:grid lg:hidden place-items-center w-11 h-11 rounded-full bg-forest-950 text-saffron-300 hover:bg-forest-900 transition-colors"
              aria-expanded={open}
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-500",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-forest-950/60 backdrop-blur-md" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute top-[92px] left-4 right-4 rounded-[28px] bg-cream-50 gold-hairline shadow-luxe-lg p-5 transition-all duration-700",
            open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-5 scale-[0.97] opacity-0"
          )}
        >
          <div className="grid gap-1">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium text-[15px] text-forest-950 hover:bg-forest-50 transition-all duration-700 border-b border-saffron-500/10 last:border-0",
                  open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-saffron-600 tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                </span>
                <span className="text-saffron-600">→</span>
              </a>
            ))}
          </div>
          <a
            href="#book"
            onClick={() => setOpen(false)}
            className="btn-shine mt-4 flex items-center justify-center gap-2.5 rounded-full bg-forest-950 text-cream-50 font-medium px-5 py-4 hover:bg-forest-900 transition-colors"
          >
            <CalendarCheck className="w-[18px] h-[18px] text-saffron-400" /> {t.nav.book}
          </a>
          <p className="text-center text-[11px] text-forest-600/60 mt-4 tracking-wide">
            {t.nav.replies} · {t.site.languages}
          </p>
        </div>
      </div>
    </>
  );
}
