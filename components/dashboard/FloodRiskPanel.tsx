"use client";

import { useMemo } from "react";
import { Droplets } from "lucide-react";
import { RiskTrendChart } from "@/components/charts/RiskTrendChart";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { ExplanationPopover } from "@/components/ui/ExplanationPopover";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { getDistrict } from "@/lib/town";
import { FloodReading, Prediction } from "@/lib/types";

export function FloodRiskPanel({
  readings,
  predictions,
}: {
  readings: FloodReading[];
  predictions: Record<string, Prediction>;
}) {
  const topDistrictId = useMemo(
    () =>
      readings.reduce((top, reading) =>
        predictions[reading.districtId].score > predictions[top.districtId].score ? reading : top
      ).districtId,
    [readings, predictions]
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <RiskTrendChart focusDistrictId={topDistrictId} />
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {readings.map((reading) => {
          const district = getDistrict(reading.districtId);
          const prediction = predictions[reading.districtId];
          return (
            <Card key={reading.districtId} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <Droplets size={14} className="text-sky-600" /> {district.name}
                  </p>
                  <p className="text-xs text-slate-500">{district.tagline}</p>
                </div>
                <RiskBadge level={prediction.level} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
                <div>
                  <dt className="text-slate-400">River level</dt>
                  <dd className="font-medium">{reading.riverLevelM.toFixed(1)}m</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Rainfall 24h</dt>
                  <dd className="font-medium">{reading.rainfall24hMm}mm</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Drainage</dt>
                  <dd className="font-medium">{reading.drainageCapacityPct}%</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center justify-between">
                <ConfidenceBadge confidencePct={prediction.confidencePct} />
                <ExplanationPopover explanation={prediction.explanation} factors={prediction.factors} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
