"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppContext } from "@/lib/context";
import { useGeoWeather } from "@/hooks/useGeoWeather";

type Props = { context: AppContext };

export function WeatherDemo({ context }: Props) {
  const [override] = useState<"sunny" | "rainy" | "cloudy" | null>(null);

  const { geo, weather: liveWeather, outlook } = useGeoWeather(context);

  const weather = useMemo(
    () => ({
      condition:
        override ??
        liveWeather?.condition ??
        context.weather?.condition ??
        "cloudy",
      tempC: liveWeather?.tempC ?? context.weather?.tempC ?? 18,
    }),
    [context.weather, liveWeather, override]
  );

  const locationText = useMemo(() => {
    const city = geo?.city ?? context.location?.city;
    const country = geo?.country ?? context.location?.country;
    return city || country
      ? [city, country].filter(Boolean).join(", ")
      : "Unknown";
  }, [geo, context.location]);

  const suggestion =
    weather.condition === "sunny"
      ? "Perfect for a nearby park run or an outdoor market."
      : weather.condition === "rainy"
      ? "How about a museum visit or a cozy cafe?"
      : "Great time for a gallery stroll or a matinee.";

  // Suggestions from OpenTripMap + Ticketmaster via API route
  type Suggestion = {
    source: "opentripmap" | "ticketmaster";
    title: string;
    url: string;
    when?: string | null;
    category?: string | null;
  };

  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasCoords = geo?.lat != null && geo?.lon != null;
    if (!hasCoords) return; // wait until we know where we are

    const controller = new AbortController();
    async function run() {
      try {
        setLoading(true);
        setError(null);
        setSuggestions(null);
        const params = new URLSearchParams({
          lat: String(geo!.lat),
          lon: String(geo!.lon),
          condition: weather.condition,
          tempC: String(weather.tempC),
          localTime: new Date().toLocaleTimeString(),
        });
        const res = await fetch(`/api/suggestions?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Suggestions failed: ${res.status}`);
        const data = await res.json();
        setSuggestions(
          Array.isArray(data?.suggestions) ? data.suggestions : []
        );
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load suggestions";
        setError(message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    run();
    return () => controller.abort();
  }, [geo, weather.condition, weather.tempC]);

  return (
    <div className="flex h-full flex-col">
      <h3 className="text-xl font-semibold mb-4">Your day plan</h3>

      <div className="mt-4 rounded-md bg-white p-3 border">
        <p className="text-stone-700">
          Location: <span className="font-medium">{locationText}</span>
        </p>
        <p className="text-stone-700">
          Weather:{" "}
          <span className="font-medium capitalize">
            {weather.condition}, {weather.tempC}°C
          </span>
        </p>
        {outlook && (
          <p className="text-stone-700">
            Outlook: <span className="font-medium">{outlook}</span>
          </p>
        )}
      </div>

      <div className="mt-4 rounded-md bg-emerald-50 border border-emerald-200 p-3">
        <p className="text-emerald-900 text-sm">
          Suggestion: <span className="font-medium">{suggestion}</span>
        </p>
      </div>

      <div className="mt-4 rounded-md bg-white border p-3">
        <p className="text-stone-800 font-medium mb-2">Nearby ideas</p>
        {geo?.lat == null || geo?.lon == null ? (
          <p className="text-sm text-stone-600">Waiting for location…</p>
        ) : loading ? (
          <p className="text-sm text-stone-600">Loading suggestions…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : suggestions && suggestions.length > 0 ? (
          <ul className="text-sm space-y-2 list-disc pl-5">
            {suggestions.slice(0, 6).map((s, idx) => (
              <li key={idx} className="text-stone-800">
                <span className="mr-2 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-wide border text-stone-600 bg-stone-50">
                  {s.source === "ticketmaster" ? "Event" : "Place"}
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline decoration-stone-300 hover:decoration-stone-800"
                >
                  {s.title}
                </a>
                {s.when && (
                  <span className="ml-2 text-stone-500">{s.when}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-stone-600">
            No suggestions found right now.
          </p>
        )}
      </div>

      <p className="mt-auto text-xs text-stone-500">
        Tip: This can pull real signals (with consent) and propose contextual
        actions immediately on load.
      </p>
    </div>
  );
}