"use client";

import clsx from "clsx";
import { ChevronRight, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useScenario } from "@/lib/ScenarioContext";

const DEMO_ROUTES = ["/dashboard", "/resident"];

export function MobileScenarioBar() {
  const pathname = usePathname();
  const { stageIndex, snapshot, advance, reset, isFinalStage } = useScenario();
  const [pulseAdvance, setPulseAdvance] = useState(false);

  useEffect(() => {
    setPulseAdvance(true);
    const t = window.setTimeout(() => setPulseAdvance(false), 2400);
    return () => window.clearTimeout(t);
  }, [stageIndex]);

  if (!DEMO_ROUTES.includes(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-4px_20px_rgba(11,31,42,0.08)] backdrop-blur-md md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <p className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-ink">
          {snapshot.stage.label}
        </p>
        <button
          type="button"
          data-testid="scenario-reset-mobile"
          onClick={reset}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-ink"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <button
          type="button"
          data-testid="scenario-advance-mobile"
          onClick={advance}
          disabled={isFinalStage}
          className={clsx(
            "inline-flex shrink-0 items-center gap-1 rounded-lg px-3.5 py-2.5 text-xs font-semibold",
            isFinalStage
              ? "cursor-not-allowed bg-mist-deep text-muted"
              : clsx(
                  "bg-amber text-ink shadow-md shadow-amber/25",
                  pulseAdvance && "animate-pulse-ring-loop"
                )
          )}
        >
          Advance <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
