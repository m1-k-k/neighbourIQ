import clsx from "clsx";
import { RISK_BADGE_CLASSES } from "@/lib/riskColors";
import { RiskLevel } from "@/lib/types";

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        RISK_BADGE_CLASSES[level],
        className
      )}
    >
      {level}
    </span>
  );
}
