import { District } from "./types";

const EARTH_RADIUS_KM = 6371;
export const SECTOR_RADIUS_KM = 1.5;

const SECTORS = [
  { bearing: 0, label: "North", abbr: "N" },
  { bearing: 60, label: "Northeast", abbr: "NE" },
  { bearing: 120, label: "Southeast", abbr: "SE" },
  { bearing: 180, label: "South", abbr: "S" },
  { bearing: 240, label: "Southwest", abbr: "SW" },
  { bearing: 300, label: "Northwest", abbr: "NW" },
] as const;

// Illustrative sample counts (not real records) so the vulnerability factor isn't flat across sectors.
const SYNTHETIC_VULNERABLE_COUNTS = [12, 5, 9, 3, 7, 4];

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Standard spherical "destination point given start + bearing + distance" formula.
export function destinationPoint(lat: number, lon: number, bearingDeg: number, distanceKm: number): { lat: number; lon: number } {
  const angularDistance = distanceKm / EARTH_RADIUS_KM;
  const bearing = toRad(bearingDeg);
  const lat1 = toRad(lat);
  const lon1 = toRad(lon);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

  return { lat: toDeg(lat2), lon: toDeg(lon2) };
}

export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(a));
}

export function buildSectors(center: { lat: number; lon: number; label: string }): District[] {
  return SECTORS.map((sector, i) => {
    const point = destinationPoint(center.lat, center.lon, sector.bearing, SECTOR_RADIUS_KM);
    return {
      id: `sector-${sector.abbr.toLowerCase()}`,
      name: `${sector.label} of ${center.label}`,
      tagline: `~${SECTOR_RADIUS_KM}km ${sector.abbr} · sample monitoring point`,
      vulnerableResidentCount: SYNTHETIC_VULNERABLE_COUNTS[i],
      lat: point.lat,
      lon: point.lon,
    };
  });
}
