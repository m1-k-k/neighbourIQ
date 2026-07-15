import "server-only";
import { District, IncidentReading } from "../types";

interface CrimeItem {
  category: string;
}

async function fetchLatestMonth(): Promise<string | null> {
  const res = await fetch("https://data.police.uk/api/crime-last-updated", { next: { revalidate: 21600 } });
  if (!res.ok) return null;
  const body = await res.json();
  return body?.date ?? null;
}

function previousMonth(month: string): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1, 1));
  date.setUTCMonth(date.getUTCMonth() - 1);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function fetchCrimesNear(lat: number, lon: number, month: string): Promise<CrimeItem[]> {
  const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=${month}`;
  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) return [];
  return res.json();
}

function topCategory(crimes: CrimeItem[]): string {
  if (crimes.length === 0) return "No reports";
  const counts = new Map<string, number>();
  for (const c of crimes) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
  let best = crimes[0].category;
  let bestCount = 0;
  for (const [category, count] of counts) {
    if (count > bestCount) {
      best = category;
      bestCount = count;
    }
  }
  return best.replace(/-/g, " ");
}

function emptyReading(d: District): IncidentReading {
  return { districtId: d.id, category: "No data", recentReportCount: 0, trendDirection: "flat", periodLabel: "latest month" };
}

export interface CrimeFetchResult {
  readings: IncidentReading[];
  coverageAvailable: boolean;
}

// Covers England, Wales, and Northern Ireland police forces — not Police Scotland, which
// has no equivalent free open-data API. Reporting granularity is monthly, not real-time.
export async function fetchIncidentReadings(districts: District[]): Promise<CrimeFetchResult> {
  const latestMonth = await fetchLatestMonth();
  if (!latestMonth) {
    return { readings: districts.map(emptyReading), coverageAvailable: false };
  }
  const priorMonth = previousMonth(latestMonth);

  const readings = await Promise.all(
    districts.map(async (d): Promise<IncidentReading> => {
      if (d.lat === undefined || d.lon === undefined) return emptyReading(d);
      const [current, prior] = await Promise.all([
        fetchCrimesNear(d.lat, d.lon, latestMonth),
        fetchCrimesNear(d.lat, d.lon, priorMonth),
      ]);
      const currentCount = current.length;
      const priorCount = prior.length;
      let trendDirection: IncidentReading["trendDirection"] = "flat";
      if (priorCount > 0) {
        const change = (currentCount - priorCount) / priorCount;
        if (change > 0.15) trendDirection = "up";
        else if (change < -0.15) trendDirection = "down";
      } else if (currentCount > 0) {
        trendDirection = "up";
      }
      return {
        districtId: d.id,
        category: topCategory(current),
        recentReportCount: currentCount,
        trendDirection,
        periodLabel: "latest month",
      };
    })
  );

  return { readings, coverageAvailable: true };
}
