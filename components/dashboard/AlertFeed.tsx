import clsx from "clsx";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getDistrict } from "@/lib/town";
import { AlertFeedItem } from "@/lib/types";

const SEVERITY_STYLES: Record<AlertFeedItem["severity"], { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: "bg-sky-50 text-sky-800 border-sky-200" },
  warning: { icon: AlertTriangle, classes: "bg-amber-50 text-amber-800 border-amber-200" },
  critical: { icon: AlertOctagon, classes: "bg-red-50 text-red-800 border-red-200" },
};

export function AlertFeed({ alerts }: { alerts: AlertFeedItem[] }) {
  const sorted = [...alerts].reverse();

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-slate-900">Live alert feed</p>
      {sorted.length === 0 ? (
        <p className="text-xs text-slate-500">No alerts yet — advance the scenario to see NeighbourIQ respond.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((alert) => {
            const { icon: Icon, classes } = SEVERITY_STYLES[alert.severity];
            return (
              <li key={alert.id} className={clsx("flex items-start gap-2 rounded-md border px-3 py-2 text-xs", classes)}>
                <Icon size={14} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="mt-0.5 text-[10px] opacity-70">
                    {alert.districtId ? `${getDistrict(alert.districtId).name} · ` : ""}
                    {alert.timeLabel}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
