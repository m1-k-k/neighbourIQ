"use client";

import { CloudRain, HeartHandshake, ShieldAlert } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ResidentAlertCard } from "@/components/resident/ResidentAlertCard";
import { Card } from "@/components/ui/Card";
import { useScenario } from "@/lib/ScenarioContext";

export default function ResidentPage() {
  const { snapshot, stageIndex } = useScenario();
  const { weather, vulnerableResidents } = snapshot;
  const atRisk = vulnerableResidents.filter((r) => r.alertStatus !== "none");

  return (
    <div className="flex min-h-screen flex-col bg-civic-mist">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
        <div className="animate-fade-up">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">People first</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Millhaven Resident Alerts</h1>
          <p className="mt-1.5 text-sm text-muted">
            When risk rises, NeighbourIQ reaches the people who need it most — not just a control room.
          </p>
        </div>

        <Card key={`weather-${stageIndex}`} className="animate-soft-scale-in overflow-hidden p-0">
          <div className="border-b border-border bg-surface-elevated px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <CloudRain size={16} className="text-teal" /> Current forecast
            </p>
            <p className="mt-1 text-sm text-muted">
              {weather.condition} · {weather.tempC}°C · Wind {weather.windKmh} km/h · Rain {weather.rainfallMm}mm
            </p>
          </div>
          {weather.alertType !== "none" && (
            <p className="animate-alert-in flex items-start gap-2 bg-amber-soft px-5 py-3.5 text-sm font-medium text-ink">
              <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber" />
              {weather.alertType === "flood"
                ? "Flood warning in effect — avoid Bridge Street and low-lying areas near the river."
                : "Storm warning in effect — secure loose items and check on vulnerable neighbours."}
            </p>
          )}
        </Card>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <HeartHandshake size={16} className="text-teal" />
            <h2 className="font-display text-lg font-semibold text-ink">Vulnerable resident alerts</h2>
          </div>
          {atRisk.length === 0 ? (
            <Card key={`empty-${stageIndex}`} className="animate-fade-in border-dashed p-6 text-center text-sm text-muted">
              No active alerts for vulnerable residents in Millhaven today. Advance the demo story to see protection
              kick in.
            </Card>
          ) : (
            <div key={`alerts-${stageIndex}`} className="grid gap-3 sm:grid-cols-2">
              {atRisk.map((resident, i) => (
                <div
                  key={resident.id}
                  className="animate-soft-scale-in"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <ResidentAlertCard resident={resident} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
