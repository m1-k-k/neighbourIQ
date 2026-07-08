import { AlertOctagon, Landmark, MapPin, Timer } from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { DerivedScenario } from "@/lib/derived";
import { getDistrict } from "@/lib/town";
import { ScenarioSnapshot } from "@/lib/types";

export function SummaryCards({ snapshot, derived }: { snapshot: ScenarioSnapshot; derived: DerivedScenario }) {
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

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatTile
        label="Active alerts"
        value={snapshot.alerts.length}
        sub={snapshot.alerts.length === 0 ? "All clear" : "Since scenario start"}
        icon={AlertOctagon}
      />
      <StatTile
        label="Highest risk district"
        value={getDistrict(topRiskDistrictId).name}
        sub={`${combinedRiskByDistrict[topRiskDistrictId]} risk`}
        icon={MapPin}
      />
      <StatTile label="Peak predicted delay" value={`${maxDelay} min`} sub="Across all monitored roads" icon={Timer} />
      <StatTile
        label="#1 budget priority"
        value={getDistrict(topBudgetItem.districtId).name}
        sub={`Priority score ${topBudgetItem.priorityScore}/100`}
        icon={Landmark}
      />
    </div>
  );
}
