import { TIMELINE, REAL_PHOTOS } from "../data";
import { Compass, Quote } from "./Icons";

export default function Storia() {
  return (
    <section id="storia" className="relative overflow-hidden bg-abyss py-24 lg:py-32">
      <Compass className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 animate-spin-slow text-lagoon/30" />
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-tide/15 blur-[110px]" />

      <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-10">
        {/* sticky intro */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p data-reveal className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-brass">
            <span className="h-px w-10 bg-brass" /> Foto-Storia
          </p>
          <h2 data-reveal style={{ ["--rd" as string]: "80ms" }} className="font-display text-4xl font-semibold leading-tight text-foam sm:text-5xl lg:text-6xl">
            Una lingua morta che <em className="text-brass">sa di mare</em>.
          </h2>
          <p data-reveal style={{ ["--rd" as string]: "160ms" }} className="mt-6 max-w-lg text-lg leading-relaxed text-foam/70">
            Ancora agli inizi del secolo scorso, i vecchi marinai riminesi parlavano una lingua a
            sé, senza nessun rapporto col dialetto riminese: il Portolotto, dialetto veneto
            imparentato col chioggiotto. I marinai riminesi si intendevano meglio con quelli
            dell'isola di Veglia che con i contadini di San Vito, a tremila metri in linea d'aria.
          </p>

          <figure data-reveal style={{ ["--rd" as string]: "240ms" }} className="mt-10 border-l-4 border-brass pl-6">
            <Quote className="h-8 w-8 text-ember" />
            <blockquote className="mt-3 font-hand text-3xl leading-snug text-foam">
              «Da nun us magna quel cù iè!»
            </blockquote>
            <figcaption className="mt-2 text-sm text-foam/55">
              — dal cartello all'ingresso della locanda: qui non ci si accontenta.
            </figcaption>
          </figure>

          <div
            data-reveal
            style={{ ["--rd" as string]: "320ms" }}
            className="mt-10 inline-block rotate-2 rounded-sm border-8 border-white bg-white shadow-[0_18px_45px_rgba(15,58,77,0.25)] transition-transform duration-500 hover:rotate-0"
          >
            <img
              src={REAL_PHOTOS[4].src}
              alt="I portolotti di San Giuliano, una foto di famiglia"
              loading="lazy"
              decoding="async"
              className="h-44 w-60 bg-[#bfe0ec] object-cover sm:h-52 sm:w-72"
            />
            <p className="px-1 pt-2 text-center font-hand text-xl text-[#2b1c0e]">i portolotti · amici di una vita</p>
          </div>
        </div>

        {/* timeline */}
        <div className="relative">
          <div className="absolute bottom-0 left-[11px] top-2 w-px bg-gradient-to-b from-brass/70 via-tide to-transparent sm:left-[13px]" />
          <ol className="space-y-12">
            {TIMELINE.map((t, i) => (
              <li
                key={t.year}
                data-reveal={i % 2 ? "right" : "left"}
                style={{ ["--rd" as string]: `${(i % 3) * 90}ms` }}
                className="relative pl-12 sm:pl-16"
              >
                <span className="absolute left-0 top-1 grid h-6 w-6 place-items-center sm:h-7 sm:w-7">
                  <span className="absolute h-full w-full rounded-full bg-brass/25 animate-pulse-ring" />
                  <span className="relative h-3 w-3 rounded-full border-2 border-brass bg-abyss" />
                </span>
                <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-coral">{t.year}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-foam">{t.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-foam/65">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
