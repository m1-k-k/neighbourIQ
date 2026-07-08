"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BudgetPriorityItem } from "@/lib/types";
import { getDistrict } from "@/lib/town";

export function BudgetAllocationChart({ items }: { items: BudgetPriorityItem[] }) {
  const data = useMemo(
    () =>
      items.map((item) => ({
        district: getDistrict(item.districtId).name.split(" ")[0],
        priority: item.priorityScore,
      })),
    [items]
  );

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-slate-500">Budget priority ranking (current stage)</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="district" tick={{ fontSize: 11 }} width={70} />
          <Tooltip formatter={(value) => [`${Number(value ?? 0)}`, "Priority score"]} />
          <Bar dataKey="priority" fill="#7c3aed" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
