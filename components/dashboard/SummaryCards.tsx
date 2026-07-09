import { AlertOctagon, Landmark, MapPin, Timer } from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { DerivedScenario } from "@/lib/derived";
import { getDistrict } from "@/lib/town";
import { ScenarioSnapshot } from "@/lib/types";

export function SummaryCards({
  snapshot,
  derived,
  stageKey,
}: {
  snapshot: ScenarioSnapshot;
  derived: DerivedScenario;
  stageKey?: number;
}) {
  const { floodPredictions, trafficPredictions, incidentPredictions, budgetPriorities, combinedRiskByDistrict } = derived;

  const districtIds = Object.keys(combinedRiskByDistrict);
  let topRiskDistrictId = districtIds[0];
  let topScore = -1;
  for (const id of districtIds) {
    const score = Math.max(floodPredictions[id].score, trafficPredictions[id].score, incidentPredictions[id].score);
    if (score > topScore) {
      topScore = score;
      topRiskDistrictId = id;
    }
  }

  const maxDelay = Math.max(...Object.values(trafficPredictions).map((p) => p.predictedDelayMin));
  const topBudgetItem = budgetPriorities[0];

  const tiles = [
    {
      label: "Active alerts",
      value: snapshot.alerts.length,
      sub: snapshot.alerts.length === 0 ? "All clear" : "Since scenario start",
      icon: AlertOctagon,
    },
    {
      label: "Highest risk district",
      value: getDistrict(topRiskDistrictId).name,
      sub: `${combinedRiskByDistrict[topRiskDistrictId]} risk`,
      icon: MapPin,
    },
    {
      label: "Peak predicted delay",
      value: `${maxDelay} min`,
      sub: "Across all monitored roads",
      icon: Timer,
    },
    {
      label: "#1 budget priority",
      value: getDistrict(topBudgetItem.districtId).name,
      sub: `Priority score ${topBudgetItem.priorityScore}/100`,
      icon: Landmark,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((tile, i) => (
        <div
          key={`${tile.label}-${stageKey ?? 0}`}
          className="animate-soft-scale-in"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <StatTile label={tile.label} value={tile.value} sub={tile.sub} icon={tile.icon} />
        </div>
      ))}
    </div>
  );
}
