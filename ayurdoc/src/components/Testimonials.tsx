"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck, Heart } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";
import { TESTIMONIALS, MINI_WINS } from "@/content/site";



export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const perView = 1; // mobile-first carousel; desktop shows grid fallback via scroll
  const max = TESTIMONIALS.length - perView;

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i >= max ? 0 : i + 1));
    }, 4600);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, max]);

  const go = (dir: number) => {
    setIndex((i) => {
      const n = i + dir;
      if (n < 0) return max;
      if (n > max) return 0;
      return n;
    });
  };

  return (
    <section id="stories" className="relative py-20 sm:py-32 scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-100/70 via-cream-50 to-transparent" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-300/40 text-rose-700 text-[11px] font-semibold tracking-[0.24em] uppercase px-4 py-2">
            <Heart className="w-3.5 h-3.5" fill="currentColor" /> 5,000+ little victories
          </p>
          <h2 className="mt-6 font-display font-light text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.02] text-forest-950">
            Real parents. Real turnarounds. <span className="italic text-gradient-gold">Real childhoods reclaimed.</span>
          </h2>
          <p className="mt-5 text-[16px] text-forest-800/65 leading-[1.75]">
            Names shared with consent. Photos illustrative to protect child privacy.
          </p>
        </Reveal>

        {/* Carousel (mobile + tablet) + auto grid on desktop */}
        <Reveal delay={120} className="mt-10">
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="overflow-hidden rounded-[28px]" aria-live="polite">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {TESTIMONIALS.map((t) => (
                  <article
                    key={t.name + t.tag}
                    className="w-full shrink-0 px-0.5"
                    aria-label={`Testimonial from ${t.name}`}
                  >
                    <div className="mx-auto max-w-4xl rounded-[32px] bg-white gold-hairline shadow-luxe p-7 sm:p-12 grid sm:grid-cols-[1fr_1.6fr] gap-6 items-center">
                      <div className="text-center sm:text-left">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 text-cream-100 text-[11px] font-bold px-3 py-1.5">
                          <BadgeCheck className="w-3.5 h-3.5 text-saffron-400" /> {t.tag}
                        </span>
                        <div className="mt-4 flex sm:flex-col items-center sm:items-start gap-4">
                          <img src={t.img} alt={t.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md" loading="lazy" />
                          <div>
                            <p className="font-bold text-forest-950 text-[15px]">{t.name}</p>
                            <p className="text-xs text-forest-600 mt-0.5">{t.role}</p>
                            <div className="mt-2 flex items-center gap-0.5 justify-center sm:justify-start" aria-label={`${t.stars} stars`}>
                              {Array.from({ length: t.stars }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-saffron-500" fill="currentColor" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <Quote className="w-9 h-9 text-saffron-400/50" fill="currentColor" aria-hidden />
                        <blockquote className="mt-3 font-display font-light text-[19px] sm:text-[22px] leading-[1.6] text-forest-900">
                          “{t.text}”
                        </blockquote>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => go(-1)}
                aria-label="Previous story"
                className="grid place-items-center w-12 h-12 rounded-full bg-white gold-hairline text-forest-900 hover:bg-forest-950 hover:text-saffron-300 transition-all duration-500 shadow-luxe hover:-translate-x-0.5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2" role="tablist" aria-label="Choose story">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={index === i}
                    aria-label={`Go to story ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      index === i ? "w-9 bg-gradient-to-r from-saffron-400 to-saffron-600" : "w-2.5 bg-forest-200 hover:bg-saffron-300"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() => go(1)}
                aria-label="Next story"
                className="grid place-items-center w-12 h-12 rounded-full bg-white gold-hairline text-forest-900 hover:bg-forest-950 hover:text-saffron-300 transition-all duration-500 shadow-luxe hover:translate-x-0.5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Mini wall */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {MINI_WINS.map((m, i) => (
            <Reveal key={m.q} delay={i * 90} variant="scale">
              <div className="card-lift rounded-2xl bg-gradient-to-br from-white to-cream-100 gold-hairline p-6 text-center">
                <div className="flex justify-center gap-0.5 mb-2.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-saffron-500" fill="currentColor" />
                  ))}
                </div>
                <p className="font-display font-normal text-forest-900 text-[16.5px] leading-snug">“{m.q}”</p>
                <p className="mt-2 text-xs text-forest-600 font-medium">{m.n}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
