"use client";

import clsx from "clsx";
import { Loader2, MapPin, RefreshCw, Search } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "@/lib/LocationContext";
import { GeocodeResult } from "@/lib/types";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function formatRelativeTime(date: Date, nowMs: number): string {
  const seconds = Math.max(0, Math.round((nowMs - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.round(seconds / 60)}m ago`;
}

function useRelativeTime(date: Date | null): string {
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (!date) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clears the label when there's no timestamp to format
      setLabel("");
      return;
    }
    const tick = () => setLabel(formatRelativeTime(date, Date.now()));
    tick();
    const t = window.setInterval(tick, 15000);
    return () => window.clearInterval(t);
  }, [date]);
  return label;
}

export function LocationSearchBar() {
  const { query, status, error, place, selectPlace, refresh, lastUpdatedAt } = useLocation();
  const [inputValue, setInputValue] = useState(query);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedInput = useDebouncedValue(inputValue, 300);
  const requestId = useRef(0);
  const relativeTime = useRelativeTime(lastUpdatedAt);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs the local input value when context's query changes externally (e.g. after selectPlace)
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedInput.trim();
    if (trimmed.length < 2 || trimmed === place?.label) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clears stale suggestions before the debounced fetch below would otherwise run
      setSuggestions([]);
      return;
    }
    const id = ++requestId.current;
    fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`)
      .then((res) => (res.ok ? res.json() : { results: [] }))
      .then((body) => {
        if (id === requestId.current) setSuggestions(body.results ?? []);
      })
      .catch(() => {
        if (id === requestId.current) setSuggestions([]);
      });
  }, [debouncedInput, place]);

  const handleSelect = (result: GeocodeResult) => {
    setShowSuggestions(false);
    setSuggestions([]);
    void selectPlace(result);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (suggestions[0]) handleSelect(suggestions[0]);
  };

  const isLoading = status === "loading";

  return (
    <div className="border-b border-border bg-surface px-4 py-3 shadow-[0_4px_20px_rgba(11,31,42,0.06)] md:px-6 md:py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <form onSubmit={handleSubmit} className="relative min-w-0 flex-1 md:max-w-md">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
            <Search size={15} className="shrink-0 text-muted" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search a UK postcode or place…"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              data-testid="location-search-input"
            />
            {isLoading && <Loader2 size={15} className="shrink-0 animate-spin text-teal" />}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-40 mt-1 max-h-64 overflow-auto rounded-lg border border-border bg-surface shadow-lg">
              {suggestions.map((s) => (
                <li key={`${s.label}-${s.lat}-${s.lon}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(s)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-mist"
                  >
                    <MapPin size={13} className="shrink-0 text-teal" />
                    <span className="min-w-0 truncate">{s.label}</span>
                    {s.adminDistrict && <span className="ml-auto shrink-0 text-xs text-muted">{s.adminDistrict}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="flex items-center gap-2.5">
          {place && status === "ready" && (
            <span className="hidden text-xs text-muted sm:inline">Live · updated {relativeTime || "just now"}</span>
          )}
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={!place || isLoading}
            data-testid="location-refresh"
            className={clsx(
              "hover-lift inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-mist disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>
      {error && <p className="mx-auto mt-2 max-w-7xl text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
