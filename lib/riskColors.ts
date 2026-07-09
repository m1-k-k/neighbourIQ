import { RiskLevel } from "./types";

export const RISK_BADGE_CLASSES: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Medium: "bg-amber-soft text-ink border-amber/40",
  High: "bg-orange-50 text-orange-900 border-orange-200",
  Severe: "bg-red-50 text-red-900 border-red-200",
};

export const RISK_FILL_COLORS: Record<RiskLevel, string> = {
  Low: "#0e7c7b",
  Medium: "#e8a838",
  High: "#e07020",
  Severe: "#d64545",
};

export const RISK_CHART_COLORS: Record<RiskLevel, string> = RISK_FILL_COLORS;
