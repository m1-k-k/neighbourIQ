"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { District, Prediction } from "@/lib/types";

export function IncidentTrendChart({
  predictions,
  getDistrict,
}: {
  predictions: Record<string, Prediction>;
  getDistrict: (id: string) => District;
}) {
  const data = useMemo(
    () =>
      Object.entries(predictions).map(([districtId, prediction]) => ({
        district: getDistrict(districtId).name.split(" ")[0],
        score: prediction.score,
      })),
    [predictions, getDistrict]
  );

  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-muted">Incident hotspot score by district (current stage)</p>
      <div className="min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="district" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={32} />
            <Tooltip formatter={(value) => [`${Number(value ?? 0)}`, "Hotspot score"]} />
            <Bar dataKey="score" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
