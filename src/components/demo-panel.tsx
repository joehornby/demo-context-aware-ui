"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReferrerDemo } from "./demos/referrer-demo";
import { WeatherDemo } from "./demos/weather-demo";
import { InCarDemo } from "./demos/in-car-demo";
import { GenerativeDemo } from "./demos/generative-demo";
import { ConversationDemo } from "./demos/conversation-demo";
import { IntentDemo } from "./demos/intent-demo";
import type { AppContext } from "@/lib/context";
import { Squircle } from "corner-smoothing";

type Props = {
  activeId: string;
  initialContext: AppContext;
};

export function DemoPanel({ activeId, initialContext }: Props) {
  return (
    <Squircle
      cornerRadius={50}
      cornerSmoothing={0.88}
      className="h-full bg-white/70 backdrop-blur p-12"
    >
      <div className="relative h-[calc(100%-1.75rem)] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {activeId === "generative" && (
              <GenerativeDemo context={initialContext} />
            )}
            {activeId === "conversation" && <ConversationDemo />}
            {activeId === "intent" && <IntentDemo />}
            {activeId === "referrer" && (
              <ReferrerDemo context={initialContext} />
            )}
            {activeId === "weather" && <WeatherDemo context={initialContext} />}
            {activeId === "incar" && <InCarDemo />}
            {/* Default fallback */}
            {![
              "generative",
              "conversation",
              "intent",
              "referrer",
              "weather",
              "incar",
            ].includes(activeId) && (
              <div className="flex h-full items-center justify-center">
                Select a section
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Squircle>
  );
}