"use client";

import { CloudRain, HeartHandshake, MapPin, ShieldAlert } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { LocationSearchBar } from "@/components/layout/LocationSearchBar";
import { ResidentAlertCard } from "@/components/resident/ResidentAlertCard";
import { Card } from "@/components/ui/Card";
import { SyntheticDataBadge } from "@/components/ui/SyntheticDataBadge";
import { useLocation } from "@/lib/LocationContext";

const NAV_LINKS = [
  { href: "/dashboard", label: "Council" },
  { href: "/resident", label: "Residents" },
];

export default function LiveResidentPage() {
  const { place, status, error, snapshot, residents, refreshCount, getDistrict } = useLocation();
  const atRisk = residents.filter((r) => r.alertStatus !== "none");

  return (
    <div className="flex min-h-dvh min-h-screen min-w-0 flex-col overflow-x-clip bg-civic-mist">
      <AppHeader
        links={NAV_LINKS}
        subtitle={place ? `${place.label} · Live` : "Search a UK place"}
        controls={<LocationSearchBar />}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:px-6 md:py-8 md:pb-8">
        <div className="animate-fade-up">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">People first</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            {place ? `${place.label} Resident Alerts` : "Resident Alerts"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            When risk rises, NeighbourIQ reaches the people who need it most — not just a control room.
          </p>
        </div>

        {!snapshot || !place ? (
          <Card className="flex flex-col items-center gap-3 p-10 text-center">
            <MapPin size={28} className="text-teal" />
            <p className="font-display text-lg font-semibold text-ink">
              {status === "loading"
                ? "Loading live conditions…"
                : status === "error"
                  ? "Couldn't load that place"
                  : "Search a UK postcode or place to begin"}
            </p>
            <p className="max-w-md text-sm text-muted">
              {status === "error" ? error : "Use the search bar above to look up a real UK place."}
            </p>
          </Card>
        ) : (
          <>
            <Card key={`weather-${refreshCount}`} className="animate-soft-scale-in overflow-hidden p-0">
              <div className="border-b border-border bg-surface-elevated px-5 py-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <CloudRain size={16} className="text-teal" /> Current forecast
                </p>
                <p className="mt-1 text-sm text-muted">
                  {snapshot.weather.condition} · {snapshot.weather.tempC}°C · Wind {snapshot.weather.windKmh} km/h ·
                  Rain {snapshot.weather.rainfallMm}mm
                </p>
              </div>
              {snapshot.weather.alertType !== "none" && (
                <p className="animate-alert-in flex items-start gap-2 bg-amber-soft px-5 py-3.5 text-sm font-medium text-ink">
                  <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber" />
                  {snapshot.weather.alertType === "flood"
                    ? "Flood warning in effect — avoid low-lying areas near watercourses."
                    : "Storm warning in effect — secure loose items and check on vulnerable neighbours."}
                </p>
              )}
            </Card>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <HeartHandshake size={16} className="text-teal" />
                <h2 className="font-display text-lg font-semibold text-ink">Vulnerable resident alerts</h2>
              </div>
              <SyntheticDataBadge label="Resident records shown here are illustrative sample data, not real people — there's no public data source for individual vulnerability records." />
              {atRisk.length === 0 ? (
                <Card key={`empty-${refreshCount}`} className="animate-fade-in mt-3 border-dashed p-6 text-center text-sm text-muted">
                  No active alerts for vulnerable residents in this area right now.
                </Card>
              ) : (
                <div key={`alerts-${refreshCount}`} className="mt-3 grid gap-3 sm:grid-cols-2">
                  {atRisk.map((resident, i) => (
                    <div key={resident.id} className="animate-soft-scale-in" style={{ animationDelay: `${i * 90}ms` }}>
                      <ResidentAlertCard resident={resident} getDistrict={getDistrict} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
