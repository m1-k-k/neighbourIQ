"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { District, TrafficReading } from "@/lib/types";

export function TrafficCongestionChart({
  readings,
  getDistrict,
}: {
  readings: TrafficReading[];
  getDistrict: (id: string) => District;
}) {
  const data = useMemo(
    () =>
      readings.map((r) => ({
        district: getDistrict(r.districtId).name.split(" ")[0],
        congestion: r.congestionPct,
      })),
    [readings, getDistrict]
  );

  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-muted">Congestion by district (current stage)</p>
      <div className="min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="district" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={32} />
            <Tooltip formatter={(value) => [`${Number(value ?? 0)}%`, "Congestion"]} />
            <Bar dataKey="congestion" fill="#0284c7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
