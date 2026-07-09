"use client";

import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { PredictionFactor } from "@/lib/types";

export function ExplanationPopover({ explanation, factors }: { explanation: string; factors: PredictionFactor[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-xs font-medium text-teal hover:text-ink"
      >
        <HelpCircle size={14} /> Why?
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-2 w-72 rounded-lg border border-border bg-surface p-3 text-xs shadow-lg">
          <p className="mb-2 text-ink/80">{explanation}</p>
          <ul className="space-y-1.5">
            {factors.map((f) => (
              <li key={f.label} className="flex items-center justify-between gap-2">
                <span className="text-muted">
                  {f.label} <span className="text-muted/70">({Math.round(f.weight * 100)}%)</span>
                </span>
                <span className="font-medium text-ink">{f.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
