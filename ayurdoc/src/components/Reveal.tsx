"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

type Variant = "up" | "scale" | "left" | "right";

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass =
    variant === "scale" ? "reveal-scale" : variant === "left" ? "reveal-left" : variant === "right" ? "reveal-right" : "reveal";

  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div ref={ref} id={id} style={style} className={cn(variantClass, className)}>
      {children}
    </div>
  );
}
