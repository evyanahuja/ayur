"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { MandalaArt, type MandalaDesign, type MandalaPaletteName } from "./MandalaArt";

export type MandalaMotion = "still" | "scroll" | "ambient";

/** Scroll work is event-driven, not a permanent per-mandala animation loop.
 * IntersectionObserver pauses off-screen movement; reduced motion is respected
 * both at load and when the preference changes while the page is open. */
export function ScrollMandala({
  id,
  palette = "peacock",
  design = "paisley",
  motion = "scroll",
  dark = false,
  placement,
  reverse = false,
}: {
  id: string;
  palette?: MandalaPaletteName;
  design?: MandalaDesign;
  motion?: MandalaMotion;
  dark?: boolean;
  placement: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let raf = 0;
    let disposed = false;

    const update = () => {
      raf = 0;
      if (disposed) return;
      const reduced = preference.matches;
      const enabled = visible && !document.hidden && !reduced && motion !== "still";
      root.dataset.active = String(enabled);
      root.dataset.reduced = String(reduced);

      if (reduced || motion === "still") {
        root.style.setProperty("--paint", "0.78");
        root.style.setProperty("--outer-turn", "0deg");
        root.style.setProperty("--inner-turn", "0deg");
        return;
      }
      if (!visible || document.hidden) {
        root.style.setProperty("--paint", "0");
        return;
      }
      const rect = root.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - window.innerHeight * 0.5);
      const reach = window.innerHeight * 0.6 + rect.height * 0.5;
      const paint = Math.max(0, Math.min(1, 1 - distance / reach));
      root.style.setProperty("--paint", paint.toFixed(3));
      const direction = reverse ? -1 : 1;
      const turn = window.scrollY * 0.024 * direction;
      root.style.setProperty("--outer-turn", `${turn.toFixed(2)}deg`);
      root.style.setProperty("--inner-turn", `${(-turn * 0.68).toFixed(2)}deg`);
    };
    const schedule = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(update);
    };
    const onScroll = () => {
      if (visible && motion !== "still" && !preference.matches) schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }, { threshold: 0 });
    observer.observe(root);
    const resize = new ResizeObserver(schedule);
    if (root.parentElement) resize.observe(root.parentElement);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", schedule);
    update();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, [motion, reverse]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`mandala-motif ${placement}`}
      data-scroll-mandala
      data-mandala-id={id}
      data-motion={motion}
      data-active="false"
      style={{ "--paint": 0.7 } as CSSProperties}
    >
      <MandalaArt palette={palette} design={design} dark={dark} />
    </div>
  );
}

/** A local backdrop for EVERY section, above its surface and below its content.
 * No whole-page percentages: ornaments keep their place even as copy changes.
 * One large half-mandala + one small, still corner ornament; hero gets three. */
export function SectionMandalas({
  id,
  palette = "peacock",
  side = "left",
  dark = false,
  hero = false,
}: {
  id: string;
  palette?: MandalaPaletteName;
  side?: "left" | "right";
  dark?: boolean;
  hero?: boolean;
}) {
  const secondary: MandalaPaletteName = palette === "peacock" ? "lotus" : "marigold";
  return (
    <div
      className={`mandala-backdrop${dark ? " mandala-backdrop--dark" : ""}${hero ? " mandala-backdrop--hero" : ""}`}
      data-mandala-section={id}
      aria-hidden="true"
    >
      <ScrollMandala
        id={`${id}-bloom`}
        palette={palette}
        design={side === "left" ? "paisley" : "lotus"}
        motion={hero ? "ambient" : "scroll"}
        dark={dark}
        placement={hero ? "mandala-hero-left" : `mandala-edge mandala-edge--${side}`}
        reverse={side === "right"}
      />
      <ScrollMandala
        id={`${id}-corner`}
        palette={secondary}
        design="rosette"
        motion="still"
        dark={dark}
        placement={hero ? "mandala-hero-corner" : `mandala-corner mandala-corner--${side === "left" ? "right" : "left"}`}
      />
      {hero && (
        <ScrollMandala
          id={`${id}-orbit`}
          palette="lotus"
          design="lotus"
          motion="ambient"
          placement="mandala-hero-right"
          reverse
        />
      )}
    </div>
  );
}
