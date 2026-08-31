import { useState } from "react";
import { INFO } from "../data";
import { useScrollProgress, useScrolled } from "../hooks";
import { Wheel, Phone, Burger, Close } from "./Icons";

const LINKS = [
  { href: "#locanda", label: "La Locanda" },
  { href: "#piatti", label: "I Piatti" },
  { href: "#menu", label: "Menù" },
  { href: "#storia", label: "La Lingua" },
  { href: "#recensioni", label: "Recensioni" },
  { href: "#contatti", label: "Dove Siamo" },
];

export default function Nav() {
  const progress = useScrollProgress();
  const scrolled = useScrolled(60);
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-abyss/95 shadow-[0_10px_40px_rgba(15,58,77,0.12)]" : "bg-transparent"
        }`}
      >
        {/* scroll progress */}
        <div
          className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-brass via-coral to-brass transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a href="#top" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-brass/50 bg-lagoon/60 text-brass transition-transform duration-500 group-hover:rotate-[40deg]">
              <Wheel className="h-6 w-6" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl font-semibold tracking-tight text-foam">
                Il Portolotto
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.32em] text-brass">
                Locanda di pesce
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="sweep text-[13px] font-medium uppercase tracking-[0.14em] text-foam/80 transition-colors hover:text-brass"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={INFO.phoneHref}
              className="group hidden items-center gap-2 rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-abyss transition-all duration-300 hover:bg-brasslight hover:shadow-[0_0_28px_rgba(217,164,65,0.45)] sm:flex"
            >
              <Phone className="h-4 w-4 transition-transform group-hover:-rotate-12" />
              Prenota · {INFO.phone}
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Apri il menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-foam/25 text-foam transition-colors hover:border-brass hover:text-brass lg:hidden"
            >
              {open ? <Close /> : <Burger />}
            </button>
          </div>
        </nav>
      </header>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-abyss px-8 transition-all duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="space-y-5">
          {LINKS.map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: `${i * 60}ms` }}
              className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl font-medium text-foam transition-colors hover:text-brass"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={INFO.phoneHref}
          className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-brass px-6 py-3 font-semibold text-abyss"
        >
          <Phone className="h-4 w-4" /> {INFO.phone}
        </a>
      </div>
    </>
  );
}
