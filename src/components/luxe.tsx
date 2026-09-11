"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
 * LineReveal — headings rise out of a mask, line by line (couture editorial)
 * ------------------------------------------------------------------------ */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  step = 110,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  step?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((l, i) => (
        <span key={i} className={cn("line-mask", lineClassName)}>
          <span
            style={{ transitionDelay: `${delay + i * step}ms`, transform: shown ? "translateY(0)" : undefined }}
          >
            {l}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Magnetic — element subtly leans toward the cursor (premium microinteraction)
 * ------------------------------------------------------------------------ */
export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "translate(0px, 0px)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <span
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      style={{ transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Spotlight — a soft gold glow that follows the cursor across a surface
 * ------------------------------------------------------------------------ */
export function Spotlight({
  children,
  className,
  color = "rgba(212,162,76,0.16)",
  size = 520,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPos(null)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: pos ? 1 : 0,
          background: pos
            ? `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 72%)`
            : undefined,
        }}
      />
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Parallax — gentle depth on scroll
 * ------------------------------------------------------------------------ */
export function Parallax({
  children,
  className,
  speed = 0.06,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * GoldRule — a thin ornamental divider with a centred diamond
 * ------------------------------------------------------------------------ */
export function GoldRule({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-saffron-500/45 to-saffron-500/45" />
      {label ? (
        <span className="eyebrow text-saffron-700/80 whitespace-nowrap">{label}</span>
      ) : (
        <span className="w-1.5 h-1.5 rotate-45 bg-saffron-500/70" />
      )}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-saffron-500/45 to-saffron-500/45" />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * TiltCard — subtle 3D tilt on pointer
 * ------------------------------------------------------------------------ */
export function TiltCard({
  children,
  className,
  max = 6,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1100px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-6px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max]);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{ transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)", ...style }}
    >
      {children}
    </div>
  );
}
