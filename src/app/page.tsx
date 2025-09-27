"use client";

import { useMemo } from "react";
import { DemoPanel } from "@/components/demo-panel";
import { Section } from "@/components/section";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import { getInitialContext, type AppContext } from "@/lib/context";

export default function Page() {
  const sections = useMemo(
    () => [
      {
        id: "generative",
        title: "Generative UI with tool-calling",
        content: (
          <>
            <p className="mb-4">
              Move beyond fixed rules. Let a small agent call tools (weather,
              maps, calendar) to infer intent and assemble a one-tap plan. This
              can be more helpful when signals are incomplete.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Explain reasoning and offer alternatives</li>
              <li>Respect privacy and consent for each signal</li>
              <li>Keep actions reversible</li>
            </ul>
          </>
        ),
      },
      {
        id: "referrer",
        title: "Referrer-aware onboarding",
        content: (
          <>
            <p className="mb-4">
              Visitors arrive with different goals depending on where they came
              from. A LinkedIn visitor might be evaluating credibility or roles,
              while an Instagram visitor may prefer visual highlights or short
              demos. We can tailor onboarding copy and CTAs based on the HTTP
              referrer signal.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Surface relevant proof points for professional audiences</li>
              <li>Lean into visuals for social audiences</li>
              <li>Fallback to neutral onboarding for direct traffic</li>
            </ul>
          </>
        ),
      },
      {
        id: "weather",
        title: "Weather- and location-aware planning",
        content: (
          <>
            <p className="mb-4">
              Combine local time, location, and forecast to propose activities
              that fit a user’s day. When signals are missing, provide safe
              defaults and ask for permission progressively.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sunny morning? Suggest outdoor events nearby</li>
              <li>Rainy afternoon? Offer indoor alternatives</li>
              <li>Respect privacy and allow user overrides</li>
            </ul>
          </>
        ),
      },
      {
        id: "conversation",
        title: "Conversation context",
        content: (
          <>
            <p className="mb-4">
              With consent, live meeting transcripts can unlock instant actions.
              When someone says “put it in the calendar,” render a prefilled
              event editor. “Send me that file” can surface sharing components
              immediately.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reduce steps after spoken intent</li>
              <li>Show clear indicators and easy opt-out</li>
              <li>Prefer on-device or secure processing</li>
            </ul>
          </>
        ),
      },
      {
        id: "intent",
        title: "Intent-aware UI (gaze  single control)",
        content: (
          <>
            <p className="mb-4">
              Combine gaze (e.g., webgazer.js) with a single dial/button so the
              dial acts on whatever the user looks at. Faster adjustments with
              less hand travel and cognitive load.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Look at temperature → turn dial → adjust temp</li>
              <li>Look at music → turn dial → adjust volume</li>
              <li>Fallback to hover/focus when eye tracking is unavailable</li>
            </ul>
          </>
        ),
      },
      {
        id: "incar",
        title: "In-vehicle distraction management",
        content: (
          <>
            <p className="mb-4">
              Adjust UI density and priority based on driving context. On city
              streets, emphasize safety cues and reduce non-essential elements.
              On highways, increase glanceable information like route progress
              or media.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>City: high-alert UI, fewer distractions</li>
              <li>Highway: glanceable widgets</li>
              <li>Stopped: richer interactions unlocked</li>
            </ul>
          </>
        ),
      },
    ],
    []
  );

  const { refs, activeId } = useSectionObserver(sections.map((s) => s.id));

  const initialContext: AppContext = useMemo(() => getInitialContext(), []);

  return (
    <main className="min-h-screen">
      <div className="px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Content-Aware Interfaces
        </h1>
        <div className="text-slate-700 mb-8 space-y-2">
          <p>
            Helpful interfaces adapt to context—referrer, weather, location,
            conversation—and propose the next best action with the least work
            from the user.
          </p>
          <p className="text-slate-500">
            Principles: explain inferences, keep actions reversible, and let
            users override or opt out anytime.
          </p>
        </div>

        <div className="relative">
          {/* Left content: narrative (reserve space for fixed panel on small and large screens) */}
          <div className="space-y-[40vh] pb-[52vh] lg:pb-[80vh] lg:pr-[520px]">
            <Section
              id="generative"
              title="Generative UI"
              ref={refs["generative"]}
            >
              <p className="mb-4">
                Small agents with tool-calls can stitch signals into a concrete,
                helpful plan, especially when simple rules fall short.
              </p>
            </Section>
            <Section id="referrer" title="What context?" ref={refs["referrer"]}>
              <h3 className="text-lg font-semibold mb-2">Web app</h3>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Location (IP or geolocation)</li>
                <li>Time and timezone</li>
                <li>Weather (via API)</li>
                <li>HTTP referrer</li>
                <li>User preferences and history</li>
                <li>Device, network, language</li>
              </ul>
              <h3 className="text-lg font-semibold mb-2">In-car example</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Speed, SoC, ADAS status</li>
                <li>Location, ETA, traffic, calendar</li>
                <li>Occupancy, music level, cabin temp</li>
                <li>Driver attention</li>
              </ul>
            </Section>

            <Section id="weather" title="So what?" ref={refs["weather"]}>
              <p className="mb-4">
                With context, we can infer intent and choose the right UI
                variant. For example, visitors from LinkedIn vs Instagram likely
                seek different things. For day planning, combine weather,
                location, and preferences to propose relevant actions.
              </p>
              <p>
                In vehicles, modulate how much the UI competes for attention
                based on driving conditions—prioritize safety in the city, and
                unlock richer content when stopped.
              </p>
            </Section>

            <Section
              id="conversation"
              title="Conversation context"
              ref={refs["conversation"]}
            >
              <p>Turn spoken intent into immediate UI affordances.</p>
            </Section>

            {/* Deep-dive sections that drive the demos */}
            {sections.map((sec) => (
              <Section
                key={sec.id}
                id={sec.id}
                title={sec.title}
                ref={refs[sec.id]}
              >
                {sec.content}
              </Section>
            ))}
            <Section id="intent" title="Intent-aware UI" ref={refs["intent"]}>
              <p>Gaze + one control = quicker adjustments with less effort.</p>
            </Section>
          </div>

          {/* Demo panel: fixed bottom on small screens, fixed right on large screens */}
          <div className="fixed inset-x-0 bottom-0 h-[50vh] z-20 lg:inset-auto lg:fixed lg:top-4 lg:right-4 xl:right-8 lg:w-[480px] lg:h-[calc(100vh-2rem)]">
            <DemoPanel activeId={activeId} initialContext={initialContext} />
          </div>
        </div>
      </div>
    </main>
  );
}
