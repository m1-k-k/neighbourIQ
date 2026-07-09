import { Landmark } from "lucide-react";
import { BudgetAllocationChart } from "@/components/charts/BudgetAllocationChart";
import { Card } from "@/components/ui/Card";
import { getDistrict } from "@/lib/town";
import { BudgetPriorityItem } from "@/lib/types";

export function BudgetPriorityPanel({ items, stageKey }: { items: BudgetPriorityItem[]; stageKey?: number }) {
  return (
    <div className="space-y-4">
      <Card key={`chart-${stageKey ?? 0}`} className="animate-soft-scale-in p-4">
        <BudgetAllocationChart items={items} />
      </Card>
      <div className="space-y-2">
        {items.map((item, i) => {
          const district = getDistrict(item.districtId);
          return (
            <Card
              key={`${item.districtId}-${stageKey ?? 0}`}
              className="animate-soft-scale-in flex items-center gap-4 p-4"
              style={{ animationDelay: `${80 + i * 60}ms` }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-muted text-sm font-bold text-teal">
                #{item.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <Landmark size={14} className="text-teal" /> {district.name}
                  </p>
                  <span className="text-sm font-bold text-teal">{item.priorityScore}/100</span>
                </div>
                <p className="mt-1 text-xs text-muted">{item.rationale}</p>
                <p className="mt-1 text-xs font-medium text-ink">
                  Recommended: {item.recommendedAction}{" "}
                  <span className="text-muted">(est. £{item.estCostGBP.toLocaleString()})</span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
