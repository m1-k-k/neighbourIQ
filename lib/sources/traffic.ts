import "server-only";
import { District, TrafficReading } from "../types";

interface FlowSegmentData {
  currentSpeed: number;
  freeFlowSpeed: number;
  currentTravelTime: number;
  freeFlowTravelTime: number;
  confidence: number;
  roadClosure: boolean;
}

async function fetchSegment(lat: number, lon: number, apiKey: string): Promise<FlowSegmentData | null> {
  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lon}&unit=KMPH&key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 120 } });
  if (!res.ok) return null;
  const body = await res.json();
  return body?.flowSegmentData ?? null;
}

function emptyReading(d: District): TrafficReading {
  return { districtId: d.id, roadName: "Nearby road segment", congestionPct: 0, avgSpeedKmh: 0, incidentOnRoad: false };
}

export interface TrafficFetchResult {
  readings: TrafficReading[];
  configured: boolean;
}

// TomTom is the only real-time traffic source with UK-wide coverage that offers a free tier —
// there's no free UK-government equivalent. Requires TOMTOM_API_KEY (server-only secret).
export async function fetchTrafficReadings(districts: District[]): Promise<TrafficFetchResult> {
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey) {
    return { readings: districts.map(emptyReading), configured: false };
  }

  const readings = await Promise.all(
    districts.map(async (d): Promise<TrafficReading> => {
      if (d.lat === undefined || d.lon === undefined) return emptyReading(d);
      const segment = await fetchSegment(d.lat, d.lon, apiKey);
      if (!segment || segment.freeFlowSpeed <= 0) return emptyReading(d);

      const congestionPct = Math.round(Math.max(0, 100 - (segment.currentSpeed / segment.freeFlowSpeed) * 100));
      return {
        districtId: d.id,
        roadName: "Nearby road segment",
        congestionPct,
        avgSpeedKmh: Math.round(segment.currentSpeed),
        incidentOnRoad: segment.roadClosure,
        freeFlowSpeedKmh: Math.round(segment.freeFlowSpeed),
        currentTravelTimeSec: segment.currentTravelTime,
        freeFlowTravelTimeSec: segment.freeFlowTravelTime,
      };
    })
  );

  return { readings, configured: true };
}
