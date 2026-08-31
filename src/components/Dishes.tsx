import { DISHES } from "../data";
import { ArrowUpRight } from "./Icons";

export default function Dishes() {
  return (
    <section id="piatti" className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div className="waveband absolute top-0 left-0 right-0 opacity-60" />

      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p data-reveal className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-brass">
              <span className="h-px w-10 bg-brass" /> Dalla banchina al piatto
            </p>
            <h2 data-reveal style={{ ["--rd" as string]: "80ms" }} className="max-w-xl font-display text-4xl font-semibold leading-tight text-foam sm:text-5xl">
              I piatti che hanno fatto <em className="text-brass">la voce</em> in porto.
            </h2>
          </div>
          <p data-reveal style={{ ["--rd" as string]: "160ms" }} className="hidden max-w-xs text-sm leading-relaxed text-foam/55 lg:block">
            Scorri la cambusa: cinque motivi per cui 1.501 recensioni continuano a parlare di noi.
          </p>
        </div>
      </div>

      {/* horizontal scroller */}
      <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-8 lg:px-10 [scrollbar-width:thin]">
        {DISHES.map((d, i) => (
          <article
            key={d.name}
            data-reveal
            style={{ ["--rd" as string]: `${i * 90}ms` }}
            className="group relative w-[82vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-foam/10 sm:w-[420px] lg:w-[460px]"
          >
            <div className="relative h-[440px] overflow-hidden lg:h-[500px]">
              <img
                src={d.img}
                alt={d.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06222e]/90 via-[#06222e]/25 to-transparent" />

              <span className="absolute left-5 top-5 font-display text-5xl font-semibold text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.65)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute right-5 top-5 rounded-full bg-ember px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-foam shadow-lg">
                {d.tag}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl font-semibold text-white lg:text-3xl">{d.name}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-hover:opacity-100 max-lg:opacity-100">
                  {d.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#ffd98a]">
                  Ordinabile stasera
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </div>
          </article>
        ))}

        {/* end card */}
        <a
          href="#menu"
          data-reveal
          className="group grid w-[60vw] shrink-0 snap-start place-items-center rounded-2xl border-2 border-dashed border-brass/40 bg-lagoon/20 p-8 text-center transition-colors hover:border-brass hover:bg-lagoon/40 sm:w-[280px]"
        >
          <div>
            <p className="font-hand text-3xl text-brass">…e il resto?</p>
            <p className="mt-3 text-sm text-foam/70">Tutto il menù del giorno, con i prezzi della trattoria.</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-abyss transition-transform group-hover:scale-105">
              Apri il menù <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
