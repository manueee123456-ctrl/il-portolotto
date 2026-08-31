import { INFO, REAL_PHOTOS } from "../data";
import { useCountUp } from "../hooks";
import { Fish, Boat, WheatOff, Wheel } from "./Icons";

function Stat({ value, suffix, label, decimals = 0, delay }: { value: number; suffix?: string; label: string; decimals?: number; delay?: string }) {
  const { ref, val } = useCountUp(value, 1700, decimals);
  return (
    <div data-reveal style={{ ["--rd" as string]: delay }}>
      <p className="font-display text-5xl font-semibold text-brass lg:text-6xl">
        <span ref={ref}>{decimals ? val.toLocaleString("it-IT", { minimumFractionDigits: decimals }) : val.toLocaleString("it-IT")}</span>
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-foam/55">{label}</p>
    </div>
  );
}

const FEATURES = [
  { icon: Fish, t: "Pesce di stagione", d: "Ogni mese le sue primizie, dal banco del mercato coperto." },
  { icon: Boat, t: "Il tavolo nella barca", d: "Si cena dentro lo scafo di un vecchio peschereccio." },
  { icon: WheatOff, t: "Opzioni senza glutine", d: "Piadina e pane dedicati, su richiesta." },
  { icon: Wheel, t: "Trattoria vera", d: "Tovagliette di carta, vimini e marmo: niente fronzoli." },
];

export default function Locanda() {
  return (
    <section id="locanda" className="relative overflow-hidden bg-deep py-24 lg:py-32">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-tide/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-ember/10 blur-[110px]" />

      <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* left: copy + stats */}
        <div>
          <p data-reveal className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-brass">
            <span className="h-px w-10 bg-brass" /> La Locanda
          </p>
          <h2 data-reveal style={{ ["--rd" as string]: "80ms" }} className="font-display text-4xl font-semibold leading-tight text-foam sm:text-5xl lg:text-6xl">
            L'abitante del porto, <em className="text-brass">a tavola</em>.
          </h2>
          <p data-reveal style={{ ["--rd" as string]: "160ms" }} className="mt-6 max-w-xl text-lg leading-relaxed text-foam/75">
            Il Portolotto era la lingua antica di San Giuliano: fino al 1920 univa gli abitanti del
            porto riminese a quello veneziano, per gli scambi commerciali. Qui la parliamo ancora —
            ma con le posate. Prodotti di stagione cucinati in modo semplice e genuino: carne, pesce,
            frutta e verdura. Scopri con noi il gusto delle stagioni.
          </p>

          <div data-reveal style={{ ["--rd" as string]: "220ms" }} className="mt-8 grid grid-cols-2 gap-6 border-t border-foam/10 pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Stat value={4.3} decimals={1} label="Valutazione media" />
            <Stat value={1501} label="Recensioni" delay="90ms" />
            <Stat value={22} label="La Smorfia · i pazzi" delay="180ms" />
            <Stat value={100} suffix="%" label="Pesce di stagione" delay="270ms" />
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <li
                key={f.t}
                data-reveal
                style={{ ["--rd" as string]: `${i * 90}ms` }}
                className="group flex gap-4 rounded-xl border border-foam/10 bg-ink/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brass/40"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lagoon text-brass transition-transform duration-500 group-hover:rotate-12">
                  <f.icon className="h-5 w-5" />
                </span>
                <span>
                  <strong className="block font-semibold text-foam">{f.t}</strong>
                  <span className="mt-1 block text-sm leading-snug text-foam/60">{f.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* right: photo collage */}
        <div className="relative">
          <div data-reveal="right" className="tilt relative overflow-hidden rounded-2xl border border-brass/25 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <img
              src={REAL_PHOTOS[0].src}
              alt="L'interno della locanda: lampadari di vimini e stampe marinare"
              loading="lazy"
              decoding="async"
              className="h-[520px] w-full bg-[#bfe0ec] object-cover [transition:transform_1.6s_ease] hover:scale-105 lg:h-[600px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-5 font-hand text-2xl text-foam/90">
              «arredamento sovraccarico, ma tipico»
            </p>
          </div>

          <div
            data-reveal="zoom"
            style={{ ["--rd" as string]: "220ms" }}
            className="absolute -bottom-10 -left-6 w-44 rotate-[-6deg] overflow-hidden rounded-lg border-4 border-white shadow-[0_20px_50px_rgba(15,58,77,0.3)] transition-transform duration-500 hover:rotate-0 hover:scale-105 sm:w-56"
          >
            <img src={REAL_PHOTOS[3].src} alt="Il tavolo ricavato da una barca, di sera" loading="lazy" decoding="async" className="h-36 w-full bg-[#bfe0ec] object-cover sm:h-44" />
          </div>

          <div className="absolute -right-3 -top-6 rotate-3 rounded-full border border-brass/40 bg-white/90 px-5 py-3 shadow-lg">
            <p className="font-hand text-xl text-brass">{INFO.quarter}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
