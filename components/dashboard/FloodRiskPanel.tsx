"use client";

import { ReactNode, useMemo } from "react";
import { Droplets } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { ExplanationPopover } from "@/components/ui/ExplanationPopover";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { District, FloodReading, Prediction } from "@/lib/types";

export function FloodRiskPanel({
  readings,
  predictions,
  stageKey,
  getDistrict,
  renderTrendChart,
}: {
  readings: FloodReading[];
  predictions: Record<string, Prediction>;
  stageKey?: number;
  getDistrict: (id: string) => District;
  renderTrendChart: (focusDistrictId: string) => ReactNode;
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
      <Card key={`chart-${stageKey ?? 0}`} className="animate-soft-scale-in p-4">
        {renderTrendChart(topDistrictId)}
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {readings.map((reading, i) => {
          const district = getDistrict(reading.districtId);
          const prediction = predictions[reading.districtId];
          return (
            <Card
              key={`${reading.districtId}-${stageKey ?? 0}`}
              className="animate-soft-scale-in p-4"
              style={{ animationDelay: `${80 + i * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <Droplets size={14} className="text-teal" /> {district.name}
                  </p>
                  <p className="text-xs text-muted">{district.tagline}</p>
                </div>
                <RiskBadge level={prediction.level} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-ink/80">
                <div>
                  <dt className="text-muted">River level</dt>
                  <dd className="font-medium">{reading.riverLevelM.toFixed(1)}m</dd>
                </div>
                <div>
                  <dt className="text-muted">Rainfall 24h</dt>
                  <dd className="font-medium">{reading.rainfall24hMm}mm</dd>
                </div>
                <div>
                  <dt className="text-muted">{reading.floodWarningSeverity !== undefined ? "Flood warning" : "Drainage"}</dt>
                  <dd className="font-medium">
                    {reading.floodWarningSeverity !== undefined
                      ? reading.floodWarningSeverity <= 2
                        ? "Active"
                        : "None"
                      : `${reading.drainageCapacityPct}%`}
                  </dd>
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
