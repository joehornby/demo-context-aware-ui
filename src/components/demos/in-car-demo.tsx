"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Mode = "city" | "highway" | "stopped";

export function InCarDemo() {
  const [mode, setMode] = useState<Mode>("city");

  const density =
    mode === "city" ? "low" : mode === "highway" ? "medium" : "high";

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Driving UI</h3>
        <div className="flex gap-2">
          {(["city", "highway", "stopped"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md border px-2 py-1 text-xs capitalize ${
                mode === m
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white hover:bg-slate-50 border-slate-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {/* Safety cue always visible; emphasized in city */}
        <motion.div
          layout
          className={`col-span-3 rounded-md p-3 border ${
            mode === "city"
              ? "bg-red-50 border-red-200"
              : "bg-white border-slate-200"
          }`}
        >
          <p className="text-sm">
            Safety cues prioritized: cyclists, pedestrians, alerts.
          </p>
        </motion.div>

        {/* Widgets scale with density */}
        {Array.from({ length: density === "low" ? 2 : density === "medium" ? 4 : 6 }).map(
          (_, i) => (
            <motion.div
              key={i}
              layout
              className="rounded-md border border-slate-200 bg-white p-3"
            >
              <div className="h-3 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-2 w-24 bg-slate-100 rounded" />
            </motion.div>
          )
        )}
      </div>

      <p className="mt-auto text-xs text-slate-500">
        Policy example: reduce non-essential widgets in the city, allow more on
        highways, and unlock full interactions when stopped.
      </p>
    </div>
  );
}