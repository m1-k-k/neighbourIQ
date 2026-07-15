import { Car, Route } from "lucide-react";
import { TrafficCongestionChart } from "@/components/charts/TrafficCongestionChart";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { ExplanationPopover } from "@/components/ui/ExplanationPopover";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { District, TrafficPrediction, TrafficReading } from "@/lib/types";

export function TrafficPanel({
  readings,
  predictions,
  stageKey,
  getDistrict,
}: {
  readings: TrafficReading[];
  predictions: Record<string, TrafficPrediction>;
  stageKey?: number;
  getDistrict: (id: string) => District;
}) {
  return (
    <div className="space-y-4">
      <Card key={`chart-${stageKey ?? 0}`} className="animate-soft-scale-in p-4">
        <TrafficCongestionChart readings={readings} getDistrict={getDistrict} />
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
                    <Car size={14} className="text-teal" /> {reading.roadName}
                  </p>
                  <p className="text-xs text-muted">{district.name}</p>
                </div>
                <RiskBadge level={prediction.level} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-ink/80">
                <div>
                  <dt className="text-muted">Congestion</dt>
                  <dd className="font-medium">{reading.congestionPct}%</dd>
                </div>
                <div>
                  <dt className="text-muted">Avg speed</dt>
                  <dd className="font-medium">{reading.avgSpeedKmh} km/h</dd>
                </div>
                <div>
                  <dt className="text-muted">Delay</dt>
                  <dd className="font-medium">{prediction.predictedDelayMin} min</dd>
                </div>
              </dl>
              {prediction.suggestedReroute && (
                <p className="mt-2 flex items-center gap-1.5 rounded-md bg-teal-muted px-2 py-1.5 text-xs font-medium text-ink">
                  <Route size={13} className="text-teal" /> {prediction.suggestedReroute}
                </p>
              )}
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
