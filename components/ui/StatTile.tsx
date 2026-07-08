import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Card } from "./Card";

export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="flex items-start gap-3 p-4">
      {Icon && (
        <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
          <Icon size={18} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="truncate text-xl font-semibold text-slate-900">{value}</p>
        {sub && <p className="mt-0.5 truncate text-xs text-slate-500">{sub}</p>}
      </div>
    </Card>
  );
}
