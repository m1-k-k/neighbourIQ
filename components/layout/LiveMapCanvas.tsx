"use client";

import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import { RISK_FILL_COLORS } from "@/lib/riskColors";
import { District, RiskLevel } from "@/lib/types";

export function LiveMapCanvas({
  center,
  districts,
  combinedRiskByDistrict,
}: {
  center: { lat: number; lon: number };
  districts: District[];
  combinedRiskByDistrict: Record<string, RiskLevel>;
}) {
  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "360px", width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {districts.map((district) => {
        if (district.lat === undefined || district.lon === undefined) return null;
        const level = combinedRiskByDistrict[district.id] ?? "Low";
        const color = RISK_FILL_COLORS[level];
        return (
          <CircleMarker
            key={district.id}
            center={[district.lat, district.lon]}
            radius={16}
            pathOptions={{ color, fillColor: color, fillOpacity: level === "Low" ? 0.35 : 0.55, weight: 2 }}
          >
            <Tooltip direction="top">
              <span className="font-semibold">{district.name}</span> — {level} risk
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
