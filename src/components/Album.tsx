import { REAL_PHOTOS } from "../data";

export default function Album() {
  const row = [...REAL_PHOTOS, ...REAL_PHOTOS];

  return (
    <section className="relative overflow-hidden bg-abyss py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p data-reveal className="mb-3 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-brass">
              <span className="h-px w-10 bg-brass" /> Dal vero
            </p>
            <h2 data-reveal style={{ ["--rd" as string]: "80ms" }} className="font-display text-3xl font-semibold text-foam sm:text-4xl">
              Le foto della locanda, <em className="text-brass">nessun filtro</em>.
            </h2>
          </div>
          <p data-reveal style={{ ["--rd" as string]: "160ms" }} className="font-hand text-2xl text-coral">
            scattate tra i tavoli, come le vedi tu →
          </p>
        </div>
      </div>

      <div className="marquee-track mt-10 overflow-hidden">
        <div className="marquee-inner flex w-max animate-marquee items-center gap-8 pr-8">
          {row.map((ph, i) => (
            <figure
              key={i}
              className={`group w-[280px] shrink-0 rounded-md border-[10px] border-white bg-white shadow-[0_18px_50px_rgba(15,58,77,0.25)] transition-all duration-500 hover:z-10 hover:rotate-0 hover:scale-[1.06] sm:w-[330px] ${
                i % 2 ? "rotate-2" : "-rotate-2"
              }`}
            >
              <div className="relative h-[210px] overflow-hidden bg-[#bfe0ec] sm:h-[240px]">
                <img
                  src={ph.src}
                  alt={ph.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between px-2 py-2">
                <span className="font-hand text-xl text-[#2b1c0e]">{ph.cap}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7150]">
                  Il Portolotto
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
