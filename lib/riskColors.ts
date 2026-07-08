import { RiskLevel } from "./types";

export const RISK_BADGE_CLASSES: Record<RiskLevel, string> = {
  Low: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  High: "bg-orange-100 text-orange-800 border-orange-300",
  Severe: "bg-red-100 text-red-800 border-red-300",
};

export const RISK_FILL_COLORS: Record<RiskLevel, string> = {
  Low: "#10b981",
  Medium: "#f59e0b",
  High: "#f97316",
  Severe: "#ef4444",
};

export const RISK_CHART_COLORS: Record<RiskLevel, string> = RISK_FILL_COLORS;
