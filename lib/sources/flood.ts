import "server-only";
import { District, FloodReading } from "../types";

interface EaMeasure {
  ["@id"]?: string;
  parameter?: string;
  latestReading?: { value: number; dateTime: string };
}

interface EaStation {
  label: string;
  lat: number;
  long: number;
  riverName?: string;
  stageScale?: { typicalRangeHigh?: number; typicalRangeLow?: number };
  measures?: EaMeasure[];
}

interface StationLevel {
  station: EaStation;
  measureId?: string;
  levelM: number;
}

async function findNearestLevelStation(lat: number, lon: number): Promise<StationLevel | null> {
  for (const dist of [3, 10, 25]) {
    const url = `https://environment.data.gov.uk/flood-monitoring/id/stations?lat=${lat}&long=${lon}&dist=${dist}&parameter=level`;
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) continue;
    const body = await res.json();
    const items: EaStation[] = body?.items ?? [];
    for (const station of items) {
      const levelMeasure = station.measures?.find((m) => m.parameter === "level" && m.latestReading?.value !== undefined);
      if (levelMeasure?.latestReading) {
        return { station, measureId: levelMeasure["@id"], levelM: levelMeasure.latestReading.value };
      }
    }
  }
  return null;
}

async function fetchTrend(measureId: string | undefined): Promise<FloodReading["trend"]> {
  if (!measureId) return "steady";
  try {
    const res = await fetch(`${measureId}/readings?_sorted&_limit=2`, { next: { revalidate: 900 } });
    if (!res.ok) return "steady";
    const body = await res.json();
    const items: { value: number }[] = body?.items ?? [];
    if (items.length < 2) return "steady";
    const [latest, previous] = items;
    const delta = latest.value - previous.value;
    if (delta > 0.02) return "rising";
    if (delta < -0.02) return "falling";
    return "steady";
  } catch {
    return "steady";
  }
}

async function fetchActiveSeverity(lat: number, lon: number): Promise<number | undefined> {
  const url = `https://environment.data.gov.uk/flood-monitoring/id/floods?lat=${lat}&long=${lon}&dist=15`;
  const res = await fetch(url, { next: { revalidate: 900 } });
  if (!res.ok) return undefined;
  const body = await res.json();
  const items: { severityLevel: number }[] = body?.items ?? [];
  if (items.length === 0) return undefined;
  return Math.min(...items.map((i) => i.severityLevel));
}

export interface FloodFetchResult {
  readings: FloodReading[];
  coverageAvailable: boolean;
}

// England-only coverage (EA has no equivalent free API for Scotland/Wales/NI) — when no
// nearby level station exists, we return a clearly-flagged "no data" reading rather than erroring.
export async function fetchFloodReadings(center: { lat: number; lon: number }, districts: District[]): Promise<FloodFetchResult> {
  const [stationResult, activeSeverity] = await Promise.all([
    findNearestLevelStation(center.lat, center.lon),
    fetchActiveSeverity(center.lat, center.lon),
  ]);

  const severity = activeSeverity ?? 4;

  if (!stationResult) {
    const readings: FloodReading[] = districts.map((d) => ({
      districtId: d.id,
      riverLevelM: 0,
      rainfall24hMm: 0,
      drainageCapacityPct: 100,
      trend: "steady",
      floodWarningSeverity: severity,
    }));
    return { readings, coverageAvailable: false };
  }

  const { station, measureId, levelM } = stationResult;
  const trend = await fetchTrend(measureId);

  const readings: FloodReading[] = districts.map((d) => ({
    districtId: d.id,
    riverLevelM: levelM,
    rainfall24hMm: 0, // overridden by the caller using the weather source's real 24h rainfall
    drainageCapacityPct: 100,
    trend,
    floodWarningSeverity: severity,
    stageTypicalHigh: station.stageScale?.typicalRangeHigh,
    stageTypicalLow: station.stageScale?.typicalRangeLow,
  }));

  return { readings, coverageAvailable: true };
}
