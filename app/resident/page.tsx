"use client";

import { CloudRain, ShieldAlert } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ResidentAlertCard } from "@/components/resident/ResidentAlertCard";
import { Card } from "@/components/ui/Card";
import { useScenario } from "@/lib/ScenarioContext";

export default function ResidentPage() {
  const { snapshot } = useScenario();
  const { weather, vulnerableResidents } = snapshot;
  const atRisk = vulnerableResidents.filter((r) => r.alertStatus !== "none");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Millhaven Resident Alerts</h1>
          <p className="text-sm text-slate-500">Personalised safety information for Millhaven residents.</p>
        </div>

        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <CloudRain size={16} className="text-sky-600" /> Current forecast
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {weather.condition} · {weather.tempC}°C · Wind {weather.windKmh} km/h · Rain {weather.rainfallMm}mm
          </p>
          {weather.alertType !== "none" && (
            <p className="mt-3 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              <ShieldAlert size={14} className="shrink-0" />
              {weather.alertType === "flood"
                ? "Flood warning in effect — avoid Bridge Street and low-lying areas near the river."
                : "Storm warning in effect — secure loose items and check on vulnerable neighbours."}
            </p>
          )}
        </Card>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Vulnerable resident alerts</h2>
          {atRisk.length === 0 ? (
            <Card className="p-5 text-sm text-slate-500">
              No active alerts for vulnerable residents in Millhaven today.
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {atRisk.map((resident) => (
                <ResidentAlertCard key={resident.id} resident={resident} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
