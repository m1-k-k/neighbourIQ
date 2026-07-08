import {
  AlertFeedItem,
  FloodReading,
  IncidentReading,
  ScenarioSnapshot,
  ScenarioStage,
  TrafficReading,
  VulnerableResident,
  WeatherForecast,
} from "./types";
import {
  BASE_FLOOD_READINGS,
  BASE_INCIDENT_READINGS,
  BASE_TRAFFIC_READINGS,
  BASE_VULNERABLE_RESIDENTS,
  BASE_WEATHER,
} from "./mockData";

export const STAGES: ScenarioStage[] = [
  {
    index: 0,
    label: "Calm Day",
    description: "Baseline conditions across Millhaven — all signals nominal.",
    timeLabel: "Mon 06:00",
  },
  {
    index: 1,
    label: "Storm Warning",
    description: "Met Office issues a storm warning; rainfall begins building over Riverside.",
    timeLabel: "Mon 14:00",
  },
  {
    index: 2,
    label: "Flood Risk Escalation",
    description: "River level and rainfall spike in Riverside; Bridge Street closes, rerouting traffic via Station Road.",
    timeLabel: "Mon 17:30",
  },
  {
    index: 3,
    label: "Evening Incident Spike + Vulnerable Alert",
    description: "Old Town sees a crowding spike as commuters divert through High Street; Northfield's vulnerable residents are flagged.",
    timeLabel: "Mon 20:00",
  },
  {
    index: 4,
    label: "Council Response",
    description: "Council approves emergency drainage works in Riverside; NeighbourIQ re-ranks budget priorities from live signals.",
    timeLabel: "Tue 08:00",
  },
];

export const TOTAL_STAGES = STAGES.length;

interface KeyedChange<T> {
  districtId: string;
  changes: Partial<T>;
}

interface StageOverride {
  weather?: Partial<WeatherForecast>;
  flood?: KeyedChange<FloodReading>[];
  traffic?: KeyedChange<TrafficReading>[];
  incidents?: KeyedChange<IncidentReading>[];
  vulnerableAlerts?: { id: string; status: VulnerableResident["alertStatus"] }[];
  alerts?: Omit<AlertFeedItem, "id" | "stage">[];
}

const STAGE_OVERRIDES: Record<number, StageOverride> = {
  1: {
    weather: { condition: "Storm warning issued", rainfallMm: 22, windKmh: 46, alertType: "storm" },
    flood: [
      { districtId: "riverside", changes: { riverLevelM: 2.0, rainfall24hMm: 14, drainageCapacityPct: 82, trend: "rising" } },
      { districtId: "stationroad", changes: { riverLevelM: 1.0, rainfall24hMm: 8, drainageCapacityPct: 88, trend: "rising" } },
    ],
    vulnerableAlerts: [
      { id: "vr-3", status: "monitoring" },
      { id: "vr-4", status: "monitoring" },
    ],
    alerts: [
      {
        severity: "warning",
        districtId: null,
        message: "Met Office storm warning issued for Millhaven — heavy rainfall expected overnight.",
        timeLabel: "14:02",
      },
    ],
  },
  2: {
    weather: { condition: "Heavy rain, storm ongoing", rainfallMm: 34, windKmh: 52, alertType: "flood" },
    flood: [
      { districtId: "riverside", changes: { riverLevelM: 3.6, rainfall24hMm: 34, drainageCapacityPct: 55, trend: "rising" } },
      { districtId: "stationroad", changes: { riverLevelM: 1.4, rainfall24hMm: 14, drainageCapacityPct: 82, trend: "rising" } },
    ],
    traffic: [
      { districtId: "riverside", changes: { congestionPct: 85, avgSpeedKmh: 8, incidentOnRoad: true } },
      { districtId: "stationroad", changes: { congestionPct: 68, avgSpeedKmh: 18 } },
    ],
    vulnerableAlerts: [
      { id: "vr-3", status: "alerted" },
      { id: "vr-4", status: "alerted" },
    ],
    alerts: [
      {
        severity: "critical",
        districtId: "riverside",
        message: "Flood risk escalated to SEVERE in Riverside — Bridge Street closed as a precaution.",
        timeLabel: "17:31",
      },
      {
        severity: "warning",
        districtId: "stationroad",
        message: "Traffic rerouted via Station Road — congestion rising, longer delays predicted.",
        timeLabel: "17:35",
      },
    ],
  },
  3: {
    incidents: [
      { districtId: "oldtown", changes: { recentReportCount: 11, trendDirection: "up" } },
    ],
    vulnerableAlerts: [
      { id: "vr-1", status: "alerted" },
      { id: "vr-2", status: "alerted" },
    ],
    alerts: [
      {
        severity: "warning",
        districtId: "oldtown",
        message: "Incident reports rising in Old Town — commuter crowding on High Street following the Bridge Street closure.",
        timeLabel: "20:02",
      },
      {
        severity: "critical",
        districtId: "northfield",
        message: "2 vulnerable residents in Northfield flagged for welfare checks ahead of the overnight storm.",
        timeLabel: "20:10",
      },
    ],
  },
  4: {
    weather: { condition: "Storm easing, drainage crews deployed", rainfallMm: 10, alertType: "flood" },
    flood: [
      { districtId: "riverside", changes: { riverLevelM: 3.1, rainfall24hMm: 26, drainageCapacityPct: 68, trend: "falling" } },
    ],
    traffic: [
      { districtId: "riverside", changes: { congestionPct: 54, avgSpeedKmh: 22 } },
      { districtId: "stationroad", changes: { congestionPct: 50, avgSpeedKmh: 30 } },
    ],
    alerts: [
      {
        severity: "info",
        districtId: "riverside",
        message: "Council approves emergency drainage investment for Riverside — NeighbourIQ ranks this the #1 budget priority.",
        timeLabel: "08:03",
      },
    ],
  },
};

function applyKeyedChanges<T extends { districtId: string }>(items: T[], changes?: KeyedChange<T>[]): T[] {
  if (!changes?.length) return items;
  const changeMap = new Map(changes.map((c) => [c.districtId, c.changes]));
  return items.map((item) => {
    const patch = changeMap.get(item.districtId);
    return patch ? { ...item, ...patch } : item;
  });
}

function buildSnapshot(stageIndex: number): ScenarioSnapshot {
  let weather: WeatherForecast = { ...BASE_WEATHER };
  let flood = BASE_FLOOD_READINGS.map((r) => ({ ...r }));
  let traffic = BASE_TRAFFIC_READINGS.map((r) => ({ ...r }));
  let incidents = BASE_INCIDENT_READINGS.map((r) => ({ ...r }));
  let vulnerable = BASE_VULNERABLE_RESIDENTS.map((r) => ({ ...r }));
  const alerts: AlertFeedItem[] = [];

  for (let stage = 1; stage <= stageIndex; stage++) {
    const override = STAGE_OVERRIDES[stage];
    if (!override) continue;

    if (override.weather) weather = { ...weather, ...override.weather };
    flood = applyKeyedChanges(flood, override.flood);
    traffic = applyKeyedChanges(traffic, override.traffic);
    incidents = applyKeyedChanges(incidents, override.incidents);

    if (override.vulnerableAlerts) {
      for (const va of override.vulnerableAlerts) {
        vulnerable = vulnerable.map((v) => (v.id === va.id ? { ...v, alertStatus: va.status } : v));
      }
    }

    if (override.alerts) {
      override.alerts.forEach((a, idx) => {
        alerts.push({ ...a, id: `stage${stage}-alert${idx}`, stage });
      });
    }
  }

  return {
    stage: STAGES[stageIndex],
    weather,
    floodReadings: flood,
    trafficReadings: traffic,
    incidentReadings: incidents,
    vulnerableResidents: vulnerable,
    alerts,
  };
}

const SNAPSHOT_CACHE: ScenarioSnapshot[] = STAGES.map((_, index) => buildSnapshot(index));

export function getSnapshot(stageIndex: number): ScenarioSnapshot {
  const clampedStage = Math.max(0, Math.min(stageIndex, TOTAL_STAGES - 1));
  return SNAPSHOT_CACHE[clampedStage];
}
