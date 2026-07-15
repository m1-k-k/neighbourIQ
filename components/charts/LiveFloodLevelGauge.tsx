"use client";

import { District, FloodReading } from "@/lib/types";

export function LiveFloodLevelGauge({ reading, district }: { reading: FloodReading; district: District }) {
  const hasRange =
    reading.stageTypicalHigh !== undefined && reading.stageTypicalLow !== undefined && reading.stageTypicalHigh > reading.stageTypicalLow;
  const pct = hasRange
    ? Math.min(100, Math.max(0, ((reading.riverLevelM - reading.stageTypicalLow!) / (reading.stageTypicalHigh! - reading.stageTypicalLow!)) * 100))
    : null;

  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-muted">Nearest river level — {district.name}</p>
      <div className="rounded-lg border border-border bg-mist p-4">
        <p className="font-display text-2xl font-semibold text-ink">{reading.riverLevelM.toFixed(2)}m</p>
        <p className="mt-1 text-xs capitalize text-muted">{reading.trend}</p>
        {pct !== null ? (
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60">
            <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${pct}%` }} />
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted">No typical-range data available for the nearest station.</p>
        )}
      </div>
    </div>
  );
}
