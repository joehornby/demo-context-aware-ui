"use client";

import { useMemo, useState } from "react";
import type { AppContext } from "@/lib/context";

type Props = { context: AppContext };

export function WeatherDemo({ context }: Props) {
  const [override, setOverride] = useState<
    "sunny" | "rainy" | "cloudy" | null
  >(null);

  const weather = useMemo(
    () => ({
      condition: override ?? context.weather?.condition ?? "cloudy",
      tempC: context.weather?.tempC ?? 18,
    }),
    [context.weather, override]
  );

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
        <div className="flex gap-2">
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
          Location: <span className="font-medium">London, UK</span>
        </p>
        <p className="text-slate-700">
          Weather:{" "}
          <span className="font-medium">
            {weather.condition}, {weather.tempC}°C
          </span>
        </p>
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