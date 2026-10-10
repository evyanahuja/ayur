"use client";

import { useEffect, useState } from "react";
import { MessageCircle, ArrowUp, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE, waLink, COPY } from "@/content/site";
import { scrollToSection, BOOK_TARGET } from "@/lib/scroll";

/* ── vertical rhythm of the floating stack (bottom → top) ──────────────
   mobile : bar → chat(28) → BOOK(44) → top(60)
   desktop: chat(6) → BOOK(24) → top-[10.5rem]
   Every button owns its own row so none of them can overlap the chat
   bubble or the sticky mobile CTA.                                    */
const ROW = {
  chat: "bottom-28 sm:bottom-6",
  book: "bottom-44 sm:bottom-24",
  top: "bottom-60 sm:bottom-[10.5rem]",
};

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const book = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(BOOK_TARGET);
  };

  return (
    <>
      {/* ─── WhatsApp chat (unchanged behaviour, now the visual twin) ─── */}
      <a
        href={waLink(SITE.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={COPY.floating.chatAria}
        className={cn(
          "group/fab fixed right-4 sm:right-6 z-40 grid place-items-center w-14 h-14 rounded-full",
          "bg-[#25D366] text-white shadow-[0_18px_38px_-10px_rgba(37,211,102,0.65)]",
          "hover:scale-110 transition-transform duration-500",
          ROW.chat,
        )}
      >
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] fab-pulse"
          aria-hidden
        />
        <MessageCircle className="relative w-6 h-6" strokeWidth={1.5} />
        <span className="fab-tooltip hidden sm:block">
          {COPY.floating.chatTooltip}
        </span>
      </a>

      {/* ================================================================
          PATCH #2 — NEW: floating "Book Consultation" action (desktop +
          mobile). Sits directly above the chat bubble, uses the exact same
          group/fab + .fab-tooltip pattern so the hover label matches.
          Previously this button only existed as a mobile-only sticky bar,
          so on desktop the ONLY way to convert was the tiny navbar CTA.
          ================================================================ */}
      <a
        href={BOOK_TARGET}
        onClick={book}
        aria-label={COPY.floating.bookAria}
        className={cn(
          "group/fab fixed right-4 sm:right-6 z-40 grid place-items-center w-14 h-14 rounded-full",
          "bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-saffron-300",
          "shadow-fab hover:scale-110 transition-transform duration-500",
          ROW.book,
        )}
      >
        <span
          className="absolute inset-0 rounded-full bg-saffron-400/70 fab-pulse"
          aria-hidden
        />
        <CalendarCheck
          className="relative w-[22px] h-[22px] group-hover/fab:-rotate-6 transition-transform duration-500"
          strokeWidth={1.6}
        />
        <span className="absolute inset-0 rounded-full gold-hairline" aria-hidden />
        {/* tooltip — identical pattern/position as the chat one */}
        <span className="fab-tooltip hidden sm:block">
          {COPY.floating.bookTooltip}
        </span>
        {/* tiny attention dot, mirrors the navbar logo dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-saffron-300 to-saffron-500 ring-2 ring-cream-100" />
      </a>

      {/* ─── back to top ─── */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={COPY.floating.backToTop}
        className={cn(
          "fixed right-4 sm:right-6 z-40 grid place-items-center w-11 h-11 rounded-full glass gold-hairline text-forest-900 shadow-luxe transition-all duration-500 hover:bg-forest-950 hover:text-saffron-300",
          ROW.top,
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* ─── mobile sticky bar (kept, now offset-aware) ─── */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden px-3 pb-3 pt-8 bg-gradient-to-t from-forest-950/60 to-transparent pointer-events-none">
        <a
          href={BOOK_TARGET}
          onClick={book}
          className="btn-shine pointer-events-auto flex items-center justify-center gap-2.5 rounded-full bg-forest-950 text-cream-50 font-medium tracking-wide text-[15px] px-6 py-4 shadow-luxe-lg gold-hairline"
        >
          <CalendarCheck className="w-5 h-5 text-saffron-400" />
          {COPY.floating.bookBtn}
        </a>
      </div>
    </>
  );
}
