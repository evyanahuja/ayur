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
  style,
}: {
  id: string;
  palette?: MandalaPaletteName;
  design?: MandalaDesign;
  motion?: MandalaMotion;
  dark?: boolean;
  placement: string;
  reverse?: boolean;
  style?: CSSProperties;
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
        root.style.setProperty("--paint", "0.84");
        root.style.setProperty("--outer-turn", "0deg");
        root.style.setProperty("--inner-turn", "0deg");
        return;
      }
      if (!visible || document.hidden) {
        root.style.setProperty("--paint", "0.55");
        return;
      }
      const rect = root.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - window.innerHeight * 0.5);
      const reach = window.innerHeight * 0.72 + rect.height * 0.55;
      const paint = Math.max(0.58, Math.min(1, 1.06 - distance / reach));
      root.style.setProperty("--paint", paint.toFixed(3));
      const direction = reverse ? -1 : 1;
      const turn = window.scrollY * 0.026 * direction;
      root.style.setProperty("--outer-turn", `${turn.toFixed(2)}deg`);
      root.style.setProperty("--inner-turn", `${(-turn * 0.68).toFixed(2)}deg`);
    };
    const schedule = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(update);
    };
    const onScroll = () => {
      if (visible && motion !== "still" && !preference.matches) schedule();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        schedule();
      },
      { threshold: 0 }
    );
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
      style={{ "--paint": 0.82, ...style } as CSSProperties}
    >
      <MandalaArt palette={palette} design={design} dark={dark} />
    </div>
  );
}

/** A local backdrop for EVERY section, above its surface and below its content.
 * One large rotating half-mandala + one companion corner ornament; hero renders three
 * so intricate mandala petals show both around and softly through the frosted-glass text card. */
export function SectionMandalas({
  id,
  palette = "peacock",
  side = "left",
  dark = false,
  hero = false,
  innerHero = false,
}: {
  id: string;
  palette?: MandalaPaletteName;
  side?: "left" | "right";
  dark?: boolean;
  hero?: boolean;
  innerHero?: boolean;
}) {
  const secondary: MandalaPaletteName =
    palette === "peacock" ? "lotus" : palette === "lotus" ? "marigold" : "peacock";
  return (
    <div
      className={`mandala-backdrop${dark ? " mandala-backdrop--dark" : ""}${hero ? " mandala-backdrop--hero" : ""}${innerHero ? " mandala-backdrop--inner-hero" : ""}`}
      data-mandala-section={id}
      aria-hidden="true"
    >
      <ScrollMandala
        id={`${id}-bloom`}
        palette={palette}
        design={side === "left" ? "paisley" : "lotus"}
        motion={hero || innerHero ? "ambient" : "scroll"}
        dark={dark}
        placement={
          hero
            ? "mandala-hero-left"
            : innerHero
              ? "mandala-inner-hero-left"
              : `mandala-edge mandala-edge--${side}`
        }
        reverse={side === "right"}
      />
      <ScrollMandala
        id={`${id}-corner`}
        palette={secondary}
        design="rosette"
        motion={hero ? "ambient" : "still"}
        dark={dark}
        placement={
          hero
            ? "mandala-hero-corner"
            : innerHero
              ? "mandala-inner-hero-right"
              : `mandala-corner mandala-corner--${side === "left" ? "right" : "left"}`
        }
        reverse={side === "left"}
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

/** Alternating edge & corner mandalas that span the body of inner hub, guide, article,
 *  category, and static pages so every page across the website shares the same signature artwork. */
export function PageMandalas({
  id,
  tall = false,
}: {
  id: string;
  tall?: boolean;
}) {
  return (
    <div className="mandala-backdrop" data-mandala-section={id} aria-hidden="true">
      <ScrollMandala
        id={`${id}-top`}
        palette="peacock"
        design="paisley"
        motion="scroll"
        placement="mandala-edge mandala-edge--left"
      />
      <ScrollMandala
        id={`${id}-mid-right`}
        palette="lotus"
        design="lotus"
        motion="scroll"
        placement="mandala-edge mandala-edge--right"
        style={{ top: tall ? "34%" : "42%" }}
        reverse
      />
      {tall && (
        <ScrollMandala
          id={`${id}-low-left`}
          palette="marigold"
          design="paisley"
          motion="scroll"
          placement="mandala-edge mandala-edge--left"
          style={{ top: "68%" }}
        />
      )}
      <ScrollMandala
        id={`${id}-end`}
        palette="marigold"
        design="rosette"
        motion="still"
        placement="mandala-corner mandala-corner--right"
      />
    </div>
  );
}
