import { useState } from "react";
import { MENU } from "../data";
import { WheatOff, Flame, Clock } from "./Icons";

const TAGS: Record<string, { icon: typeof Flame; label: string; cls: string }> = {
  gf: { icon: WheatOff, label: "senza glutine su richiesta", cls: "text-lagoon" },
  top: { icon: Flame, label: "il più chiesto", cls: "text-ember" },
  day: { icon: Clock, label: "secondo il pescato", cls: "text-tide" },
};

export default function MenuSection() {
  const [active, setActive] = useState(MENU[0].id);
  const cat = MENU.find((c) => c.id === active) ?? MENU[0];

  return (
    <section id="menu" className="paper relative py-24 text-[#2b1c0e] lg:py-32">
      {/* torn top edge */}
      <div className="absolute -top-px left-0 right-0 h-4 bg-ink [clip-path:polygon(0_0,100%_0,100%_30%,97%_70%,94%_35%,90%_75%,86%_40%,82%_80%,78%_38%,74%_72%,70%_42%,66%_78%,62%_36%,58%_74%,54%_40%,50%_80%,46%_38%,42%_76%,38%_42%,34%_78%,30%_36%,26%_72%,22%_40%,18%_78%,14%_38%,10%_74%,6%_40%,3%_72%,0_35%)]" />

      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div data-reveal>
            <p className="font-hand text-3xl text-ember">alla carta, come in banchina</p>
            <h2 className="mt-1 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
              Menù del giorno
            </h2>
          </div>
          <p data-reveal style={{ ["--rd" as string]: "120ms" }} className="max-w-xs text-sm leading-relaxed text-[#5b4326]">
            Le pietanze seguono il mercato: quello che il mare dà, la cucina lo racconta.
          </p>
        </div>

        {/* tabs */}
        <div data-reveal className="mt-10 flex flex-wrap gap-3">
          {MENU.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`rounded-full px-6 py-3 font-display text-lg font-semibold transition-all duration-300 ${
                active === c.id
                  ? "bg-[#2b1c0e] text-[#f3ecdd] shadow-[0_10px_28px_rgba(43,28,14,0.35)]"
                  : "border border-[#2b1c0e]/30 text-[#2b1c0e] hover:border-[#2b1c0e] hover:-translate-y-0.5"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* items */}
        <div key={cat.id} className="mt-12 grid gap-x-14 gap-y-9 lg:grid-cols-2">
          {cat.items.map((it, i) => (
            <div
              key={it.name}
              className="item-in group"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-baseline">
                <h3 className="font-display text-xl font-semibold leading-snug transition-colors group-hover:text-ember">
                  {it.name}
                </h3>
                <span className="leader" />
                <span className="whitespace-nowrap font-display text-xl font-bold text-[#8a5a1d]">
                  {it.price.includes("/") ? it.price : `${it.price} €`}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#5b4326]">{it.desc}</p>
              {it.en && <p className="mt-0.5 text-xs italic text-[#8a7150]">{it.en}</p>}
              {it.tags && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {it.tags.map((t) => {
                    const tag = TAGS[t];
                    if (!tag) return null;
                    return (
                      <span key={t} className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${tag.cls}`}>
                        <tag.icon className="h-3.5 w-3.5" />
                        {tag.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* footnotes */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t-2 border-dashed border-[#2b1c0e]/25 pt-6">
          <p className="max-w-lg text-xs leading-relaxed text-[#6b5334]">
            * Secondo disponibilità. Le pietanze possono essere composte con alimenti congelati o
            surgelati all'origine. Per informazioni chiedere al gestore prima dell'ordinazione.
          </p>
          <p className="-rotate-2 font-hand text-3xl text-ember">chiedi il fuori menù al cameriere!</p>
        </div>
      </div>

      {/* torn bottom edge */}
      <div className="absolute -bottom-px left-0 right-0 h-4 bg-ink [clip-path:polygon(0_100%,100%_100%,100%_70%,97%_30%,94%_65%,90%_25%,86%_60%,82%_20%,78%_62%,74%_28%,70%_58%,66%_22%,62%_64%,58%_26%,54%_60%,50%_20%,46%_62%,42%_24%,38%_58%,34%_22%,30%_64%,26%_28%,22%_60%,18%_22%,14%_62%,10%_26%,6%_60%,3%_28%,0_65%)]" />
    </section>
  );
}
