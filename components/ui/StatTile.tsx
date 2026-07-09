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
    <Card className="hover-lift flex items-start gap-3 p-4 hover:shadow-md">
      {Icon && (
        <div className="rounded-lg bg-teal-muted p-2 text-teal transition-smooth">
          <Icon size={18} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p key={String(value)} className="animate-value-tick truncate font-display text-xl font-semibold text-ink">
          {value}
        </p>
        {sub && (
          <p key={sub} className="animate-value-tick mt-0.5 truncate text-xs text-muted" style={{ animationDelay: "60ms" }}>
            {sub}
          </p>
        )}
      </div>
    </Card>
  );
}
