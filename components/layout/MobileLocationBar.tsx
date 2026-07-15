"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocation } from "@/lib/LocationContext";

const LIVE_ROUTES = ["/dashboard", "/resident"];

export function MobileLocationBar() {
  const pathname = usePathname();
  const { place, status, refresh } = useLocation();

  if (!LIVE_ROUTES.includes(pathname) || !place) return null;

  const isLoading = status === "loading";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-4px_20px_rgba(11,31,42,0.08)] backdrop-blur-md md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <p className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-ink">{place.label}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading}
          data-testid="location-refresh-mobile"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-ink disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
        </button>
      </div>
    </div>
  );
}
