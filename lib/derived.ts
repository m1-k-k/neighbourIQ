import { getSnapshot, TOTAL_STAGES } from "./scenario";
import { DISTRICTS } from "./town";
import { computeBudgetPriorities, scoreFlood, scoreIncident, scoreTraffic } from "./scoring";
import { District, FloodReading, IncidentReading, Prediction, RiskLevel, TrafficPrediction, TrafficReading } from "./types";

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

interface ReadingsSource {
  floodReadings: FloodReading[];
  trafficReadings: TrafficReading[];
  incidentReadings: IncidentReading[];
}

// Live mode's generated sectors have no REROUTE_SUGGESTIONS entry in scoring.ts (that map only
// covers the demo's 3 fixed district ids), so scoreTraffic naturally returns null for them —
// this fills that gap by suggesting whichever sector currently has the lowest congestion.
function applyLiveRerouteSuggestions(readings: TrafficReading[], districts: District[], predictions: Record<string, TrafficPrediction>): void {
  if (readings.length === 0) return;
  const byId = new Map(districts.map((d) => [d.id, d]));
  const leastCongested = [...readings].sort((a, b) => a.congestionPct - b.congestionPct)[0];
  for (const reading of readings) {
    const prediction = predictions[reading.districtId];
    if (prediction.suggestedReroute !== null) continue;
    if ((prediction.level !== "High" && prediction.level !== "Severe") || reading.districtId === leastCongested.districtId) continue;
    const altDistrict = byId.get(leastCongested.districtId);
    if (altDistrict) prediction.suggestedReroute = `Congestion is lower via the ${altDistrict.name} approach — consider that route`;
  }
}

export function computeDerived(snapshot: ReadingsSource, districts: District[] = DISTRICTS): DerivedScenario {
  const floodPredictions: Record<string, Prediction> = {};
  for (const reading of snapshot.floodReadings) floodPredictions[reading.districtId] = scoreFlood(reading);

  const trafficPredictions: Record<string, TrafficPrediction> = {};
  for (const reading of snapshot.trafficReadings) trafficPredictions[reading.districtId] = scoreTraffic(reading);
  applyLiveRerouteSuggestions(snapshot.trafficReadings, districts, trafficPredictions);

  const incidentPredictions: Record<string, Prediction> = {};
  for (const reading of snapshot.incidentReadings) incidentPredictions[reading.districtId] = scoreIncident(reading);

  const budgetPriorities = computeBudgetPriorities(districts, floodPredictions, trafficPredictions, incidentPredictions);

  const combinedRiskByDistrict: Record<string, RiskLevel> = {};
  for (const district of districts) {
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
