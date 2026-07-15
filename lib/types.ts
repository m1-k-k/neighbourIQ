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
  population?: number;
  vulnerableResidentCount: number;
  /** Demo-only: pixel coords for the fictional-town SVG map. */
  rect?: DistrictRect;
  /** Live-only: real coordinates for the searched place's sector. */
  lat?: number;
  lon?: number;
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
  /** Live-only: EA active flood-warning severity near this point (1=Severe..4=warning no longer in force), absent when none active or unknown. */
  floodWarningSeverity?: number;
  /** Live-only: EA station's typical high/low stage range, used to normalize riverLevelM relative to the local station instead of a fixed constant. */
  stageTypicalHigh?: number;
  stageTypicalLow?: number;
}

export interface TrafficReading {
  districtId: string;
  roadName: string;
  congestionPct: number;
  avgSpeedKmh: number;
  incidentOnRoad: boolean;
  /** Live-only: TomTom flow-segment fields, used to derive congestion/delay from the road's own baseline instead of a fixed reference speed. */
  freeFlowSpeedKmh?: number;
  currentTravelTimeSec?: number;
  freeFlowTravelTimeSec?: number;
}

export interface IncidentReading {
  districtId: string;
  category: string;
  recentReportCount: number;
  trendDirection: "up" | "down" | "flat";
  /** Live-only: real reporting granularity ("latest month") vs the demo's fixed "last 3h" copy. */
  periodLabel?: string;
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
  /** Demo-only: which scripted stage produced this alert. Absent for live alerts. */
  stage?: number;
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

// --- Live (real-place, real-data) types ---

export interface GeocodeResult {
  label: string;
  lat: number;
  lon: number;
  source: "postcode" | "place";
  adminDistrict?: string;
}

export interface Place {
  label: string;
  lat: number;
  lon: number;
}

export interface LocationSnapshot {
  place: Place;
  districts: District[];
  weather: WeatherForecast;
  floodReadings: FloodReading[];
  trafficReadings: TrafficReading[];
  incidentReadings: IncidentReading[];
  vulnerableResidents: VulnerableResident[];
  fetchedAt: string;
  coverage: {
    flood: boolean;
    crime: boolean;
    traffic: boolean;
  };
}
