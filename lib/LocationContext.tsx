"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { buildAlerts } from "./alerts";
import { computeDerived, DerivedScenario } from "./derived";
import { AlertFeedItem, District, LocationSnapshot, Place, VulnerableResident } from "./types";

type Status = "idle" | "loading" | "ready" | "error";

interface LocationContextValue {
  query: string;
  setQuery: (q: string) => void;
  place: Place | null;
  status: Status;
  error: string | null;
  districts: District[];
  snapshot: LocationSnapshot | null;
  derived: DerivedScenario | null;
  alerts: AlertFeedItem[];
  residents: VulnerableResident[];
  refreshCount: number;
  lastUpdatedAt: Date | null;
  search: (query: string) => Promise<void>;
  selectPlace: (place: Place) => Promise<void>;
  refresh: () => Promise<void>;
  getDistrict: (id: string) => District;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const FALLBACK_DISTRICT: District = {
  id: "unknown",
  name: "Unknown area",
  tagline: "",
  vulnerableResidentCount: 0,
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<LocationSnapshot | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const runFetch = useCallback(async (params: URLSearchParams) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(`/api/location-data?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus("error");
        setError(body?.error ?? "Something went wrong fetching live data.");
        return;
      }
      const data: LocationSnapshot = await res.json();
      setSnapshot(data);
      setPlace(data.place);
      setQuery(data.place.label);
      setStatus("ready");
      setLastUpdatedAt(new Date());
      setRefreshCount((c) => c + 1);
    } catch {
      setStatus("error");
      setError("Network error while fetching live data.");
    }
  }, []);

  const search = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      await runFetch(new URLSearchParams({ query: trimmed }));
    },
    [runFetch]
  );

  const selectPlace = useCallback(
    async (p: Place) => {
      await runFetch(new URLSearchParams({ lat: String(p.lat), lon: String(p.lon), label: p.label }));
    },
    [runFetch]
  );

  const refresh = useCallback(async () => {
    if (!place) return;
    await runFetch(new URLSearchParams({ lat: String(place.lat), lon: String(place.lon), label: place.label }));
  }, [place, runFetch]);

  const districts = useMemo(() => snapshot?.districts ?? [], [snapshot]);

  const derived = useMemo(() => (snapshot ? computeDerived(snapshot, districts) : null), [snapshot, districts]);

  const alerts = useMemo(
    () => (snapshot && derived ? buildAlerts(snapshot, derived, districts) : []),
    [snapshot, derived, districts]
  );

  // Synthetic residents start with alertStatus "none" — overlay real district risk so the
  // resident view reflects actual current conditions even though the people are illustrative.
  const residents = useMemo(() => {
    if (!snapshot || !derived) return [];
    return snapshot.vulnerableResidents.map((r): VulnerableResident => {
      const level = derived.combinedRiskByDistrict[r.districtId];
      const alertStatus = level === "Severe" ? "alerted" : level === "High" ? "monitoring" : "none";
      return { ...r, alertStatus };
    });
  }, [snapshot, derived]);

  const getDistrict = useCallback((id: string) => districts.find((d) => d.id === id) ?? FALLBACK_DISTRICT, [districts]);

  const value: LocationContextValue = useMemo(
    () => ({
      query,
      setQuery,
      place,
      status,
      error,
      districts,
      snapshot,
      derived,
      alerts,
      residents,
      refreshCount,
      lastUpdatedAt,
      search,
      selectPlace,
      refresh,
      getDistrict,
    }),
    [
      query,
      place,
      status,
      error,
      districts,
      snapshot,
      derived,
      alerts,
      residents,
      refreshCount,
      lastUpdatedAt,
      search,
      selectPlace,
      refresh,
      getDistrict,
    ]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}
