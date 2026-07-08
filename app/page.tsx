import { ArrowRight, CloudRain, Landmark, MapPin, ShieldCheck, TrafficCone } from "lucide-react";
import Link from "next/link";
import { TOWN_NAME } from "@/lib/town";

const FEATURES = [
  { icon: CloudRain, label: "Flood risk prediction" },
  { icon: TrafficCone, label: "Traffic prediction & reroutes" },
  { icon: MapPin, label: "Council attention hotspots" },
  { icon: ShieldCheck, label: "Vulnerable resident alerts" },
  { icon: Landmark, label: "Budget prioritisation" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-slate-100 px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
          <ShieldCheck size={14} /> NeighbourIQ · AI Community Guardian
        </span>
        <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          Every day, councils spend millions reacting to problems after they happen.
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          We asked a different question:{" "}
          <span className="font-semibold text-slate-900">
            what if AI could stop those problems before they even begin?
          </span>{" "}
          That&apos;s why we created NeighbourIQ.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 shadow-sm"
            >
              <Icon size={16} className="shrink-0 text-sky-600" /> {label}
            </div>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-sky-700"
        >
          Launch {TOWN_NAME} Council Dashboard <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
