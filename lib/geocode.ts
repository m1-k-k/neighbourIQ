import "server-only";
import { GeocodeResult } from "./types";

const POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const NOMINATIM_USER_AGENT = "NeighbourIQ/1.0 (contact: m.m.khalid09p@gmail.com)";

// Nominatim's usage policy caps free-tier callers at ~1 req/sec. This is a best-effort
// spacing mechanism only — concurrent serverless instances don't share this timestamp — the
// real mitigation is preferring postcodes.io (no such limit) and caching responses.
let lastNominatimCallAt = 0;

async function throttleNominatim(): Promise<void> {
  const minGapMs = 1100;
  const elapsed = Date.now() - lastNominatimCallAt;
  if (elapsed < minGapMs) {
    await new Promise((resolve) => setTimeout(resolve, minGapMs - elapsed));
  }
  lastNominatimCallAt = Date.now();
}

interface PostcodesIoResult {
  postcode: string;
  latitude: number;
  longitude: number;
  admin_ward?: string;
  parish?: string;
}

async function geocodePostcodeExact(postcode: string): Promise<GeocodeResult[]> {
  const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  const body = await res.json();
  const result: PostcodesIoResult | undefined = body?.result;
  if (!result) return [];
  return [
    {
      label: result.postcode,
      lat: result.latitude,
      lon: result.longitude,
      source: "postcode",
      adminDistrict: result.admin_ward ?? result.parish,
    },
  ];
}

async function geocodePostcodePartial(query: string): Promise<GeocodeResult[]> {
  const res = await fetch(`https://api.postcodes.io/postcodes?q=${encodeURIComponent(query)}&limit=5`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  const body = await res.json();
  const results: PostcodesIoResult[] = body?.result ?? [];
  return results.map((r) => ({
    label: r.postcode,
    lat: r.latitude,
    lon: r.longitude,
    source: "postcode" as const,
    adminDistrict: r.admin_ward ?? r.parish,
  }));
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: { town?: string; city?: string; village?: string; county?: string };
}

async function geocodePlace(query: string): Promise<GeocodeResult[]> {
  await throttleNominatim();
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=gb&format=jsonv2&limit=5&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": NOMINATIM_USER_AGENT },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  const results: NominatimResult[] = await res.json();
  return results.map((r) => ({
    label: r.display_name.split(",").slice(0, 2).join(",").trim(),
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    source: "place" as const,
    adminDistrict: r.address?.town ?? r.address?.city ?? r.address?.village ?? r.address?.county,
  }));
}

// Server-only: prefers postcodes.io (free, no rate-limit policy) for anything postcode-shaped,
// falls back to Nominatim for free-text place names. Never call these upstream APIs from the client.
export async function geocodeQuery(rawQuery: string): Promise<GeocodeResult[]> {
  const query = rawQuery.trim();
  if (query.length < 2 || query.length > 100) return [];

  const compact = query.replace(/\s+/g, "").toUpperCase();
  if (POSTCODE_REGEX.test(compact)) {
    const exact = await geocodePostcodeExact(compact);
    if (exact.length > 0) return exact;
  }

  const partial = await geocodePostcodePartial(query);
  if (partial.length > 0) return partial;

  return geocodePlace(query);
}
