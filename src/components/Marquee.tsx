import { PHRASES } from "../data";
import { Anchor } from "./Icons";

export default function Marquee() {
  const row = [...PHRASES, ...PHRASES];
  return (
    <div className="relative border-y border-brass/25 bg-deep py-5">
      <div className="rope absolute -top-[3px] left-0 right-0 opacity-70" />
      <div className="marquee-track overflow-hidden">
        <div className="marquee-inner flex w-max animate-marquee items-center gap-10 pr-10">
          {row.map((ph, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-hand text-2xl text-brass">{ph.p}</span>
              <span className="text-xs uppercase tracking-[0.22em] text-foam/45">{ph.t}</span>
              <Anchor className="h-4 w-4 text-coral/70" />
            </span>
          ))}
        </div>
      </div>
      <div className="rope absolute -bottom-[3px] left-0 right-0 opacity-70" />
    </div>
  );
}
