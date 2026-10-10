"use client";

import { useEffect, useState } from "react";
import { Leaf, Menu, X, Phone, CalendarCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE, telLink, NAV_LINKS, COPY } from "@/content/site";
import { Magnetic } from "./luxe";
import { scrollToSection, BOOK_TARGET } from "@/lib/scroll";

const HREFS = NAV_LINKS.map((l) => l.href);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");

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
      { rootMargin: "-45% 0px -50% 0px" },
    );
    HREFS.forEach((h) => {
      const el = document.getElementById(h.replace("#", ""));
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /** PATCH: one handler for every CTA so the menu closes before scrolling */
  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      {/* reading progress */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent"
        aria-hidden
      >
        <div
          className="h-full bg-gradient-to-r from-forest-800 via-saffron-400 to-saffron-500 transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header
        className={cn(
          // PATCH: explicit z + safe padding so the CTA is never clipped
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled ? "py-2.5" : "py-5",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            aria-label="Primary"
            className={cn(
              "flex items-center justify-between gap-3 rounded-full px-3 sm:px-5 transition-all duration-700",
              scrolled
                ? "glass gold-hairline shadow-luxe py-2"
                : "bg-white/25 backdrop-blur-md border border-white/40 py-3",
            )}
          >
            <a
              href="#top"
              onClick={(e) => go(e, "#top")}
              className="flex items-center gap-3 group shrink-0"
              aria-label={`${SITE.doctorName} — Home`}
            >
              <span className="relative grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-saffron-300 shadow-lg group-hover:scale-105 group-hover:rotate-[5deg] transition-transform duration-700">
                <Leaf className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-saffron-300 to-saffron-500 ring-2 ring-cream-50" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[17px] sm:text-[19px] text-forest-950 tracking-[-0.02em] whitespace-nowrap">
                  {SITE.doctorName}
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-saffron-700 uppercase mt-0.5 whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" /> {SITE.shortCreds}
                </span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-[14px] font-medium tracking-wide transition-colors duration-500",
                    active === l.href
                      ? "text-forest-950"
                      : "text-forest-800/65 hover:text-forest-950",
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 bottom-1 h-px bg-gradient-to-r from-transparent via-saffron-500 to-transparent transition-all duration-500",
                      active === l.href ? "w-6 opacity-100" : "w-0 opacity-0",
                    )}
                  />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={telLink}
                aria-label={`${COPY.nav.call} — ${SITE.phoneDisplay}`}
                title={SITE.phoneDisplay}
                className="hidden md:inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-cream-100/60 text-[13.5px] font-medium text-forest-800 hover:text-white hover:bg-saffron-500 hover:border-saffron-500 transition-all duration-500 px-3 xl:px-4 py-2"
              >
                <span className="grid place-items-center w-6 h-6 rounded-full bg-saffron-500 text-white group-hover:bg-white transition-colors duration-500">
                  <Phone className="w-[14px] h-[14px]" />
                </span>
                <span className="hidden xl:inline whitespace-nowrap">
                  {COPY.nav.call}
                </span>
              </a>

              {/* ==========================================================
                  PATCH #1 — THE BOOK CONSULTATION BUTTON
                  Before: <Magnetic><a href="#book" className="btn-shine
                          gold-hairline shadow-luxe …">
                  Broken because (a) Magnetic rendered a block div so the
                  anchor shrink-wrapped + wrapped to 2 lines, (b) gold-hairline
                  overwrote shadow-luxe, (c) no whitespace-nowrap so the label
                  clipped, (d) z-index below the mobile menu overlay.

                  Now: inline-flex · shrink-0 · whitespace-nowrap · min 44px
                       tap target · single source of truth for the scroll.
                  ========================================================== */}
              <Magnetic strength={0.18}>
                <a
                  href={BOOK_TARGET}
                  onClick={(e) => go(e, BOOK_TARGET)}
                  aria-label={COPY.nav.book}
                  className="btn-shine group relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-forest-950 text-cream-50 text-[13px] xl:text-[13.5px] font-medium tracking-wide min-h-11 px-4 sm:px-4 xl:px-5 py-2.5 shadow-luxe hover:bg-forest-900 hover:shadow-luxe-lg transition-all duration-500"
                >
                  <CalendarCheck
                    className="w-[17px] h-[17px] text-saffron-400 shrink-0 group-hover:-rotate-6 transition-transform duration-500"
                    strokeWidth={1.9}
                  />
                  <span className="hidden sm:inline">{COPY.nav.book}</span>
                  <span className="sm:hidden">Book</span>
                </a>
              </Magnetic>

              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="lg:hidden grid place-items-center w-11 h-11 shrink-0 rounded-full bg-forest-950 text-saffron-300 hover:bg-forest-900 transition-colors"
                aria-expanded={open}
                aria-label={open ? COPY.nav.closeMenu : "Open menu"}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[55] lg:hidden transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-forest-950/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div className="absolute inset-x-3 top-24 rounded-3xl glass gold-hairline shadow-luxe-lg p-4">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium text-[15px] text-forest-950 hover:bg-forest-50 transition-all duration-700 border-b border-saffron-500/10 last:border-0",
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="text-[11px] text-saffron-600 font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.label}
              </span>
              <span aria-hidden>→</span>
            </a>
          ))}
          <a
            href={BOOK_TARGET}
            onClick={(e) => go(e, BOOK_TARGET)}
            className="btn-shine mt-4 flex items-center justify-center gap-2.5 rounded-full bg-forest-950 text-cream-50 font-medium px-5 py-4 hover:bg-forest-900 transition-colors"
          >
            <CalendarCheck className="w-5 h-5 text-saffron-400" />
            {COPY.nav.book}
          </a>
        </div>
      </div>
    </>
  );
}
