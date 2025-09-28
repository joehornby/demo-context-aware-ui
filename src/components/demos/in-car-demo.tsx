"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Mode = "city" | "highway" | "stopped";

export function InCarDemo() {
  const [mode, setMode] = useState<Mode>("city");

  const density =
    mode === "city" ? "low" : mode === "highway" ? "medium" : "high";

  const safetyCueDescription =
    mode === "city"
      ? "Safety cues prioritized: cyclists, pedestrians, and nearby alerts."
      : mode === "highway"
      ? "Safety cues prioritized: lane changes, speed, and vehicle proximity."
      : "Safety cues relaxed: full interaction; core alerts remain visible.";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Driving UI</h3>
        <div className="flex gap-2">
          {(["city", "highway", "stopped"] as const).map((m) => (
            <Button
              key={m}
              onClick={() => setMode(m)}
              size="sm"
              variant={mode === m ? "default" : "outline"}
              className="capitalize"
            >
              {m}
            </Button>
          ))}
        </div>
      </div>

      {/* Vehicle screen mockup */}
      <div className="mt-4 flex w-full justify-center">
        <div className="w-full max-w-3xl">
          <div className="relative aspect-video">
            {/* Side mounts (decorative) */}
            <div className="pointer-events-none absolute -left-6 top-1/2 h-20 w-3 -translate-y-1/2 rounded-full bg-stone-300/60" />
            <div className="pointer-events-none absolute -right-6 top-1/2 h-20 w-3 -translate-y-1/2 rounded-full bg-stone-300/60" />

            {/* Outer bezel */}
            <div className="absolute inset-0 rounded-[28px] bg-stone-900 p-2 shadow-xl ring-1 ring-stone-800">
              {/* Inner glass */}
              <div className="h-full w-full rounded-[22px] bg-stone-950 p-4">
                <div className="grid h-full grid-cols-3 gap-3">
                  {/* Safety cue always visible; emphasized in city */}
                  <motion.div
                    layout
                    className={`col-span-3 rounded-md p-3 border ${
                      mode === "city"
                        ? "bg-red-500/10 border-red-400/40 text-red-100"
                        : "bg-stone-800 border-stone-700 text-stone-200"
                    }`}
                  >
                    <p className="text-sm">{safetyCueDescription}</p>
                  </motion.div>

                  {/* Widgets scale with density */}
                  {Array.from({
                    length:
                      density === "low" ? 2 : density === "medium" ? 4 : 6,
                  }).map((_, i) => (
                    <motion.div
                      key={i}
                      layout
                      className="rounded-md border border-stone-700 bg-stone-900 p-3"
                    >
                      <div className="mb-2 h-3 w-16 rounded bg-stone-600" />
                      <div className="h-2 w-24 rounded bg-stone-700" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="max-w-prose text-balance mt-auto text-xs text-stone-500">
        Policy example: reduce non-essential widgets in the city, allow more on
        highways, and unlock full interactions when stopped.
      </p>
    </div>
  );
}