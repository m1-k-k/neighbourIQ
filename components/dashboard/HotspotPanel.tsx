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
  stageKey,
}: {
  readings: IncidentReading[];
  predictions: Record<string, Prediction>;
  stageKey?: number;
}) {
  return (
    <div className="space-y-4">
      <Card key={`chart-${stageKey ?? 0}`} className="animate-soft-scale-in p-4">
        <IncidentTrendChart predictions={predictions} />
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
                    <AlertTriangle size={14} className="text-teal" /> {district.name}
                  </p>
                  <p className="text-xs text-muted">{reading.category}</p>
                </div>
                <RiskBadge level={prediction.level} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink/80">
                <div>
                  <dt className="text-muted">Reports (3h)</dt>
                  <dd className="font-medium">{reading.recentReportCount}</dd>
                </div>
                <div>
                  <dt className="text-muted">Trend</dt>
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
