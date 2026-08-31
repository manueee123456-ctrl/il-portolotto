import { Suspense } from "react";
import Scene3D from "./Scene3D";
import { INFO } from "../data";
import { Star, ArrowDown, Fish, Anchor } from "./Icons";

export default function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* 3D harbour */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </div>

      {/* legibility veils */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f2f9fc] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f2f9fc]/85 via-transparent to-transparent" />

      {/* vertical coordinates */}
      <div className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 lg:block">
        <p className="rotate-180 text-[11px] font-medium uppercase tracking-[0.5em] text-foam/45 [writing-mode:vertical-rl]">
          {INFO.coords} — Mare Adriatico
        </p>
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-24 lg:px-10 lg:pb-28">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-brass">
            <span className="h-px w-10 bg-brass" />
            {INFO.quarter}
          </p>

          <h1 className="font-display font-semibold leading-[0.88] tracking-tight text-foam">
            <span className="line-mask text-[13vw] sm:text-[11vw] lg:text-[8.2rem]">
              <span style={{ ["--ld" as string]: "150ms" }}>
                Il <em className="not-italic text-brass">Portolotto</em>
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-foam/80 sm:text-lg">
            Pesce di stagione servito su tovagliette di carta, sotto lampadari di vimini e tavoli di
            marmo. La lingua antica del porto di Rimini, viva in tavola dal mare alla banchina.
          </p>

          <p
            className="mt-4 -rotate-2 font-hand text-2xl text-coral"
            style={{ animation: "bob 6s ease-in-out infinite" }}
          >
            «chiedi il fuori menù al cameriere» →
          </p>

          {/* chips */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#recensioni"
              className="group flex items-center gap-2 rounded-full border border-brass/40 bg-white/75 px-4 py-2 text-sm text-foam transition-all hover:border-brass hover:bg-white"
            >
              <span className="flex text-brass">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i === 4 ? "opacity-40" : ""}`} />
                ))}
              </span>
              <strong className="font-semibold">{INFO.rating.toLocaleString("it-IT")}</strong>
              <span className="text-foam/60">· {INFO.reviews.toLocaleString("it-IT")} recensioni</span>
            </a>
            <span className="flex items-center gap-2 rounded-full border border-foam/15 bg-white/70 px-4 py-2 text-sm text-foam/90">
              <Fish className="h-4 w-4 text-seafoam" /> Pescato del giorno
            </span>
            <span className="hidden items-center gap-2 rounded-full border border-foam/15 bg-white/70 px-4 py-2 text-sm text-foam/90 sm:flex">
              <Anchor className="h-4 w-4 text-seafoam" /> Trattoria · €€
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={INFO.phoneHref}
              className="group relative overflow-hidden rounded-full bg-brass px-8 py-4 font-semibold text-abyss transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(217,164,65,0.4)]"
            >
              <span className="relative z-10">Prenota un tavolo</span>
              <span className="absolute inset-0 -translate-x-full bg-brasslight transition-transform duration-500 group-hover:translate-x-0" />
            </a>
            <a
              href="#menu"
              className="rounded-full border border-foam/35 bg-white/60 px-8 py-4 font-semibold text-foam transition-all duration-300 hover:-translate-y-1 hover:border-brass hover:text-brass"
            >
              Sfoglia il menù
            </a>
          </div>
        </div>
      </div>

      {/* plus code */}
      <div className="absolute bottom-8 right-6 z-10 hidden text-right md:block">
        <p className="text-[11px] uppercase tracking-[0.3em] text-foam/40">{INFO.plusCode}</p>
        <p className="mt-1 font-hand text-lg text-brass/80">sulla darsena, oltre il ponte</p>
      </div>

      {/* scroll cue */}
      <a
        href="#locanda"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-foam/60 transition-colors hover:text-brass"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.35em]">Scendi in banchina</span>
        <span className="grid h-9 w-9 animate-bounce place-items-center rounded-full border border-foam/30">
          <ArrowDown className="h-4 w-4" />
        </span>
      </a>
    </section>
  );
}
