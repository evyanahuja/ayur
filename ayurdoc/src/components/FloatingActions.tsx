"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, ArrowUp, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";

export function FloatingActions() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);
  const [overForm, setOverForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* The floating buttons are pinned to the right edge, exactly where the form's
     dropdown arrows and right-hand fields are. While any booking/enquiry form is
     on screen they slide out of the way (and return when you scroll past), so
     they can never cover or intercept taps on a field. A scroll/resize check is
     used instead of an IntersectionObserver so forms that mount late (route
     changes, step changes) are still picked up. */
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const viewport = window.innerHeight;
      let over = false;
      document.querySelectorAll<HTMLElement>("[data-patient-enquiry]").forEach((form) => {
        const box = form.getBoundingClientRect();
        if (box.height > 0 && box.top < viewport - 8 && box.bottom > 8) over = true;
      });
      setOverForm(over);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const late = window.setTimeout(schedule, 400);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  const stepAside = overForm ? "invisible pointer-events-none opacity-0 translate-x-6" : "";

  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t.site.whatsappMessage)}`;

  return (
    <>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.floating.whatsappAria}
        aria-hidden={overForm || undefined}
        tabIndex={overForm ? -1 : undefined}
        data-floating-action="whatsapp"
        className={cn(
          "group fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_18px_38px_-10px_rgba(37,211,102,0.65)] hover:scale-110 transition-all duration-500",
          stepAside
        )}
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" aria-hidden />
        <MessageCircle className="w-6 h-6 relative" fill="currentColor" strokeWidth={1.5} />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-full bg-forest-950 text-white text-[11px] font-medium tracking-wide px-4 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden sm:block gold-hairline">
          {t.floating.chatTooltip}
        </span>
      </a>

      {/* Floating Book Consultation Button */}
      <Link
        href="/contact"
        aria-label={t.floating.bookAria}
        aria-hidden={overForm || undefined}
        tabIndex={overForm ? -1 : undefined}
        data-floating-action="book"
        className={cn(
          "group hidden sm:grid fixed sm:bottom-24 right-4 sm:right-6 z-40 place-items-center w-14 h-14 rounded-full bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-saffron-300 shadow-[0_18px_38px_-10px_rgba(11,36,25,0.6)] hover:scale-110 transition-all duration-500 gold-hairline",
          stepAside
        )}
      >
        <span className="absolute inset-0 rounded-full bg-saffron-400 animate-ping opacity-15" aria-hidden />
        <CalendarCheck className="w-6 h-6 relative" strokeWidth={1.6} />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-full bg-forest-950 text-white text-[11px] font-medium tracking-wide px-4 py-2.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 pointer-events-none gold-hairline">
          {t.floating.bookTooltip}
        </span>
      </Link>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t.floating.backToTop}
        aria-hidden={overForm || !showTop || undefined}
        tabIndex={overForm || !showTop ? -1 : undefined}
        data-floating-action="top"
        className={cn(
          "fixed bottom-40 sm:bottom-[10.5rem] right-[1.375rem] sm:right-[1.875rem] z-40 grid place-items-center w-11 h-11 rounded-full glass gold-hairline text-forest-900 shadow-luxe transition-all duration-500 hover:bg-forest-950 hover:text-saffron-300",
          showTop && !overForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
          overForm && "invisible translate-x-6"
        )}
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div
        data-floating-action="mobile-bar"
        aria-hidden={overForm || undefined}
        className={cn(
          "fixed bottom-0 inset-x-0 z-40 sm:hidden px-3 pb-3 pt-8 bg-gradient-to-t from-forest-950/60 to-transparent pointer-events-none transition-all duration-500",
          overForm && "invisible opacity-0 translate-y-4"
        )}
      >
        <Link
          href="/contact"
          className="btn-shine pointer-events-auto flex items-center justify-center gap-2.5 rounded-full bg-forest-950 text-cream-50 font-medium tracking-wide text-[15px] px-6 py-4 shadow-luxe-lg gold-hairline"
        >
          <CalendarCheck className="w-5 h-5 text-saffron-400" /> {t.floating.bookBtn}
        </Link>
      </div>
    </>
  );
}
