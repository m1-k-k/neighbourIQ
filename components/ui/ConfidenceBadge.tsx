export function ConfidenceBadge({ confidencePct }: { confidencePct: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-muted">
      {confidencePct}% confidence
    </span>
  );
}
