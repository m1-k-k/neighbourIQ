import {
  BudgetPriorityItem,
  District,
  FloodReading,
  IncidentReading,
  Prediction,
  PredictionFactor,
  RiskLevel,
  TrafficPrediction,
  TrafficReading,
} from "./types";

// NeighbourIQ Predictive Engine — a transparent weighted rules-engine, not a
// trained model. Every scoring function below returns the same Prediction
// shape so panels can render score/level/confidence/explanation uniformly.

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

function levelFromScore(score: number): RiskLevel {
  if (score < 25) return "Low";
  if (score < 50) return "Medium";
  if (score < 75) return "High";
  return "Severe";
}

function confidenceFromScore(score: number): number {
  return Math.round(clamp(70 + score * 0.28, 70, 97));
}

function buildExplanation(level: RiskLevel, factors: PredictionFactor[], calmMessage: string): string {
  if (level === "Low") return calmMessage;
  const sorted = [...factors].sort((a, b) => b.weight - a.weight);
  const top = sorted[0];
  const second = sorted[1];
  return `Predicted ${level.toUpperCase()} risk — driven mainly by ${top.label.toLowerCase()} (${top.detail})${
    second ? ` and ${second.label.toLowerCase()} (${second.detail})` : ""
  }.`;
}

const REROUTE_SUGGESTIONS: Record<string, string> = {
  riverside: "Diverting via Station Road (Mill Road bypass)",
  stationroad: "Consider Northfield Avenue as an alternate route",
  oldtown: "Consider Greenway Close as an alternate route",
};

// EA severityLevel: 1=Severe Warning, 2=Warning, 3=Alert, 4=Warning no longer in force
function severityToScore(severity: number): number {
  if (severity === 1) return 100;
  if (severity === 2) return 75;
  if (severity === 3) return 45;
  return 10;
}

function severityLabel(severity: number): string {
  if (severity === 1) return "Severe flood warning active";
  if (severity === 2) return "Flood warning active";
  if (severity === 3) return "Flood alert active";
  return "No active flood warning";
}

export function scoreFlood(reading: FloodReading): Prediction {
  if (reading.floodWarningSeverity !== undefined) {
    const normRiver =
      reading.stageTypicalHigh !== undefined &&
      reading.stageTypicalLow !== undefined &&
      reading.stageTypicalHigh > reading.stageTypicalLow
        ? clamp(((reading.riverLevelM - reading.stageTypicalLow) / (reading.stageTypicalHigh - reading.stageTypicalLow)) * 100)
        : clamp((reading.riverLevelM / 4) * 100);
    const normRain = clamp((reading.rainfall24hMm / 50) * 100);
    const severityScore = severityToScore(reading.floodWarningSeverity);
    const score = Math.round(normRiver * 0.4 + normRain * 0.3 + severityScore * 0.3);
    const level = levelFromScore(score);
    const factors: PredictionFactor[] = [
      { label: "River level", detail: `${reading.riverLevelM.toFixed(2)}m (${reading.trend})`, weight: 0.4 },
      { label: "24h rainfall", detail: `${reading.rainfall24hMm.toFixed(1)}mm`, weight: 0.3 },
      { label: "Official flood warning", detail: severityLabel(reading.floodWarningSeverity), weight: 0.3 },
    ];
    return {
      score,
      level,
      confidencePct: confidenceFromScore(score),
      explanation: buildExplanation(level, factors, "River levels and official flood warnings are within normal range."),
      factors,
    };
  }

  const normRiver = clamp((reading.riverLevelM / 4) * 100);
  const normRain = clamp((reading.rainfall24hMm / 40) * 100);
  const drainageDeficit = clamp(100 - reading.drainageCapacityPct);
  const score = Math.round(normRiver * 0.4 + normRain * 0.35 + drainageDeficit * 0.25);
  const level = levelFromScore(score);
  const factors: PredictionFactor[] = [
    { label: "River level", detail: `${reading.riverLevelM.toFixed(1)}m (${reading.trend})`, weight: 0.4 },
    { label: "24h rainfall", detail: `${reading.rainfall24hMm}mm`, weight: 0.35 },
    { label: "Drainage capacity", detail: `${reading.drainageCapacityPct}% remaining`, weight: 0.25 },
  ];
  return {
    score,
    level,
    confidencePct: confidenceFromScore(score),
    explanation: buildExplanation(level, factors, "River levels and drainage capacity are within normal range."),
    factors,
  };
}

export function scoreTraffic(reading: TrafficReading): TrafficPrediction {
  const isLive = reading.freeFlowSpeedKmh !== undefined;
  const referenceSpeed = isLive ? reading.freeFlowSpeedKmh! : 50;
  const normSpeedDeficit = clamp(100 - (reading.avgSpeedKmh / referenceSpeed) * 100);
  const incidentBump = reading.incidentOnRoad ? 15 : 0;
  const score = clamp(Math.round(reading.congestionPct * 0.6 + normSpeedDeficit * 0.25 + incidentBump));
  const level = levelFromScore(score);
  const factors: PredictionFactor[] = [
    { label: "Congestion", detail: `${reading.congestionPct}% of capacity`, weight: 0.6 },
    { label: "Average speed", detail: `${reading.avgSpeedKmh} km/h`, weight: 0.25 },
    { label: "Road incidents", detail: reading.incidentOnRoad ? "Closure/incident active" : "None reported", weight: 0.15 },
  ];
  const predictedDelayMin =
    isLive && reading.currentTravelTimeSec !== undefined && reading.freeFlowTravelTimeSec !== undefined
      ? Math.max(0, Math.round((reading.currentTravelTimeSec - reading.freeFlowTravelTimeSec) / 60))
      : Math.round(2 + (score / 100) * 33);
  const suggestedReroute =
    level === "High" || level === "Severe" ? REROUTE_SUGGESTIONS[reading.districtId] ?? null : null;
  return {
    score,
    level,
    confidencePct: confidenceFromScore(score),
    explanation: buildExplanation(level, factors, "Traffic is flowing normally with no significant delays."),
    factors,
    predictedDelayMin,
    suggestedReroute,
  };
}

const CRIME_COUNT_SOFT_CAP = 100;

export function scoreIncident(reading: IncidentReading): Prediction {
  const normCount =
    reading.periodLabel !== undefined
      ? clamp((Math.log10(reading.recentReportCount + 1) / Math.log10(CRIME_COUNT_SOFT_CAP + 1)) * 100)
      : clamp((reading.recentReportCount / 12) * 100);
  const trendBump = reading.trendDirection === "up" ? 15 : reading.trendDirection === "down" ? -10 : 0;
  const score = clamp(Math.round(normCount + trendBump));
  const level = levelFromScore(score);
  const periodLabel = reading.periodLabel ?? "last 3h";
  const factors: PredictionFactor[] = [
    { label: "Recent reports", detail: `${reading.recentReportCount} in ${periodLabel} (${reading.category})`, weight: 0.7 },
    { label: "Trend", detail: reading.trendDirection, weight: 0.3 },
  ];
  return {
    score,
    level,
    confidencePct: confidenceFromScore(score),
    explanation: buildExplanation(level, factors, "Report activity is steady with no unusual patterns."),
    factors,
  };
}

export function computeBudgetPriorities(
  districts: District[],
  floodPredictions: Record<string, Prediction>,
  trafficPredictions: Record<string, TrafficPrediction>,
  incidentPredictions: Record<string, Prediction>
): BudgetPriorityItem[] {
  const maxVulnerable = Math.max(...districts.map((d) => d.vulnerableResidentCount));

  const items: BudgetPriorityItem[] = districts.map((d) => {
    const flood = floodPredictions[d.id];
    const traffic = trafficPredictions[d.id];
    const incident = incidentPredictions[d.id];
    const vulnerabilityScore = clamp((d.vulnerableResidentCount / maxVulnerable) * 100);

    const priorityScore = Math.round(
      flood.score * 0.4 + traffic.score * 0.25 + incident.score * 0.2 + vulnerabilityScore * 0.15
    );

    const contributions = [
      { label: "flood risk", weighted: flood.score * 0.4, detail: `${flood.level} flood prediction` },
      { label: "traffic disruption", weighted: traffic.score * 0.25, detail: `${traffic.level} traffic prediction` },
      { label: "incident activity", weighted: incident.score * 0.2, detail: `${incident.level} incident activity` },
      {
        label: "resident vulnerability",
        weighted: vulnerabilityScore * 0.15,
        detail: `${d.vulnerableResidentCount} vulnerable residents`,
      },
    ].sort((a, b) => b.weighted - a.weighted);

    const top = contributions[0];
    const rationale = `${top.detail} is the leading factor (combined priority score ${priorityScore}/100).`;

    let recommendedAction = "Routine monitoring — no immediate investment needed.";
    if (priorityScore >= 45) {
      if (top.label === "flood risk") recommendedAction = "Emergency drainage / flood defence investment.";
      else if (top.label === "traffic disruption") recommendedAction = "Traffic signal upgrade and reroute infrastructure.";
      else if (top.label === "incident activity") recommendedAction = "Increase community policing / outreach presence.";
      else recommendedAction = "Targeted resident welfare support programme.";
    }

    const estCostGBP = Math.max(0, Math.round((priorityScore * 1400) / 500) * 500);

    return {
      districtId: d.id,
      priorityScore,
      rank: 0,
      rationale,
      recommendedAction,
      estCostGBP,
    };
  });

  items.sort((a, b) => b.priorityScore - a.priorityScore);
  items.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return items;
}
