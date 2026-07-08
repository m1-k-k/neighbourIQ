"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { DerivedScenario, getDerived } from "./derived";
import { getSnapshot, TOTAL_STAGES } from "./scenario";
import { ScenarioSnapshot } from "./types";

interface ScenarioContextValue {
  stageIndex: number;
  totalStages: number;
  snapshot: ScenarioSnapshot;
  derived: DerivedScenario;
  advance: () => void;
  reset: () => void;
  isFinalStage: boolean;
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [stageIndex, setStageIndex] = useState(0);
  const snapshot = useMemo(() => getSnapshot(stageIndex), [stageIndex]);
  const derived = useMemo(() => getDerived(stageIndex), [stageIndex]);
  const advance = useCallback(() => setStageIndex((i) => Math.min(i + 1, TOTAL_STAGES - 1)), []);
  const reset = useCallback(() => setStageIndex(0), []);

  const value: ScenarioContextValue = useMemo(
    () => ({
      stageIndex,
      totalStages: TOTAL_STAGES,
      snapshot,
      derived,
      advance,
      reset,
      isFinalStage: stageIndex === TOTAL_STAGES - 1,
    }),
    [stageIndex, snapshot, derived, advance, reset]
  );

  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
}

export function useScenario(): ScenarioContextValue {
  const ctx = useContext(ScenarioContext);
  if (!ctx) throw new Error("useScenario must be used within a ScenarioProvider");
  return ctx;
}
