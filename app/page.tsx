import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { TOWN_NAME } from "@/lib/town";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-civic-ink text-white">
      {/* Full-bleed Millhaven map silhouette */}
      <svg
        className="animate-map-drift animate-ambient-breathe pointer-events-none absolute inset-[-4%] h-[108%] w-[108%] text-white"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <rect x="40" y="60" width="220" height="160" rx="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="280" y="40" width="200" height="140" rx="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="500" y="70" width="240" height="180" rx="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="60" y="250" width="260" height="170" rx="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="350" y="220" width="200" height="160" rx="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="580" y="280" width="180" height="150" rx="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M 0 520 C 150 480, 250 550, 400 515 C 520 488, 600 545, 800 505 L 800 600 L 0 600 Z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-3xl">
          <p className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            NeighbourIQ
          </p>
          <p className="animate-fade-up-delay-1 mt-2 text-sm font-medium uppercase tracking-[0.2em] text-teal-bright">
            AI Community Guardian
          </p>

          <h1 className="animate-fade-up-delay-1 mt-8 max-w-2xl font-display text-2xl font-medium leading-snug text-white/95 sm:text-3xl md:text-[2.15rem]">
            Councils spend millions reacting after the damage is done.
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            NeighbourIQ predicts flood, traffic, and incident risk across {TOWN_NAME} — so you can protect people
            before crises escalate.
          </p>

          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="hover-lift inline-flex items-center gap-2 rounded-lg bg-amber px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-amber/20 hover:shadow-xl hover:shadow-amber/30"
            >
              Launch {TOWN_NAME} live demo <ArrowRight size={16} />
            </Link>
            <Link
              href="/resident"
              className="hover-lift inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
            >
              <Users size={16} /> Resident view
            </Link>
          </div>

          <p className="animate-fade-up-delay-3 mt-5 text-xs text-white/45">
            Transparent rules engine — every prediction explains itself. Not a black box.
          </p>
        </div>
      </div>

      <section className="relative z-10 border-t border-white/10 bg-black/20 px-6 py-10 backdrop-blur-sm sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {[
            { title: "See it coming", body: "Flood, congestion, and hotspot risk scored live across six districts." },
            { title: "Act in time", body: "Budget priorities and reroutes surface before the emergency call." },
            { title: "Protect people", body: "Vulnerable residents get personalised alerts when risk spikes." },
          ].map((item, i) => (
            <div
              key={item.title}
              className="animate-fade-up-delay-4"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <h2 className="font-display text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
