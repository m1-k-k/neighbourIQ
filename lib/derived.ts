import { getSnapshot, TOTAL_STAGES } from "./scenario";
import { DISTRICTS } from "./town";
import { computeBudgetPriorities, scoreFlood, scoreIncident, scoreTraffic } from "./scoring";
import { Prediction, RiskLevel, ScenarioSnapshot, TrafficPrediction } from "./types";

const LEVEL_RANK: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2, Severe: 3 };

function worstLevel(levels: RiskLevel[]): RiskLevel {
  return levels.reduce((worst, level) => (LEVEL_RANK[level] > LEVEL_RANK[worst] ? level : worst), "Low");
}

export interface DerivedScenario {
  floodPredictions: Record<string, Prediction>;
  trafficPredictions: Record<string, TrafficPrediction>;
  incidentPredictions: Record<string, Prediction>;
  budgetPriorities: ReturnType<typeof computeBudgetPriorities>;
  combinedRiskByDistrict: Record<string, RiskLevel>;
}

export function computeDerived(snapshot: ScenarioSnapshot): DerivedScenario {
  const floodPredictions: Record<string, Prediction> = {};
  for (const reading of snapshot.floodReadings) floodPredictions[reading.districtId] = scoreFlood(reading);

  const trafficPredictions: Record<string, TrafficPrediction> = {};
  for (const reading of snapshot.trafficReadings) trafficPredictions[reading.districtId] = scoreTraffic(reading);

  const incidentPredictions: Record<string, Prediction> = {};
  for (const reading of snapshot.incidentReadings) incidentPredictions[reading.districtId] = scoreIncident(reading);

  const budgetPriorities = computeBudgetPriorities(DISTRICTS, floodPredictions, trafficPredictions, incidentPredictions);

  const combinedRiskByDistrict: Record<string, RiskLevel> = {};
  for (const district of DISTRICTS) {
    combinedRiskByDistrict[district.id] = worstLevel([
      floodPredictions[district.id].level,
      trafficPredictions[district.id].level,
      incidentPredictions[district.id].level,
    ]);
  }

  return { floodPredictions, trafficPredictions, incidentPredictions, budgetPriorities, combinedRiskByDistrict };
}

const DERIVED_CACHE: DerivedScenario[] = Array.from({ length: TOTAL_STAGES }, (_, index) =>
  computeDerived(getSnapshot(index))
);

export function getDerived(stageIndex: number): DerivedScenario {
  const clampedStage = Math.max(0, Math.min(stageIndex, TOTAL_STAGES - 1));
  return DERIVED_CACHE[clampedStage];
}

export interface FloodTrendPoint {
  stage: string;
  score: number;
}

export function getFloodScoreTrend(stageIndex: number, districtId: string): FloodTrendPoint[] {
  const clampedStage = Math.max(0, Math.min(stageIndex, TOTAL_STAGES - 1));
  return FLOOD_TREND_CACHE[districtId].slice(0, clampedStage + 1);
}

const FLOOD_TREND_CACHE: Record<string, FloodTrendPoint[]> = Object.fromEntries(
  DISTRICTS.map((district) => [
    district.id,
    Array.from({ length: TOTAL_STAGES }, (_, index) => ({
      stage: getSnapshot(index).stage.label.split(" ")[0],
      score: DERIVED_CACHE[index].floodPredictions[district.id].score,
    })),
  ])
);
