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
              Visitors arrive with different goals depending on source &ndash;
              the website where they clicked a link to get here. Perhaps
              LinkedIn traffic is predominantly recruiters or hiring managers
              looking for a portfolio of work and experience; Instagram traffic
              may be more likely to be interested in buying products or
              services. Content and call to action can be tailored using context
              from the HTTP referrer to reduce friction.
            </p>
            <p className="mb-4">
              This example demonstrates how a website could be personalised to
              the context and intent of the visitor:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Professional visitors from LinkedIn &rarr; full portfolio and
                CV.
              </li>
              <li>Visitors from social media &rarr; sales funnel.</li>
              <li>
                Fallback &rarr; neutral limited profile for unknown sources.
              </li>
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
              emphasise safety cues and fewer distractors; highways allow more
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
      <div className="px-12 md:px-24 py-12 md:py-24 max-w-7/12 relative">
        <div className="mb-8 space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-24">
            Content-Aware Interfaces
          </h1>
          <p>
            In 2025, context-aware UIs are moving from novelty to norm. Advances
            in AI, sensors, and analytics let interfaces adapt in real-time to
            location, time of day, device, activity, and even
            conversation—meeting users where they are.
          </p>
          <ul className="list-disc pl-6">
            <li>Better usability: fewer steps, less friction</li>
            <li>Personalisation: content that fits the moment</li>
            <li>Real-time adaptation: seamless updates as context changes</li>
            <li>Privacy and trust: transparent data use and consent</li>
            <li>Efficiency: faster paths in consumer and enterprise flows</li>
            <li>Natural interaction: voice, gaze, and zero-UI moments</li>
          </ul>
          <p className="">
            Principle: maximise user value &ndash; explain inferences, keep
            actions reversible, and let users override or opt out anytime.
          </p>

          <div className="mt-40">
            <div className="space-y-[50vh]">
              {sections.map((sec) => (
                <Section
                  key={sec.id}
                  id={sec.id}
                  title={sec.title}
                  ref={refs[sec.id]}
                  className=""
                >
                  {sec.content}
                </Section>
              ))}
            </div>
          </div>

          {/* Demo panel: fixed bottom on small screens, fixed right on large screens */}
          <div className="fixed inset-x-0 bottom-0 h-[50vh] z-20 lg:inset-auto lg:fixed lg:top-4 lg:right-4 lg:w-5/12 lg:h-[calc(100vh-2rem)]">
            <DemoPanel activeId={activeId} initialContext={initialContext} />
          </div>
        </div>
      </div>
    </main>
  );
}
