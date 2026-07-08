export type RiskLevel = "Low" | "Medium" | "High" | "Severe";

export interface DistrictRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface District {
  id: string;
  name: string;
  tagline: string;
  population: number;
  vulnerableResidentCount: number;
  rect: DistrictRect;
}

export interface PredictionFactor {
  label: string;
  detail: string;
  weight: number;
}

export interface Prediction {
  score: number;
  level: RiskLevel;
  confidencePct: number;
  explanation: string;
  factors: PredictionFactor[];
}

export interface TrafficPrediction extends Prediction {
  predictedDelayMin: number;
  suggestedReroute: string | null;
}

export interface FloodReading {
  districtId: string;
  riverLevelM: number;
  rainfall24hMm: number;
  drainageCapacityPct: number;
  trend: "rising" | "falling" | "steady";
}

export interface TrafficReading {
  districtId: string;
  roadName: string;
  congestionPct: number;
  avgSpeedKmh: number;
  incidentOnRoad: boolean;
}

export interface IncidentReading {
  districtId: string;
  category: string;
  recentReportCount: number;
  trendDirection: "up" | "down" | "flat";
}

export interface WeatherForecast {
  condition: string;
  tempC: number;
  windKmh: number;
  rainfallMm: number;
  alertType: "none" | "storm" | "flood" | "extreme-cold" | "heat";
}

export interface VulnerableResident {
  id: string;
  districtId: string;
  name: string;
  ageBand: string;
  riskFactors: string[];
  alertStatus: "none" | "monitoring" | "alerted";
}

export interface BudgetPriorityItem {
  districtId: string;
  priorityScore: number;
  rank: number;
  rationale: string;
  recommendedAction: string;
  estCostGBP: number;
}

export interface AlertFeedItem {
  id: string;
  stage: number;
  severity: "info" | "warning" | "critical";
  districtId: string | null;
  message: string;
  timeLabel: string;
}

export interface ScenarioStage {
  index: number;
  label: string;
  description: string;
  timeLabel: string;
}

export interface ScenarioSnapshot {
  stage: ScenarioStage;
  weather: WeatherForecast;
  floodReadings: FloodReading[];
  trafficReadings: TrafficReading[];
  incidentReadings: IncidentReading[];
  vulnerableResidents: VulnerableResident[];
  alerts: AlertFeedItem[];
}
