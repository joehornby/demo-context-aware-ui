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
              Move beyond static rules like “location → local info.” A small
              agent can call tools (weather, maps, calendar, events) and compose
              a plan that fits right now. When signals are partial or noisy,
              probabilistic inference fills gaps—while showing its work so the
              user can override.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Faster first screen: fewer taps to a good option</li>
              <li>Transparent: show tool-calls and let users tweak</li>
              <li>Reversible: propose, don’t force; always undoable</li>
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
              Visitors arrive with different goals depending on source. LinkedIn
              traffic often seeks credibility or roles; Instagram traffic skews
              to visuals and quick demos. Tailor the first screen and CTA using
              the HTTP referrer to reduce friction.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Professional: case studies, team, open roles</li>
              <li>Social: visual highlights, short demos</li>
              <li>Fallback: neutral onboarding for direct/unknown</li>
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
              Combine local time, location, and forecast to suggest activities
              that fit the moment. Real-time adaptation keeps suggestions
              relevant as conditions change—without the user hunting through
              menus.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sunny morning → nearby outdoor options</li>
              <li>Rainy afternoon → indoor alternatives</li>
              <li>Graceful fallbacks when signals are missing</li>
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
              With consent, live transcripts turn spoken intent into immediate
              UI. “Put it in the calendar” spawns a prefilled event editor.
              “Send me that file” surfaces a share/upload component with the
              recipient inferred. Technology fades into the background; your
              request becomes the interface.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reduce clicks after spoken intent</li>
              <li>Visible indicators, easy pause/opt-out</li>
              <li>Prefer on-device or secure processing paths</li>
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
              Combine eye tracking (e.g., webgazer.js) with a single dial and a
              push button. The dial acts on whatever you look at: glance at the
              temperature tile and turn to adjust; glance at the player and turn
              to change volume. It’s faster, safer, and lowers cognitive load.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Look at temperature → turn → adjust temp</li>
              <li>Look at music → turn → adjust volume</li>
              <li>Fallback: hover/focus when gaze isn’t available</li>
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
              Adjust density and priority based on driving context. City streets
              emphasize safety cues and fewer distractors; highways allow more
              glanceable widgets; when stopped, unlock richer interactions.
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
        <div className="text-slate-700 mb-8 space-y-3">
          <p>
            In 2025, context-aware UIs are moving from novelty to norm. Advances
            in AI, sensors, and analytics let interfaces adapt in real-time to
            location, time of day, device, activity, and even
            conversation—meeting users where they are.
          </p>
          <ul className="list-disc pl-6 text-slate-700">
            <li>Better usability: fewer steps, less friction</li>
            <li>Personalization: content that fits the moment</li>
            <li>Real-time adaptation: seamless updates as context changes</li>
            <li>Privacy and trust: transparent data use and consent</li>
            <li>Efficiency: faster paths in consumer and enterprise flows</li>
            <li>Natural interaction: voice, gaze, and zero-UI moments</li>
          </ul>
          <p className="text-slate-500">
            Principle: maximize user value—explain inferences, keep actions
            reversible, and let users override or opt out anytime.
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
                Small agents with tool-calls stitch signals into helpful plans,
                especially when simple rules fall short. They should explain
                reasoning and offer alternatives.
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
                With context, we infer intent and choose the right UI variant.
                Example: visitors from LinkedIn vs Instagram likely seek
                different things. For day planning, combine weather, location,
                and preferences to propose relevant actions that fit now.
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
              <p>
                Turn spoken intent into immediate UI affordances: calendar,
                sharing, notes. Visible indicators and consent keep trust front
                and center.
              </p>
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
