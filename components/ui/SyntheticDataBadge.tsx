import { FlaskConical } from "lucide-react";

export function SyntheticDataBadge({ label }: { label: string }) {
  return (
    <p className="flex items-start gap-1.5 rounded-md bg-mist px-2.5 py-2 text-[11px] leading-snug text-muted">
      <FlaskConical size={13} className="mt-0.5 shrink-0 text-teal" />
      {label}
    </p>
  );
}
