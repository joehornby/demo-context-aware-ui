"use client";

import { useState } from "react";

type Target = "temperature" | "music" | null;

export function IntentDemo() {
  // Simulate gaze with hover/focus; replace with webgazer later.
  const [target, setTarget] = useState<Target>(null);
  const [temp, setTemp] = useState<number>(21);
  const [volume, setVolume] = useState<number>(40);

  const onDial = (delta: number) => {
    if (target === "temperature") {
      setTemp((t) => Math.max(16, Math.min(28, t + delta)));
    } else if (target === "music") {
      setVolume((v) => Math.max(0, Math.min(100, v + delta)));
    }
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4">
      <h3 className="text-xl font-semibold">Look → Turn → Adjust</h3>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onMouseEnter={() => setTarget("temperature")}
          onFocus={() => setTarget("temperature")}
          className={`rounded-md border p-3 text-left bg-white ${
            target === "temperature"
              ? "ring-2 ring-emerald-400 border-emerald-300"
              : "border-slate-200"
          }`}
        >
          <div className="text-sm text-slate-500">Temperature</div>
          <div className="text-2xl font-semibold">{temp}°C</div>
        </button>

        <button
          onMouseEnter={() => setTarget("music")}
          onFocus={() => setTarget("music")}
          className={`rounded-md border p-3 text-left bg-white ${
            target === "music"
              ? "ring-2 ring-emerald-400 border-emerald-300"
              : "border-slate-200"
          }`}
        >
          <div className="text-sm text-slate-500">Music volume</div>
          <div className="text-2xl font-semibold">{volume}%</div>
        </button>
      </div>

      <div className="mt-4 rounded-md border bg-white p-3">
        <div className="text-sm text-slate-600">
          Focused target:{" "}
          <span className="font-medium">
            {target ?? "none (hover a card)"}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-slate-500">Dial (sim):</span>
          <button
            onClick={() => onDial(-1)}
            className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50"
          >
            - Turn
          </button>
          <button
            onClick={() => onDial(+1)}
            className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50"
          >
            + Turn
          </button>
          <button
            onClick={() => {
              if (target === "temperature") setTemp(21);
              if (target === "music") setVolume(40);
            }}
            className="ml-2 rounded-md border px-3 py-1 text-sm hover:bg-slate-50"
          >
            Push (reset)
          </button>
        </div>
      </div>

      <p className="mt-auto text-xs text-slate-500">
        Replace hover with gaze from webgazer.js, and wire the dial to a
        hardware rotary or keyboard arrows. One control, many intents.
      </p>
    </div>
  );
}