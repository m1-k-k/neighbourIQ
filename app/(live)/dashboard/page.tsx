"use client";

import clsx from "clsx";
import { AlertTriangle, Car, Droplets, Landmark, MapPin } from "lucide-react";
import { useState } from "react";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { BudgetPriorityPanel } from "@/components/dashboard/BudgetPriorityPanel";
import { FloodRiskPanel } from "@/components/dashboard/FloodRiskPanel";
import { HotspotPanel } from "@/components/dashboard/HotspotPanel";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TrafficPanel } from "@/components/dashboard/TrafficPanel";
import { LiveFloodLevelGauge } from "@/components/charts/LiveFloodLevelGauge";
import { AppHeader } from "@/components/layout/AppHeader";
import { LocationSearchBar } from "@/components/layout/LocationSearchBar";
import { LiveMap } from "@/components/layout/LiveMap";
import { Card } from "@/components/ui/Card";
import { useLocation } from "@/lib/LocationContext";

const TABS = [
  { id: "flood", label: "Flood Risk", icon: Droplets },
  { id: "traffic", label: "Traffic", icon: Car },
  { id: "hotspots", label: "Hotspots", icon: AlertTriangle },
  { id: "budget", label: "Budget Priority", icon: Landmark },
] as const;

type TabId = (typeof TABS)[number]["id"];

const NAV_LINKS = [
  { href: "/dashboard", label: "Council" },
  { href: "/resident", label: "Residents" },
];

export default function LiveDashboardPage() {
  const { place, status, error, snapshot, derived, alerts, refreshCount, getDistrict } = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("flood");

  return (
    <div className="flex min-h-dvh min-h-screen min-w-0 flex-col overflow-x-clip bg-civic-mist">
      <AppHeader
        links={NAV_LINKS}
        subtitle={place ? `${place.label} · Live` : "Search a UK place"}
        controls={<LocationSearchBar />}
      />
      <main className="mx-auto grid w-full min-w-0 max-w-7xl flex-1 gap-5 px-4 py-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:px-6 md:py-6 md:pb-6 lg:grid-cols-3">
        {!snapshot || !derived || !place ? (
          <div className="lg:col-span-3">
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
                {status === "error"
                  ? error
                  : "NeighbourIQ will pull real flood, crime, weather, and traffic data for the area you search."}
              </p>
            </Card>
          </div>
        ) : (
          <>
            <div className="min-w-0 space-y-4 lg:col-span-2">
              <SummaryCards alerts={alerts} derived={derived} stageKey={refreshCount} getDistrict={getDistrict} />

              <Card key={`map-${refreshCount}`} className="animate-soft-scale-in overflow-hidden p-5 transition-smooth">
                <LiveMap place={place} districts={snapshot.districts} combinedRiskByDistrict={derived.combinedRiskByDistrict} />
              </Card>

              {!snapshot.coverage.flood && (
                <p className="rounded-lg border border-dashed border-border bg-mist px-3 py-2.5 text-xs text-muted">
                  No Environment Agency flood-monitoring station found near this location (EA coverage is
                  England-only).
                </p>
              )}
              {!snapshot.coverage.crime && (
                <p className="rounded-lg border border-dashed border-border bg-mist px-3 py-2.5 text-xs text-muted">
                  Crime data unavailable for this area (data.police.uk covers England, Wales, and Northern Ireland).
                </p>
              )}
              {!snapshot.coverage.traffic && (
                <p className="rounded-lg border border-dashed border-border bg-mist px-3 py-2.5 text-xs text-muted">
                  Live traffic isn&apos;t configured for this deployment (missing TOMTOM_API_KEY).
                </p>
              )}

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

              <div key={`${activeTab}-${refreshCount}`} className="animate-tab-panel-in">
                {activeTab === "flood" && (
                  <FloodRiskPanel
                    readings={snapshot.floodReadings}
                    predictions={derived.floodPredictions}
                    stageKey={refreshCount}
                    getDistrict={getDistrict}
                    renderTrendChart={(focusDistrictId) => {
                      const reading = snapshot.floodReadings.find((r) => r.districtId === focusDistrictId);
                      return reading ? (
                        <LiveFloodLevelGauge reading={reading} district={getDistrict(focusDistrictId)} />
                      ) : null;
                    }}
                  />
                )}
                {activeTab === "traffic" && (
                  <TrafficPanel
                    readings={snapshot.trafficReadings}
                    predictions={derived.trafficPredictions}
                    stageKey={refreshCount}
                    getDistrict={getDistrict}
                  />
                )}
                {activeTab === "hotspots" && (
                  <HotspotPanel
                    readings={snapshot.incidentReadings}
                    predictions={derived.incidentPredictions}
                    stageKey={refreshCount}
                    getDistrict={getDistrict}
                  />
                )}
                {activeTab === "budget" && (
                  <BudgetPriorityPanel
                    items={derived.budgetPriorities}
                    stageKey={refreshCount}
                    getDistrict={getDistrict}
                    showSyntheticNotice
                  />
                )}
              </div>
            </div>

            <div className="min-w-0 lg:col-span-1">
              <AlertFeed
                alerts={alerts}
                stageKey={refreshCount}
                getDistrict={getDistrict}
                emptyMessage="All clear — no live alerts for this area right now."
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
