import { useEffect, useState } from "react";
import { useRevealObserver } from "./hooks";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Locanda from "./components/Locanda";
import Dishes from "./components/Dishes";
import Album from "./components/Album";
import MenuSection from "./components/MenuSection";
import Storia from "./components/Storia";
import Recensioni from "./components/Recensioni";
import Contatti from "./components/Contatti";
import Footer from "./components/Footer";
import { Wheel } from "./components/Icons";

function Preloader() {
  const [phase, setPhase] = useState<"loading" | "done" | "gone">("loading");

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => setPhase("gone"), 900);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-abyss transition-all duration-700 ${
        phase === "done" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-5">
        <span className="grid h-16 w-16 animate-spin-slow place-items-center rounded-full border border-brass/50 text-brass">
          <Wheel className="h-8 w-8" />
        </span>
        <p className="font-display text-2xl font-semibold tracking-tight text-foam">
          Il <span className="text-brass">Portolotto</span>
        </p>
        <div className="waveband w-40 opacity-80" />
        <p className="font-hand text-lg text-foam/50">si salpa…</p>
      </div>
    </div>
  );
}

export default function App() {
  useRevealObserver();

  return (
    <div className="grain relative bg-abyss text-foam">
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Locanda />
        <Dishes />
        <Album />
        <MenuSection />
        <Storia />
        <Recensioni />
        <Contatti />
      </main>
      <Footer />
    </div>
  );
}
