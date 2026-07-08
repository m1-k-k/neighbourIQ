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
        className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900"
      >
        <HelpCircle size={14} /> Why?
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
          <p className="mb-2 text-slate-700">{explanation}</p>
          <ul className="space-y-1.5">
            {factors.map((f) => (
              <li key={f.label} className="flex items-center justify-between gap-2">
                <span className="text-slate-500">
                  {f.label} <span className="text-slate-400">({Math.round(f.weight * 100)}%)</span>
                </span>
                <span className="font-medium text-slate-700">{f.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
