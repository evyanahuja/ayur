"use client";

import { useEffect, useState } from "react";
import { MessageCircle, ArrowUp, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { waLink } from "@/content/site";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp float */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_18px_38px_-10px_rgba(37,211,102,0.65)] hover:scale-110 transition-transform duration-500"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" aria-hidden />
        <MessageCircle className="w-6 h-6 relative" fill="currentColor" strokeWidth={1.5} />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-full bg-forest-950 text-white text-[11px] font-medium tracking-wide px-4 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden sm:block gold-hairline">
          Chat with clinic 💬
        </span>
      </a>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "fixed bottom-40 sm:bottom-24 right-4 sm:right-6 z-40 grid place-items-center w-11 h-11 rounded-full glass gold-hairline text-forest-900 shadow-luxe transition-all duration-500 hover:bg-forest-950 hover:text-saffron-300",
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden px-3 pb-3 pt-8 bg-gradient-to-t from-forest-950/60 to-transparent pointer-events-none">
        <a
          href="#book"
          className="btn-shine pointer-events-auto flex items-center justify-center gap-2.5 rounded-full bg-forest-950 text-cream-50 font-medium tracking-wide text-[15px] px-6 py-4 shadow-luxe-lg gold-hairline"
        >
          <CalendarCheck className="w-5 h-5 text-saffron-400" /> Book Your Child&apos;s Visit
        </a>
      </div>
    </>
  );
}
