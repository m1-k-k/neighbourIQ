export function ConfidenceBadge({ confidencePct }: { confidencePct: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      {confidencePct}% confidence
    </span>
  );
}
