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
import { RiskTrendChart } from "@/components/charts/RiskTrendChart";
import { AppHeader } from "@/components/layout/AppHeader";
import { ScenarioControls } from "@/components/layout/ScenarioControls";
import { TownMap } from "@/components/layout/TownMap";
import { Card } from "@/components/ui/Card";
import { useScenario } from "@/lib/ScenarioContext";
import { getDistrict, TOWN_NAME } from "@/lib/town";

const TABS = [
  { id: "flood", label: "Flood Risk", icon: Droplets },
  { id: "traffic", label: "Traffic", icon: Car },
  { id: "hotspots", label: "Hotspots", icon: AlertTriangle },
  { id: "budget", label: "Budget Priority", icon: Landmark },
] as const;

type TabId = (typeof TABS)[number]["id"];

const NAV_LINKS = [
  { href: "/demo/dashboard", label: "Council" },
  { href: "/demo/resident", label: "Residents" },
];

export default function DemoDashboardPage() {
  const { snapshot, derived, stageIndex } = useScenario();
  const [activeTab, setActiveTab] = useState<TabId>("flood");

  return (
    <div className="flex min-h-dvh min-h-screen min-w-0 flex-col overflow-x-clip bg-civic-mist">
      <AppHeader links={NAV_LINKS} subtitle={`${TOWN_NAME} · Live demo`} controls={<ScenarioControls />} />
      <main className="mx-auto grid w-full min-w-0 max-w-7xl flex-1 gap-5 px-4 py-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:px-6 md:py-6 md:pb-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 lg:col-span-2">
          <SummaryCards alerts={snapshot.alerts} derived={derived} stageKey={stageIndex} getDistrict={getDistrict} />

          <Card key={`map-${stageIndex}`} className="animate-soft-scale-in overflow-hidden p-5 transition-smooth">
            <TownMap combinedRiskByDistrict={derived.combinedRiskByDistrict} stageKey={stageIndex} />
          </Card>

          <div className="flex min-w-0 gap-1 rounded-xl border border-border bg-surface p-1.5 shadow-sm">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                data-testid={`tab-${id}`}
                onClick={() => setActiveTab(id)}
                aria-label={label}
                className={clsx(
                  "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-semibold transition-smooth sm:px-3",
                  activeTab === id ? "bg-ink text-white shadow-sm" : "text-muted hover:bg-mist hover:text-ink"
                )}
              >
                <Icon size={15} className="shrink-0" />
                <span className="hidden truncate sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div key={`${activeTab}-${stageIndex}`} className="animate-tab-panel-in">
            {activeTab === "flood" && (
              <FloodRiskPanel
                readings={snapshot.floodReadings}
                predictions={derived.floodPredictions}
                stageKey={stageIndex}
                getDistrict={getDistrict}
                renderTrendChart={(focusDistrictId) => <RiskTrendChart focusDistrictId={focusDistrictId} />}
              />
            )}
            {activeTab === "traffic" && (
              <TrafficPanel
                readings={snapshot.trafficReadings}
                predictions={derived.trafficPredictions}
                stageKey={stageIndex}
                getDistrict={getDistrict}
              />
            )}
            {activeTab === "hotspots" && (
              <HotspotPanel
                readings={snapshot.incidentReadings}
                predictions={derived.incidentPredictions}
                stageKey={stageIndex}
                getDistrict={getDistrict}
              />
            )}
            {activeTab === "budget" && (
              <BudgetPriorityPanel items={derived.budgetPriorities} stageKey={stageIndex} getDistrict={getDistrict} />
            )}
          </div>
        </div>

        <div className="min-w-0 lg:col-span-1">
          <AlertFeed
            alerts={snapshot.alerts}
            stageKey={stageIndex}
            getDistrict={getDistrict}
            emptyMessage="No alerts yet — advance the story to see NeighbourIQ respond."
          />
        </div>
      </main>
    </div>
  );
}
