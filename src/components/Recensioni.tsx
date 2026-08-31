import { useEffect, useRef, useState } from "react";
import { REVIEWS, RATING_BARS, INFO } from "../data";
import { Star, Quote } from "./Icons";

function Bar({ stars, pct }: { stars: number; pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="w-3 text-sm font-semibold text-foam/70">{stars}</span>
      <Star className="h-3.5 w-3.5 text-brass" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-lagoon">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brass to-coral transition-[width] duration-[1.4s] ease-out"
          style={{ width: inView ? `${pct}%` : "0%" }}
        />
      </div>
      <span className="w-9 text-right text-xs text-foam/50">{pct}%</span>
    </div>
  );
}

function Card({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <article className="w-[340px] shrink-0 rounded-2xl border border-foam/12 bg-white/70 p-6 shadow-[0_10px_30px_rgba(15,58,77,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40 hover:bg-white sm:w-[380px]">
      <div className="flex items-center justify-between">
        <span className="flex text-brass">
          {Array.from({ length: r.stars }).map((_, i) => (
            <Star key={i} className="h-4 w-4" />
          ))}
        </span>
        <Quote className="h-6 w-6 text-tide" />
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-foam/85">“{r.text}”</p>
      <footer className="mt-5 flex items-center gap-3 border-t border-foam/10 pt-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brass font-display text-lg font-bold text-abyss">
          {r.name.charAt(0)}
        </span>
        <span>
          <strong className="block text-sm font-semibold text-foam">{r.name}</strong>
          <span className="block text-xs text-foam/50">{r.meta}</span>
        </span>
      </footer>
    </article>
  );
}

export default function Recensioni() {
  const rowA = [...REVIEWS, ...REVIEWS];
  const rowB = [...REVIEWS.slice().reverse(), ...REVIEWS.slice().reverse()];

  return (
    <section id="recensioni" className="relative overflow-hidden bg-deep py-24 lg:py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-brass/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* summary */}
          <div data-reveal>
            <p className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-brass">
              <span className="h-px w-10 bg-brass" /> Il giro di banchina
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight text-foam sm:text-5xl">
              Quello che si dice <em className="text-brass">al molo</em>.
            </h2>
            <div className="mt-8 flex items-end gap-5">
              <p className="font-display text-7xl font-semibold leading-none text-brass">
                {INFO.rating.toLocaleString("it-IT")}
              </p>
              <div className="pb-1">
                <div className="flex text-brass">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className={`h-5 w-5 ${i === 4 ? "opacity-40" : ""}`} />
                  ))}
                </div>
                <p className="mt-1 text-sm text-foam/60">{INFO.reviews.toLocaleString("it-IT")} recensioni verificate dai commensali</p>
              </div>
            </div>
            <div className="mt-7 max-w-md space-y-2.5">
              {RATING_BARS.map((b) => (
                <Bar key={b.stars} {...b} />
              ))}
            </div>
          </div>

          {/* highlight quote */}
          <figure data-reveal="right" className="relative rounded-2xl border border-brass/30 bg-ink/60 p-8 lg:p-10">
            <Quote className="absolute -top-5 left-8 h-10 w-10 rounded-full bg-ember p-2 text-foam" />
            <blockquote className="font-display text-2xl font-medium leading-snug text-foam sm:text-3xl">
              «Tutto buonissimo. Cucina squisita, cibi freschi di qualità con sapori tradizionali.
              Fritto cotto in maniera perfetta, molto leggero.»
            </blockquote>
            <figcaption className="mt-5 font-hand text-2xl text-brass">
              — il coro delle recensioni, da Google a Tripadvisor
            </figcaption>
          </figure>
        </div>
      </div>

      {/* dual marquee of cards */}
      <div className="mt-16 space-y-6">
        <div className="marquee-track overflow-hidden">
          <div className="marquee-inner flex w-max animate-marquee gap-6 pr-6">
            {rowA.map((r, i) => <Card key={`a${i}`} r={r} />)}
          </div>
        </div>
        <div className="marquee-track overflow-hidden">
          <div className="marquee-inner flex w-max animate-marquee-rev gap-6 pr-6">
            {rowB.map((r, i) => <Card key={`b${i}`} r={r} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
