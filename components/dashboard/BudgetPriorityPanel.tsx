import { Landmark } from "lucide-react";
import { BudgetAllocationChart } from "@/components/charts/BudgetAllocationChart";
import { Card } from "@/components/ui/Card";
import { getDistrict } from "@/lib/town";
import { BudgetPriorityItem } from "@/lib/types";

export function BudgetPriorityPanel({ items }: { items: BudgetPriorityItem[] }) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <BudgetAllocationChart items={items} />
      </Card>
      <div className="space-y-2">
        {items.map((item) => {
          const district = getDistrict(item.districtId);
          return (
            <Card key={item.districtId} className="flex items-center gap-4 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                #{item.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <Landmark size={14} className="text-slate-500" /> {district.name}
                  </p>
                  <span className="text-sm font-bold text-violet-700">{item.priorityScore}/100</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{item.rationale}</p>
                <p className="mt-1 text-xs font-medium text-slate-800">
                  Recommended: {item.recommendedAction}{" "}
                  <span className="text-slate-400">(est. £{item.estCostGBP.toLocaleString()})</span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
