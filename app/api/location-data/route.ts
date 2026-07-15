import { NextRequest, NextResponse } from "next/server";
import { geocodeQuery } from "@/lib/geocode";
import { buildSectors } from "@/lib/geo";
import { fetchWeather, WeatherResult } from "@/lib/sources/weather";
import { fetchFloodReadings, FloodFetchResult } from "@/lib/sources/flood";
import { fetchTrafficReadings, TrafficFetchResult } from "@/lib/sources/traffic";
import { fetchIncidentReadings, CrimeFetchResult } from "@/lib/sources/crime";
import { buildSyntheticResidents } from "@/lib/syntheticResidents";
import { District, LocationSnapshot, Place } from "@/lib/types";

export const runtime = "nodejs";

const FALLBACK_WEATHER: WeatherResult = {
  condition: "Unavailable",
  tempC: 12,
  windKmh: 0,
  rainfallMm: 0,
  rainfall24hMm: 0,
  alertType: "none",
};

async function safeWeather(place: Place): Promise<WeatherResult> {
  try {
    return await fetchWeather(place);
  } catch {
    return FALLBACK_WEATHER;
  }
}

async function safeFlood(place: Place, districts: District[]): Promise<FloodFetchResult> {
  try {
    return await fetchFloodReadings(place, districts);
  } catch {
    return {
      coverageAvailable: false,
      readings: districts.map((d) => ({
        districtId: d.id,
        riverLevelM: 0,
        rainfall24hMm: 0,
        drainageCapacityPct: 100,
        trend: "steady",
        floodWarningSeverity: 4,
      })),
    };
  }
}

async function safeTraffic(districts: District[]): Promise<TrafficFetchResult> {
  try {
    return await fetchTrafficReadings(districts);
  } catch {
    return {
      configured: false,
      readings: districts.map((d) => ({ districtId: d.id, roadName: "Nearby road segment", congestionPct: 0, avgSpeedKmh: 0, incidentOnRoad: false })),
    };
  }
}

async function safeCrime(districts: District[]): Promise<CrimeFetchResult> {
  try {
    return await fetchIncidentReadings(districts);
  } catch {
    return {
      coverageAvailable: false,
      readings: districts.map((d) => ({ districtId: d.id, category: "No data", recentReportCount: 0, trendDirection: "flat", periodLabel: "latest month" })),
    };
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("query");
  const latParam = params.get("lat");
  const lonParam = params.get("lon");
  const label = params.get("label");

  let place: Place;

  if (latParam && lonParam && label) {
    place = { label, lat: parseFloat(latParam), lon: parseFloat(lonParam) };
  } else if (query) {
    const results = await geocodeQuery(query);
    if (results.length === 0) {
      return NextResponse.json({ error: "Couldn't find that place. Try a UK postcode or town name." }, { status: 404 });
    }
    place = { label: results[0].label, lat: results[0].lat, lon: results[0].lon };
  } else {
    return NextResponse.json({ error: "Provide a query, or lat/lon/label" }, { status: 400 });
  }

  const districts = buildSectors(place);

  const [weather, flood, traffic, crime] = await Promise.all([
    safeWeather(place),
    safeFlood(place, districts),
    safeTraffic(districts),
    safeCrime(districts),
  ]);

  const floodReadings = flood.readings.map((r) => ({ ...r, rainfall24hMm: weather.rainfall24hMm }));

  const snapshot: LocationSnapshot = {
    place,
    districts,
    weather,
    floodReadings,
    trafficReadings: traffic.readings,
    incidentReadings: crime.readings,
    vulnerableResidents: buildSyntheticResidents(districts),
    fetchedAt: new Date().toISOString(),
    coverage: {
      flood: flood.coverageAvailable,
      crime: crime.coverageAvailable,
      traffic: traffic.configured,
    },
  };

  return NextResponse.json(snapshot);
}
