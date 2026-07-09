"use client";

import { memo, useEffect, useState } from "react";
import { DISTRICTS } from "@/lib/town";
import { RISK_FILL_COLORS } from "@/lib/riskColors";
import { RiskLevel } from "@/lib/types";

const LEGEND: RiskLevel[] = ["Low", "Medium", "High", "Severe"];

export const TownMap = memo(function TownMap({
  combinedRiskByDistrict,
  stageKey,
}: {
  combinedRiskByDistrict: Record<string, RiskLevel>;
  stageKey?: number;
}) {
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (stageKey === undefined) return;
    setGlow(false);
    const frame = window.requestAnimationFrame(() => setGlow(true));
    const t = window.setTimeout(() => setGlow(false), 1400);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(t);
    };
  }, [stageKey]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">Millhaven risk map</h2>
        <p className="text-xs text-muted">District risk updates as the story advances</p>
      </div>
      <svg
        viewBox="0 0 800 600"
        className={`w-full origin-center rounded-xl border border-border bg-gradient-to-br from-mist to-teal-muted/40 ${glow ? "animate-map-glow" : ""}`}
      >
        <path
          d="M 0 560 C 150 520, 250 590, 400 555 C 520 528, 600 585, 800 545 L 800 600 L 0 600 Z"
          fill="#0e7c7b"
          opacity={0.18}
          style={{ transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        {DISTRICTS.map((district, i) => {
          const level = combinedRiskByDistrict[district.id] ?? "Low";
          const { x, y, width, height } = district.rect;
          const color = RISK_FILL_COLORS[level];
          const cx = x + width / 2;
          const cy = y + height / 2;
          return (
            <g
              key={district.id}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: `${i * 40}ms`,
              }}
            >
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={14}
                fill={color}
                fillOpacity={level === "Low" ? 0.18 : 0.32}
                stroke={color}
                strokeWidth={level === "Severe" || level === "High" ? 3 : 2}
                style={{
                  transition:
                    "fill 0.9s cubic-bezier(0.22, 1, 0.36, 1), fill-opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.9s cubic-bezier(0.22, 1, 0.36, 1), stroke-width 0.6s ease",
                }}
              />
              <text
                x={x + width / 2}
                y={y + height / 2 - 6}
                textAnchor="middle"
                className="fill-ink text-[15px] font-semibold"
              >
                {district.name}
              </text>
              <text x={x + width / 2} y={y + height / 2 + 14} textAnchor="middle" className="fill-muted text-[10px]">
                {district.tagline}
              </text>
              <text
                x={x + width / 2}
                y={y + height / 2 + 34}
                textAnchor="middle"
                fill={color}
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ transition: "fill 0.9s cubic-bezier(0.22, 1, 0.36, 1)" }}
              >
                {level} risk
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="font-semibold text-ink/70">Risk legend:</span>
        {LEGEND.map((level) => (
          <span key={level} className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full transition-colors duration-700"
              style={{ backgroundColor: RISK_FILL_COLORS[level] }}
            />
            {level}
          </span>
        ))}
      </div>
    </div>
  );
});
