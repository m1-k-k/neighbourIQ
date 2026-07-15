import { DerivedScenario } from "./derived";
import { AlertFeedItem, District, LocationSnapshot } from "./types";

function nowLabel(): string {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// Live equivalent of the demo's scripted STAGE_OVERRIDES.alerts — generated from real current
// conditions instead of canned copy.
export function buildAlerts(snapshot: LocationSnapshot, derived: DerivedScenario, districts: District[]): AlertFeedItem[] {
  const alerts: AlertFeedItem[] = [];
  const byId = new Map(districts.map((d) => [d.id, d]));
  const timeLabel = nowLabel();

  for (const district of districts) {
    const level = derived.combinedRiskByDistrict[district.id];
    if (level === "Severe" || level === "High") {
      alerts.push({
        id: `live-risk-${district.id}`,
        severity: level === "Severe" ? "critical" : "warning",
        districtId: district.id,
        message: `${district.name} is showing ${level.toUpperCase()} combined risk right now.`,
        timeLabel,
      });
    }
  }

  const activeFloodWarning = snapshot.floodReadings.find(
    (r) => r.floodWarningSeverity !== undefined && r.floodWarningSeverity <= 2
  );
  if (activeFloodWarning) {
    alerts.push({
      id: "live-flood-warning",
      severity: activeFloodWarning.floodWarningSeverity === 1 ? "critical" : "warning",
      districtId: null,
      message: "An official Environment Agency flood warning is active near this location.",
      timeLabel,
    });
  }

  const closedRoad = snapshot.trafficReadings.find((r) => r.incidentOnRoad);
  if (closedRoad) {
    const district = byId.get(closedRoad.districtId);
    alerts.push({
      id: `live-road-${closedRoad.districtId}`,
      severity: "warning",
      districtId: closedRoad.districtId,
      message: `Road closure or major incident reported near ${district?.name ?? "a monitored sector"}.`,
      timeLabel,
    });
  }

  if (snapshot.weather.alertType !== "none") {
    alerts.push({
      id: "live-weather",
      severity: snapshot.weather.alertType === "flood" ? "critical" : "warning",
      districtId: null,
      message: `Weather alert: ${snapshot.weather.condition}.`,
      timeLabel,
    });
  }

  return alerts;
}
