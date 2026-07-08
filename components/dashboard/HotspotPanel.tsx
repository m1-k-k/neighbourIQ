import { AlertTriangle } from "lucide-react";
import { IncidentTrendChart } from "@/components/charts/IncidentTrendChart";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { ExplanationPopover } from "@/components/ui/ExplanationPopover";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { getDistrict } from "@/lib/town";
import { IncidentReading, Prediction } from "@/lib/types";

export function HotspotPanel({
  readings,
  predictions,
}: {
  readings: IncidentReading[];
  predictions: Record<string, Prediction>;
}) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <IncidentTrendChart predictions={predictions} />
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
                    <AlertTriangle size={14} className="text-sky-600" /> {district.name}
                  </p>
                  <p className="text-xs text-slate-500">{reading.category}</p>
                </div>
                <RiskBadge level={prediction.level} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <dt className="text-slate-400">Reports (3h)</dt>
                  <dd className="font-medium">{reading.recentReportCount}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Trend</dt>
                  <dd className="font-medium capitalize">{reading.trendDirection}</dd>
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
