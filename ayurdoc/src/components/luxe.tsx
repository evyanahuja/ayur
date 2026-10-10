"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * PATCH #1 (part A) — Magnetic.
 *
 * The old version wrapped its child in a block-level <div> with a
 * `transform`. Inside the flex navbar that made the Book Consultation
 * anchor shrink-to-fit, wrap its label and lose its shadow
 * (the broken pill in the screenshot).
 *
 * Fixes:
 *  • renders `display: inline-flex` so it behaves like the button it wraps
 *  • `will-change: transform` + `translateZ(0)` → own layer, no sub-pixel seams
 *  • pointer events disabled while dragging so the link never "sticks"
 */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "inline-flex shrink-0 will-change-transform",
        "transition-transform duration-500 ease-out",
        className,
      )}
    >
      <span ref={ref} className="inline-flex shrink-0">
        {children}
      </span>
    </span>
  );
}
