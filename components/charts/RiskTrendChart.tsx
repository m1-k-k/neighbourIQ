"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useScenario } from "@/lib/ScenarioContext";
import { getFloodScoreTrend } from "@/lib/derived";
import { getDistrict } from "@/lib/town";

export function RiskTrendChart({ focusDistrictId }: { focusDistrictId: string }) {
  const { stageIndex } = useScenario();
  const district = getDistrict(focusDistrictId);
  const data = useMemo(() => getFloodScoreTrend(stageIndex, focusDistrictId), [stageIndex, focusDistrictId]);

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted">Flood risk trend — {district.name}</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => [`${Number(value ?? 0)}`, "Risk score"]} />
          <Line type="monotone" dataKey="score" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
