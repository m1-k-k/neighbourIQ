import {
  FloodReading,
  IncidentReading,
  TrafficReading,
  VulnerableResident,
  WeatherForecast,
} from "./types";

export const BASE_WEATHER: WeatherForecast = {
  condition: "Overcast, light breeze",
  tempC: 14,
  windKmh: 18,
  rainfallMm: 2,
  alertType: "none",
};

export const BASE_FLOOD_READINGS: FloodReading[] = [
  { districtId: "riverside", riverLevelM: 1.2, rainfall24hMm: 3, drainageCapacityPct: 90, trend: "steady" },
  { districtId: "stationroad", riverLevelM: 0.8, rainfall24hMm: 2, drainageCapacityPct: 92, trend: "steady" },
  { districtId: "oldtown", riverLevelM: 0.5, rainfall24hMm: 2, drainageCapacityPct: 93, trend: "steady" },
  { districtId: "northfield", riverLevelM: 0.3, rainfall24hMm: 1, drainageCapacityPct: 95, trend: "steady" },
  { districtId: "greenway", riverLevelM: 0.6, rainfall24hMm: 2, drainageCapacityPct: 92, trend: "steady" },
  { districtId: "hillcrest", riverLevelM: 0.15, rainfall24hMm: 1, drainageCapacityPct: 97, trend: "steady" },
];

export const BASE_TRAFFIC_READINGS: TrafficReading[] = [
  { districtId: "stationroad", roadName: "Station Road", congestionPct: 38, avgSpeedKmh: 34, incidentOnRoad: false },
  { districtId: "oldtown", roadName: "High Street", congestionPct: 45, avgSpeedKmh: 22, incidentOnRoad: false },
  { districtId: "riverside", roadName: "Bridge Street", congestionPct: 28, avgSpeedKmh: 40, incidentOnRoad: false },
  { districtId: "northfield", roadName: "Northfield Avenue", congestionPct: 20, avgSpeedKmh: 44, incidentOnRoad: false },
  { districtId: "greenway", roadName: "Greenway Close", congestionPct: 15, avgSpeedKmh: 48, incidentOnRoad: false },
  { districtId: "hillcrest", roadName: "Hillcrest Drive", congestionPct: 12, avgSpeedKmh: 50, incidentOnRoad: false },
];

export const BASE_INCIDENT_READINGS: IncidentReading[] = [
  { districtId: "oldtown", category: "Anti-social behaviour", recentReportCount: 3, trendDirection: "flat" },
  { districtId: "riverside", category: "Property/flood-related", recentReportCount: 1, trendDirection: "flat" },
  { districtId: "stationroad", category: "Traffic collisions (minor)", recentReportCount: 1, trendDirection: "flat" },
  { districtId: "northfield", category: "Welfare checks", recentReportCount: 1, trendDirection: "flat" },
  { districtId: "greenway", category: "Noise complaints", recentReportCount: 1, trendDirection: "flat" },
  { districtId: "hillcrest", category: "Noise complaints", recentReportCount: 0, trendDirection: "flat" },
];

export const BASE_VULNERABLE_RESIDENTS: VulnerableResident[] = [
  { id: "vr-1", districtId: "northfield", name: "E. Whitfield", ageBand: "80-89", riskFactors: ["Mobility-limited", "Lives alone"], alertStatus: "none" },
  { id: "vr-2", districtId: "northfield", name: "R. Aboud", ageBand: "70-79", riskFactors: ["Respiratory condition"], alertStatus: "none" },
  { id: "vr-3", districtId: "riverside", name: "M. Kowalski", ageBand: "75-84", riskFactors: ["Ground-floor flat", "Lives alone"], alertStatus: "none" },
  { id: "vr-4", districtId: "riverside", name: "S. Okafor", ageBand: "65-74", riskFactors: ["Mobility-limited"], alertStatus: "none" },
  { id: "vr-5", districtId: "stationroad", name: "J. Patel", ageBand: "80+", riskFactors: ["Dementia care"], alertStatus: "none" },
  { id: "vr-6", districtId: "oldtown", name: "A. Novak", ageBand: "70-79", riskFactors: ["Lives alone"], alertStatus: "none" },
];
