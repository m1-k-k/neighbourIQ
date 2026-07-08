import { Car, Route } from "lucide-react";
import { TrafficCongestionChart } from "@/components/charts/TrafficCongestionChart";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { ExplanationPopover } from "@/components/ui/ExplanationPopover";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { getDistrict } from "@/lib/town";
import { TrafficPrediction, TrafficReading } from "@/lib/types";

export function TrafficPanel({
  readings,
  predictions,
}: {
  readings: TrafficReading[];
  predictions: Record<string, TrafficPrediction>;
}) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <TrafficCongestionChart readings={readings} />
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
                    <Car size={14} className="text-sky-600" /> {reading.roadName}
                  </p>
                  <p className="text-xs text-slate-500">{district.name}</p>
                </div>
                <RiskBadge level={prediction.level} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
                <div>
                  <dt className="text-slate-400">Congestion</dt>
                  <dd className="font-medium">{reading.congestionPct}%</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Avg speed</dt>
                  <dd className="font-medium">{reading.avgSpeedKmh} km/h</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Delay</dt>
                  <dd className="font-medium">{prediction.predictedDelayMin} min</dd>
                </div>
              </dl>
              {prediction.suggestedReroute && (
                <p className="mt-2 flex items-center gap-1.5 rounded-md bg-sky-50 px-2 py-1.5 text-xs font-medium text-sky-800">
                  <Route size={13} /> {prediction.suggestedReroute}
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
