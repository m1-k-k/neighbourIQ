"use client";

import clsx from "clsx";
import { ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { useScenario } from "@/lib/ScenarioContext";

export function ScenarioControls() {
  const { stageIndex, totalStages, snapshot, advance, reset, isFinalStage } = useScenario();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Sparkles size={13} className="text-sky-600" />
          <span>Demo scenario</span>
          <span className="text-slate-300">·</span>
          <span>{snapshot.stage.timeLabel}</span>
        </div>
        <p className="mt-0.5 text-sm font-semibold text-slate-900">
          Stage {stageIndex + 1}/{totalStages}: {snapshot.stage.label}
        </p>
        <p className="max-w-2xl truncate text-xs text-slate-500">{snapshot.stage.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: totalStages }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                "h-2 w-6 rounded-full transition-colors",
                i <= stageIndex ? "bg-sky-600" : "bg-slate-200"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          data-testid="scenario-reset"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <button
          type="button"
          data-testid="scenario-advance"
          onClick={advance}
          disabled={isFinalStage}
          className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Advance <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
