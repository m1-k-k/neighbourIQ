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
  const { snapshot, derived, stageIndex } = useScenario();
  const [activeTab, setActiveTab] = useState<TabId>("flood");

  return (
    <div className="flex min-h-screen flex-col bg-civic-mist">
      <AppHeader />
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-5 px-6 py-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SummaryCards snapshot={snapshot} derived={derived} stageKey={stageIndex} />

          <Card key={`map-${stageIndex}`} className="animate-soft-scale-in p-5 transition-smooth">
            <TownMap combinedRiskByDistrict={derived.combinedRiskByDistrict} stageKey={stageIndex} />
          </Card>

          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1.5 shadow-sm">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                data-testid={`tab-${id}`}
                onClick={() => setActiveTab(id)}
                className={clsx(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-smooth",
                  activeTab === id ? "bg-ink text-white shadow-sm" : "text-muted hover:bg-mist hover:text-ink"
                )}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          <div key={`${activeTab}-${stageIndex}`} className="animate-tab-panel-in">
            {activeTab === "flood" && (
              <FloodRiskPanel
                readings={snapshot.floodReadings}
                predictions={derived.floodPredictions}
                stageKey={stageIndex}
              />
            )}
            {activeTab === "traffic" && (
              <TrafficPanel
                readings={snapshot.trafficReadings}
                predictions={derived.trafficPredictions}
                stageKey={stageIndex}
              />
            )}
            {activeTab === "hotspots" && (
              <HotspotPanel
                readings={snapshot.incidentReadings}
                predictions={derived.incidentPredictions}
                stageKey={stageIndex}
              />
            )}
            {activeTab === "budget" && (
              <BudgetPriorityPanel items={derived.budgetPriorities} stageKey={stageIndex} />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AlertFeed alerts={snapshot.alerts} stageKey={stageIndex} />
        </div>
      </main>
    </div>
  );
}
