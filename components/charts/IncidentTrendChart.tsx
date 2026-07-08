"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Prediction } from "@/lib/types";
import { getDistrict } from "@/lib/town";

export function IncidentTrendChart({ predictions }: { predictions: Record<string, Prediction> }) {
  const data = useMemo(
    () =>
      Object.entries(predictions).map(([districtId, prediction]) => ({
        district: getDistrict(districtId).name.split(" ")[0],
        score: prediction.score,
      })),
    [predictions]
  );

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-slate-500">Incident hotspot score by district (current stage)</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="district" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => [`${Number(value ?? 0)}`, "Hotspot score"]} />
          <Bar dataKey="score" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
