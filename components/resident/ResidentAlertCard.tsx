import clsx from "clsx";
import { getDistrict } from "@/lib/town";
import { VulnerableResident } from "@/lib/types";

const STATUS_STYLES: Record<VulnerableResident["alertStatus"], string> = {
  none: "bg-slate-100 text-slate-500 border-slate-200",
  monitoring: "bg-amber-100 text-amber-800 border-amber-300",
  alerted: "bg-red-100 text-red-800 border-red-300",
};

export function ResidentAlertCard({ resident }: { resident: VulnerableResident }) {
  const district = getDistrict(resident.districtId);

  return (
    <div className={clsx("rounded-lg border p-4", STATUS_STYLES[resident.alertStatus])}>
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold">{resident.name}</p>
        <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
          {resident.alertStatus}
        </span>
      </div>
      <p className="text-xs opacity-80">
        {district.name} · Age {resident.ageBand}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {resident.riskFactors.map((factor) => (
          <li key={factor} className="rounded-full bg-white/70 px-2 py-0.5 text-[11px]">
            {factor}
          </li>
        ))}
      </ul>
    </div>
  );
}
