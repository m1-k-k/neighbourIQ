"use client";

import dynamic from "next/dynamic";
import { RISK_FILL_COLORS } from "@/lib/riskColors";
import { District, RiskLevel } from "@/lib/types";

// Leaflet touches `window` at import time, so it must be a client-only dynamic import.
const LiveMapCanvas = dynamic(() => import("./LiveMapCanvas").then((m) => m.LiveMapCanvas), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] w-full items-center justify-center rounded-xl bg-mist text-sm text-muted">
      Loading map…
    </div>
  ),
});

const LEGEND: RiskLevel[] = ["Low", "Medium", "High", "Severe"];

export function LiveMap({
  place,
  districts,
  combinedRiskByDistrict,
}: {
  place: { label: string; lat: number; lon: number };
  districts: District[];
  combinedRiskByDistrict: Record<string, RiskLevel>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">{place.label} risk map</h2>
        <p className="min-w-0 shrink text-xs text-muted">Live conditions across 6 sample points</p>
      </div>
      <LiveMapCanvas center={place} districts={districts} combinedRiskByDistrict={combinedRiskByDistrict} />
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="font-semibold text-ink/70">Risk legend:</span>
        {LEGEND.map((level) => (
          <span key={level} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RISK_FILL_COLORS[level] }} />
            {level}
          </span>
        ))}
      </div>
    </div>
  );
}
