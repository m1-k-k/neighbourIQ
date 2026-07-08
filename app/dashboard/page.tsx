"use client";

import clsx from "clsx";
import { AlertTriangle, Car, Droplets, Landmark } from "lucide-react";
import { useState } from "react";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { BudgetPriorityPanel } from "@/components/dashboard/BudgetPriorityPanel";
import { FloodRiskPanel } from "@/components/dashboard/FloodRiskPanel";
import { HotspotPanel } from "@/components/dashboard/HotspotPanel";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TrafficPanel } from "@/components/dashboard/TrafficPanel";
import { AppHeader } from "@/components/layout/AppHeader";
import { TownMap } from "@/components/layout/TownMap";
import { Card } from "@/components/ui/Card";
import { useScenario } from "@/lib/ScenarioContext";

const TABS = [
  { id: "flood", label: "Flood Risk", icon: Droplets },
  { id: "traffic", label: "Traffic", icon: Car },
  { id: "hotspots", label: "Hotspots", icon: AlertTriangle },
  { id: "budget", label: "Budget Priority", icon: Landmark },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function DashboardPage() {
  const { snapshot, derived } = useScenario();
  const [activeTab, setActiveTab] = useState<TabId>("flood");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-4 px-6 py-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SummaryCards snapshot={snapshot} derived={derived} />

          <Card className="p-4">
            <TownMap combinedRiskByDistrict={derived.combinedRiskByDistrict} />
          </Card>

          <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                data-testid={`tab-${id}`}
                onClick={() => setActiveTab(id)}
                className={clsx(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === id ? "bg-sky-600 text-white" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {activeTab === "flood" && (
            <FloodRiskPanel readings={snapshot.floodReadings} predictions={derived.floodPredictions} />
          )}
          {activeTab === "traffic" && (
            <TrafficPanel readings={snapshot.trafficReadings} predictions={derived.trafficPredictions} />
          )}
          {activeTab === "hotspots" && (
            <HotspotPanel readings={snapshot.incidentReadings} predictions={derived.incidentPredictions} />
          )}
          {activeTab === "budget" && <BudgetPriorityPanel items={derived.budgetPriorities} />}
        </div>

        <div className="lg:col-span-1">
          <AlertFeed alerts={snapshot.alerts} />
        </div>
      </main>
    </div>
  );
}
