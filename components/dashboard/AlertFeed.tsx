import clsx from "clsx";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getDistrict } from "@/lib/town";
import { AlertFeedItem } from "@/lib/types";

const SEVERITY_STYLES: Record<AlertFeedItem["severity"], { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: "bg-teal-muted/60 text-ink border-teal/25" },
  warning: { icon: AlertTriangle, classes: "bg-amber-soft text-ink border-amber/40" },
  critical: { icon: AlertOctagon, classes: "bg-red-50 text-red-900 border-red-200" },
};

export function AlertFeed({ alerts, stageKey }: { alerts: AlertFeedItem[]; stageKey?: number }) {
  const sorted = [...alerts].reverse();

  return (
    <Card className="p-5 lg:sticky lg:top-[9.5rem]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="font-display text-lg font-semibold text-ink">Live proof</p>
        <span
          key={`count-${sorted.length}`}
          className="animate-value-tick rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
        >
          {sorted.length} alert{sorted.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mb-3 text-xs text-muted">NeighbourIQ responses as the scenario unfolds</p>
      {sorted.length === 0 ? (
        <p className="animate-fade-in rounded-lg border border-dashed border-border bg-mist px-3 py-6 text-center text-xs text-muted">
          No alerts yet — advance the story to see NeighbourIQ respond.
        </p>
      ) : (
        <ul className="space-y-2.5" key={stageKey}>
          {sorted.map((alert, i) => {
            const { icon: Icon, classes } = SEVERITY_STYLES[alert.severity];
            return (
              <li
                key={alert.id}
                className={clsx(
                  "animate-alert-in flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-smooth hover:shadow-sm",
                  classes
                )}
                style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }}
              >
                <Icon size={14} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold leading-snug">{alert.message}</p>
                  <p className="mt-1 text-[10px] opacity-70">
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
