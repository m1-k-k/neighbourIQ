import clsx from "clsx";
import { District, VulnerableResident } from "@/lib/types";

const STATUS_STYLES: Record<VulnerableResident["alertStatus"], string> = {
  none: "bg-mist text-muted border-border",
  monitoring: "bg-amber-soft text-ink border-amber/50",
  alerted: "bg-red-50 text-red-950 border-red-300",
};

const STATUS_LABEL: Record<VulnerableResident["alertStatus"], string> = {
  none: "Clear",
  monitoring: "Monitoring",
  alerted: "Alerted",
};

export function ResidentAlertCard({
  resident,
  getDistrict,
}: {
  resident: VulnerableResident;
  getDistrict: (id: string) => District;
}) {
  const district = getDistrict(resident.districtId);
  const isAlerted = resident.alertStatus === "alerted";

  return (
    <div
      className={clsx(
        "hover-lift rounded-xl border p-4 shadow-sm transition-smooth",
        STATUS_STYLES[resident.alertStatus],
        isAlerted && "ring-2 ring-red-200"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-display text-base font-semibold">{resident.name}</p>
        <span
          className={clsx(
            "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-smooth",
            isAlerted ? "bg-red-600 text-white" : "bg-white/80 text-ink"
          )}
        >
          {STATUS_LABEL[resident.alertStatus]}
        </span>
      </div>
      <p className="mt-0.5 text-xs opacity-80">
        {district.name} · Age {resident.ageBand}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {resident.riskFactors.map((factor) => (
          <li key={factor} className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-medium text-ink">
            {factor}
          </li>
        ))}
      </ul>
    </div>
  );
}
