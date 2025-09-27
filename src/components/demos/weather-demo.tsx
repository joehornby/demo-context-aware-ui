"use client";

import { useMemo, useState } from "react";
import type { AppContext } from "@/lib/context";
import { useGeoWeather } from "@/hooks/useGeoWeather";

type Props = { context: AppContext };

export function WeatherDemo({ context }: Props) {
  const [override, setOverride] = useState<"sunny" | "rainy" | "cloudy" | null>(
    null
  );

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

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Your day plan</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Override weather:</span>
          {(["sunny", "cloudy", "rainy"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setOverride((curr) => (curr === k ? null : k))}
              className={`rounded-md border px-2 py-1 text-xs ${
                override === k
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white hover:bg-slate-50 border-slate-200"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-md bg-white p-3 border">
        <p className="text-slate-700">
          Location: <span className="font-medium">{locationText}</span>
        </p>
        <p className="text-slate-700">
          Weather:{" "}
          <span className="font-medium">
            {weather.condition}, {weather.tempC}°C
          </span>
        </p>
        {outlook && (
          <p className="text-slate-700">
            Outlook: <span className="font-medium">{outlook}</span>
          </p>
        )}
      </div>

      <div className="mt-4 rounded-md bg-emerald-50 border border-emerald-200 p-3">
        <p className="text-emerald-900 text-sm">
          Suggestion: <span className="font-medium">{suggestion}</span>
        </p>
      </div>

      <p className="mt-auto text-xs text-slate-500">
        Tip: This can pull real signals (with consent) and propose contextual
        actions immediately on load.
      </p>
    </div>
  );
}