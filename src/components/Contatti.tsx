import { INFO, HOURS, SUPPLIERS } from "../data";
import { Pin, Phone, Mail, Clock, ArrowUpRight, Compass, Boat } from "./Icons";

export default function Contatti() {
  return (
    <section id="contatti" className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-tide/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        {/* suppliers */}
        <div className="border-b border-foam/10 pb-14">
          <p data-reveal className="mb-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-brass">
            <span className="h-px w-10 bg-brass" /> I fornitori · la cambusa
          </p>
          <div data-reveal className="flex flex-wrap gap-3">
            {SUPPLIERS.map((s) => (
              <span
                key={s}
                className="cursor-default rounded-full border border-foam/15 bg-deep px-5 py-2.5 text-sm text-foam/75 transition-all duration-300 hover:-translate-y-1 hover:border-seafoam/60 hover:text-seafoam"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* contact + map */}
        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 data-reveal className="font-display text-4xl font-semibold leading-tight text-foam sm:text-5xl">
              Dove il porto <em className="text-brass">incontra il mare</em>.
            </h2>
            <p data-reveal style={{ ["--rd" as string]: "100ms" }} className="mt-5 max-w-md text-lg text-foam/70">
              Oltre il Ponte di Tiberio, lungo la darsena di San Giuliano Mare. Prenota: il locale è
              piccolo e i portolotti si ricordano di chi prenota.
            </p>

            <ul className="mt-8 space-y-4">
              <li data-reveal style={{ ["--rd" as string]: "140ms" }} className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-lagoon text-brass"><Pin /></span>
                <span className="text-foam/85">{INFO.address}</span>
              </li>
              <li data-reveal style={{ ["--rd" as string]: "200ms" }}>
                <a href={INFO.phoneHref} className="group flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-lagoon text-brass transition-transform group-hover:-rotate-12"><Phone /></span>
                  <span className="sweep text-foam/85 group-hover:text-brass">{INFO.phone}</span>
                </a>
              </li>
              <li data-reveal style={{ ["--rd" as string]: "260ms" }}>
                <a href={`mailto:${INFO.email}`} className="group flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-lagoon text-brass"><Mail /></span>
                  <span className="sweep break-all text-foam/85 group-hover:text-brass">{INFO.email}</span>
                </a>
              </li>
            </ul>

            {/* hours */}
            <div data-reveal style={{ ["--rd" as string]: "320ms" }} className="mt-10 rounded-2xl border border-foam/12 bg-deep/70 p-6">
              <p className="mb-4 flex items-center gap-2 font-semibold text-foam">
                <Clock className="h-5 w-5 text-brass" /> Orari della locanda
              </p>
              <ul className="space-y-2.5">
                {HOURS.map((h) => (
                  <li key={h.d} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-foam/70">{h.d}</span>
                    <span className={`leader opacity-40`} />
                    <span className={h.closed ? "font-semibold text-coral" : "font-medium text-foam"}>{h.h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* stylized harbor map */}
          <div data-reveal="right" className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-tide/60 bg-lagoon/40 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <svg viewBox="0 0 600 460" className="h-[420px] w-full" role="img" aria-label="Mappa stilizzata di San Giuliano Mare">
                <defs>
                  <pattern id="sea" width="60" height="22" patternUnits="userSpaceOnUse">
                    <path d="M0 11c10-7 20-7 30 0s20 7 30 0" fill="none" stroke="#5fa8c4" strokeWidth="1.4" opacity="0.6" />
                  </pattern>
                </defs>
                <rect width="600" height="460" fill="#cfe9f4" />
                {/* sea */}
                <path d="M0 250 C120 230 200 270 320 255 S520 235 600 258 V460 H0 Z" fill="url(#sea)" />
                <path d="M0 250 C120 230 200 270 320 255 S520 235 600 258" fill="none" stroke="#17806b" strokeWidth="2" opacity="0.7" />
                {/* land blocks */}
                <g fill="#f2f9fc" stroke="#a7cfdf" strokeWidth="1.5">
                  <rect x="40" y="40" width="150" height="90" rx="6" />
                  <rect x="220" y="60" width="120" height="70" rx="6" />
                  <rect x="380" y="40" width="170" height="110" rx="6" />
                  <rect x="60" y="160" width="220" height="60" rx="6" />
                </g>
                {/* roads */}
                <g stroke="#d9a441" strokeWidth="2.5" opacity="0.5" fill="none">
                  <path d="M0 145 H600" />
                  <path d="M205 0 V250" />
                  <path d="M360 150 V250" />
                </g>
                {/* bridge (Tiberio) */}
                <path d="M300 250 q20 -22 40 0 q20 -22 40 0" fill="none" stroke="#a9761a" strokeWidth="3" />
                <text x="310" y="238" fill="#a9761a" fontSize="11" fontFamily="Caveat" opacity="0.95">Ponte di Tiberio</text>
                {/* boat doodles */}
                <g stroke="#17806b" strokeWidth="1.6" fill="none" opacity="0.85">
                  <path d="M120 330 h34 l-8 12 h-18 Z M137 330 v-14 l12 14" />
                  <path d="M450 360 h30 l-7 10 h-16 Z M465 360 v-12 l10 12" />
                </g>
                {/* pin */}
                <g transform="translate(268 300)">
                  <circle r="26" fill="#e4572e" opacity="0.18">
                    <animate attributeName="r" values="14;34" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                  <path d="M0 6 C-12 -8 -14 -20 0 -28 C14 -20 12 -8 0 6Z" fill="#e4572e" />
                  <circle cy="-17" r="5" fill="#ffffff" />
                </g>
                <text x="268" y="330" textAnchor="middle" fill="#0f3a4d" fontSize="15" fontFamily="Caveat">Il Portolotto</text>
                {/* compass */}
                <g transform="translate(530 400)" stroke="#d9a441" fill="none" strokeWidth="1.6">
                  <circle r="22" opacity="0.7" />
                  <path d="M0 -16 L5 0 L0 16 L-5 0 Z" fill="#d9a441" opacity="0.9" stroke="none" />
                  <text y="-28" textAnchor="middle" fill="#d9a441" fontSize="12" stroke="none">N</text>
                </g>
              </svg>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="flex items-center gap-2 text-sm text-foam/70">
                  <Boat className="h-4 w-4 text-seafoam" /> {INFO.coords}
                </p>
                <a
                  href={INFO.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-abyss transition-all hover:bg-brasslight"
                >
                  Apri in Google Maps
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
            <Compass className="absolute -right-6 -top-8 h-20 w-20 animate-spin-slow text-brass/50" />
          </div>
        </div>

        {/* big CTA */}
        <div data-reveal="zoom" className="relative mt-20 overflow-hidden rounded-3xl border border-brass/30 bg-gradient-to-br from-lagoon via-deep to-abyss p-10 text-center lg:p-16">
          <div className="waveband absolute inset-x-0 top-0 opacity-70" />
          <p className="font-hand text-3xl text-coral">stasera si magna quel cù iè…</p>
          <h3 className="mx-auto mt-2 max-w-2xl font-display text-4xl font-semibold leading-tight text-foam sm:text-5xl">
            …ma quello che c'è, è <em className="text-brass">il meglio del mare</em>.
          </h3>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={INFO.phoneHref}
              className="group relative overflow-hidden rounded-full bg-brass px-10 py-4 text-lg font-semibold text-abyss transition-transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-3"><Phone className="h-5 w-5" /> {INFO.phone}</span>
              <span className="absolute inset-0 -translate-x-full bg-brasslight transition-transform duration-500 group-hover:translate-x-0" />
            </a>
            <a
              href={`mailto:${INFO.email}`}
              className="rounded-full border border-foam/30 px-10 py-4 text-lg font-semibold text-foam transition-all hover:-translate-y-1 hover:border-brass hover:text-brass"
            >
              Scrivici
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
