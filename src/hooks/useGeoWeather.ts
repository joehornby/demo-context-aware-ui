"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppContext } from "@/lib/context";
import { fetchWithTimeout } from "@/lib/utils";

type Geo = { city?: string; country?: string; lat?: number; lon?: number };
type Weather = { condition: "sunny" | "rainy" | "cloudy"; tempC: number };

type Result = {
  loading: boolean;
  geo: Geo | null;
  weather: Weather | null;
  error?: string | null;
  outlook?: string | null;
};

// Lightweight mapping from condition text to three buckets used by demo
function mapConditionToBucket(text: string): Weather["condition"] {
  const t = text.toLowerCase();
  if (/(rain|drizzle|shower|thunder)/.test(t)) return "rainy";
  if (/(sun|clear)/.test(t)) return "sunny";
  return "cloudy";
}

export function useGeoWeather(initial: AppContext | null = null): Result {
  const [state, setState] = useState<Result>({
    loading: true,
    geo: null,
    weather: null,
    error: null,
    outlook: null,
  });

  // Seed with initial context so UI has something immediately
  const seeded = useMemo<Result>(() => {
    if (!initial) return state;
    return {
      ...state,
      geo:
        state.geo ??
        (initial.location
          ? { city: initial.location.city, country: initial.location.country }
          : null),
      weather: state.weather ?? initial.weather ?? null,
    };
  }, [initial, state]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // 1) Get coarse location by IP. Use ipapi.co (no key) with fallback to ipinfo.io (no key).
        let geo: Geo | null = null;
        try {
          const res = await fetchWithTimeout("https://ipapi.co/json/", {
            timeoutMs: 4000,
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            const data = await res.json();
            geo = {
              city: data.city || undefined,
              country: data.country_name || data.country || undefined,
              lat:
                typeof data.latitude === "number" ? data.latitude : undefined,
              lon:
                typeof data.longitude === "number" ? data.longitude : undefined,
            };
          }
        } catch {}

        if (!geo) {
          try {
            const res2 = await fetchWithTimeout("https://ipinfo.io/json", {
              timeoutMs: 4000,
              headers: { Accept: "application/json" },
            });
            if (res2.ok) {
              const data2 = await res2.json();
              let lat: number | undefined;
              let lon: number | undefined;
              if (typeof data2.loc === "string" && data2.loc.includes(",")) {
                const [la, lo] = data2.loc.split(",");
                lat = parseFloat(la);
                lon = parseFloat(lo);
              }
              geo = {
                city: data2.city || undefined,
                country: data2.country || undefined,
                lat,
                lon,
              };
            }
          } catch {}
        }

        // 2) Fetch weather; prefer coordinates, fallback to city name search using open-meteo
        let weather: Weather | null = null;
        let outlook: string | null = null;
        try {
          // Try Open-Meteo with coordinates when available
          if (geo?.lat != null && geo?.lon != null) {
            const url = new URL("https://api.open-meteo.com/v1/forecast");
            url.searchParams.set("latitude", String(geo.lat));
            url.searchParams.set("longitude", String(geo.lon));
            url.searchParams.set("current", "temperature_2m,weather_code");
            url.searchParams.set("hourly", "weather_code");
            url.searchParams.set("timezone", "auto");
            url.searchParams.set("timeformat", "unixtime");
            url.searchParams.set("forecast_days", "1");
            const res = await fetchWithTimeout(url.toString(), {
              timeoutMs: 5000,
            });
            if (res.ok) {
              const d = await res.json();
              const temp = d?.current?.temperature_2m;
              const code = d?.current?.weather_code;
              const text = mapOpenMeteoCodeToText(code);
              weather = {
                condition: mapConditionToBucket(text),
                tempC: typeof temp === "number" ? Math.round(temp) : 18,
              };
              let hourlyCodes: number[] | undefined = d?.hourly?.weather_code;
              const hourlyTimes: number[] | undefined = d?.hourly?.time;
              const currentTime: number | undefined = d?.current?.time;
              if (
                Array.isArray(hourlyCodes) &&
                Array.isArray(hourlyTimes) &&
                typeof currentTime === "number"
              ) {
                const startIdx = hourlyTimes.findIndex(
                  (t) => typeof t === "number" && t >= currentTime
                );
                if (startIdx >= 0) {
                  hourlyCodes = hourlyCodes.slice(startIdx);
                }
              }
              outlook = computeOutlookFromCodes(code, hourlyCodes);
            }
          }

          // Fallback: use city name with open-meteo geocoding
          if (!weather && (geo?.city || geo?.country)) {
            const q = [geo?.city, geo?.country].filter(Boolean).join(", ");
            const geocode = new URL(
              "https://geocoding-api.open-meteo.com/v1/search"
            );
            geocode.searchParams.set("name", q);
            geocode.searchParams.set("count", "1");
            const gRes = await fetchWithTimeout(geocode.toString(), {
              timeoutMs: 5000,
            });
            if (gRes.ok) {
              const g = await gRes.json();
              const item = g?.results?.[0];
              if (item?.latitude && item?.longitude) {
                const url = new URL("https://api.open-meteo.com/v1/forecast");
                url.searchParams.set("latitude", String(item.latitude));
                url.searchParams.set("longitude", String(item.longitude));
                url.searchParams.set("current", "temperature_2m,weather_code");
                url.searchParams.set("hourly", "weather_code");
                url.searchParams.set("timezone", "auto");
                url.searchParams.set("timeformat", "unixtime");
                url.searchParams.set("forecast_days", "1");
                const res = await fetchWithTimeout(url.toString(), {
                  timeoutMs: 5000,
                });
                if (res.ok) {
                  const d = await res.json();
                  const temp = d?.current?.temperature_2m;
                  const code = d?.current?.weather_code;
                  const text = mapOpenMeteoCodeToText(code);
                  weather = {
                    condition: mapConditionToBucket(text),
                    tempC: typeof temp === "number" ? Math.round(temp) : 18,
                  };
                  let hourlyCodes: number[] | undefined =
                    d?.hourly?.weather_code;
                  const hourlyTimes: number[] | undefined = d?.hourly?.time;
                  const currentTime: number | undefined = d?.current?.time;
                  if (
                    Array.isArray(hourlyCodes) &&
                    Array.isArray(hourlyTimes) &&
                    typeof currentTime === "number"
                  ) {
                    const startIdx = hourlyTimes.findIndex(
                      (t) => typeof t === "number" && t >= currentTime
                    );
                    if (startIdx >= 0) {
                      hourlyCodes = hourlyCodes.slice(startIdx);
                    }
                  }
                  outlook = computeOutlookFromCodes(code, hourlyCodes);
                }
              }
            }
          }
        } catch {}

        if (!cancelled) {
          setState({
            loading: false,
            geo: geo ?? null,
            weather: weather ?? null,
            error: geo || weather ? null : "Could not fetch location/weather",
            outlook: outlook ?? null,
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setState((s) => ({ ...s, loading: false, error: message }));
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return seeded;
}

// Mapping from Open-Meteo WMO weather codes
function mapOpenMeteoCodeToText(code: unknown): string {
  const c = typeof code === "number" ? code : -1;
  // Simplified mapping sufficient for demo bucketing
  if (c === 0) return "Clear";
  if ([1, 2, 3].includes(c)) return "Partly cloudy";
  if ([45, 48].includes(c)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(c)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(c)) return "Rain";
  if ([71, 73, 75, 77].includes(c)) return "Snow";
  if ([80, 81, 82].includes(c)) return "Rain showers";
  if ([85, 86].includes(c)) return "Snow showers";
  if ([95, 96, 97].includes(c)) return "Thunderstorm";
  return "Cloudy";
}

function isRainCode(code: unknown): boolean {
  const c = typeof code === "number" ? code : -1;
  return (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 97].includes(c)
  );
}

function computeOutlookFromCodes(
  currentCode: unknown,
  hourlyCodes?: number[]
): string | null {
  if (!Array.isArray(hourlyCodes) || hourlyCodes.length === 0) return null;
  const nowIsRain = isRainCode(currentCode);
  const anyRain = hourlyCodes.some(isRainCode);
  if (!anyRain) return "Looks clear today.";
  if (!nowIsRain && anyRain) return "Rain expected later today.";
  // now raining
  const anyClearLater = hourlyCodes.some((c) => !isRainCode(c));
  if (anyClearLater) return "Clearing later today.";
  return "Intermittent showers today.";
}


