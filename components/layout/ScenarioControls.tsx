"use client";

import clsx from "clsx";
import { ChevronRight, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useScenario } from "@/lib/ScenarioContext";

export function ScenarioControls() {
  const { stageIndex, totalStages, snapshot, advance, reset, isFinalStage } = useScenario();
  const [pulseAdvance, setPulseAdvance] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate timed pulse on each stage change
    setPulseAdvance(true);
    const t = window.setTimeout(() => setPulseAdvance(false), 2400);
    return () => window.clearTimeout(t);
  }, [stageIndex]);

  return (
    <div className="border-b border-border bg-surface px-4 py-3 shadow-[0_4px_20px_rgba(11,31,42,0.06)] md:px-6 md:py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 md:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted sm:gap-2 sm:text-[11px]">
            <span className="rounded bg-teal-muted px-1.5 py-0.5 text-teal">Demo story</span>
            <span className="hidden text-border sm:inline">·</span>
            <span key={`time-${stageIndex}`} className="animate-stage-swap">
              {snapshot.stage.timeLabel}
            </span>
            <span className="text-border">·</span>
            <span>
              Stage {stageIndex + 1}/{totalStages}
            </span>
          </div>
          <div key={`copy-${stageIndex}`} className="animate-stage-swap">
            <p className="mt-0.5 hidden font-display text-lg font-semibold text-ink sm:mt-1 sm:block sm:text-xl md:text-2xl">
              {snapshot.stage.label}
            </p>
            <p className="mt-0.5 hidden max-w-2xl text-sm text-muted sm:block">{snapshot.stage.description}</p>
          </div>

          <div className="mt-2 flex gap-1 sm:mt-3 sm:gap-1.5" aria-hidden>
            {Array.from({ length: totalStages }).map((_, i) => (
              <span
                key={i}
                className={clsx(
                  "h-1 flex-1 max-w-12 rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-1.5 sm:max-w-16",
                  i < stageIndex ? "bg-teal" : i === stageIndex ? "animate-progress-fill bg-amber" : "bg-mist-deep"
                )}
              />
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <button
            type="button"
            data-testid="scenario-reset"
            onClick={reset}
            className="hover-lift inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-mist"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button
            type="button"
            data-testid="scenario-advance"
            onClick={advance}
            disabled={isFinalStage}
            className={clsx(
              "inline-flex min-h-11 items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition-smooth",
              isFinalStage
                ? "cursor-not-allowed bg-mist-deep text-muted"
                : clsx(
                    "hover-lift bg-amber text-ink shadow-md shadow-amber/25 hover:shadow-lg hover:shadow-amber/30",
                    pulseAdvance ? "animate-pulse-ring-loop" : "animate-pulse-ring"
                  )
            )}
          >
            Advance story <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
