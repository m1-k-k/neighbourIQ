import { memo } from "react";
import { DISTRICTS } from "@/lib/town";
import { RISK_FILL_COLORS } from "@/lib/riskColors";
import { RiskLevel } from "@/lib/types";

const LEGEND: RiskLevel[] = ["Low", "Medium", "High", "Severe"];

export const TownMap = memo(function TownMap({
  combinedRiskByDistrict,
}: {
  combinedRiskByDistrict: Record<string, RiskLevel>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <svg viewBox="0 0 800 600" className="w-full rounded-lg border border-slate-200 bg-sky-50">
        <path
          d="M 0 560 C 150 520, 250 590, 400 555 C 520 528, 600 585, 800 545 L 800 600 L 0 600 Z"
          fill="#bfdbfe"
          opacity={0.7}
        />
        {DISTRICTS.map((district) => {
          const level = combinedRiskByDistrict[district.id] ?? "Low";
          const { x, y, width, height } = district.rect;
          return (
            <g key={district.id}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={14}
                fill={RISK_FILL_COLORS[level]}
                fillOpacity={0.22}
                stroke={RISK_FILL_COLORS[level]}
                strokeWidth={2}
              />
              <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" className="fill-slate-900 text-[15px] font-semibold">
                {district.name}
              </text>
              <text x={x + width / 2} y={y + height / 2 + 14} textAnchor="middle" className="fill-slate-500 text-[10px]">
                {district.tagline}
              </text>
              <text
                x={x + width / 2}
                y={y + height / 2 + 34}
                textAnchor="middle"
                fill={RISK_FILL_COLORS[level]}
                className="text-[11px] font-bold uppercase tracking-wide"
              >
                {level} risk
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Risk legend:</span>
        {LEGEND.map((level) => (
          <span key={level} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RISK_FILL_COLORS[level] }} />
            {level}
          </span>
        ))}
      </div>
    </div>
  );
});
