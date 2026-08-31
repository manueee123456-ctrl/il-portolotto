import { INFO } from "../data";
import { Wheel, Anchor, ArrowDown } from "./Icons";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-abyss pt-20">
      <div className="rope absolute left-0 right-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="grid gap-12 pb-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-brass/50 bg-lagoon/60 text-brass">
                <Wheel className="h-6 w-6" />
              </span>
              <span className="font-display text-2xl font-semibold text-foam">Il Portolotto</span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-foam/55">
              Locanda di pesce a San Giuliano Mare. Prodotti di stagione cucinati in modo semplice e
              genuino: ogni mese ha le sue primizie. Scopri con noi il gusto delle stagioni.
            </p>
            <p className="mt-6 font-hand text-2xl text-brass">La Smorfia: 22 — i pazzi</p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-brass">Rotta</p>
            <ul className="space-y-3 text-sm">
              {[
                ["#locanda", "La Locanda"],
                ["#piatti", "I Piatti"],
                ["#menu", "Menù del giorno"],
                ["#storia", "La lingua portolotta"],
                ["#recensioni", "Recensioni"],
                ["#contatti", "Dove siamo"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="sweep text-foam/70 transition-colors hover:text-brass">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-brass">Ormeggio</p>
            <ul className="space-y-3 text-sm text-foam/70">
              <li>{INFO.address}</li>
              <li><a className="sweep hover:text-brass" href={INFO.phoneHref}>{INFO.phone}</a></li>
              <li><a className="sweep break-all hover:text-brass" href={`mailto:${INFO.email}`}>{INFO.email}</a></li>
              <li className="text-foam/45">{INFO.coords}</li>
            </ul>
          </div>
        </div>

        {/* giant wordmark */}
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display text-[14vw] font-bold leading-none text-stroke opacity-40 lg:text-[11rem]"
        >
          Portolotto
        </p>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-foam/10 py-6 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-foam/45">
            <Anchor className="h-4 w-4 text-brass/60" />
            © {new Date().getFullYear()} Il Portolotto · San Giuliano Mare, Rimini
          </p>
          <a
            href="#top"
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foam/55 transition-colors hover:text-brass"
          >
            Torna a prua
            <span className="grid h-8 w-8 place-items-center rounded-full border border-foam/25 transition-all group-hover:-translate-y-1 group-hover:border-brass">
              <ArrowDown className="h-4 w-4 rotate-180" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
