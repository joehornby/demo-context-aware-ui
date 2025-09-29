"use client";

import { useMemo } from "react";
import { DemoPanel } from "@/components/demo-panel";
import AxisDiagram from "@/components/axis-diagram";
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
              probabilistic inference fills gaps, while showing its work so the
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
              relevant as conditions change, without the user hunting through
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
              Combining two modes of interaction could help understand the
              user&apos;s intent. In this demo, eye tracking and a physical
              input (keyboard arrow keys) are combined to change the control you
              are looking at. After some calibration with the camera eye
              tracking system (webgazer.js), look at the temperature tile and
              use arrow keys to adjust; glance at the music player use the same
              keys to change volume.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Look at temperature → press up or down keys → adjust temp</li>
              <li>Look at music → press up or down keys → adjust volume</li>
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
              Using knowledge of the current driving scenario, we could adjust
              the density and priority of the UI. City streets emphasise safety
              cues and fewer distractors; motorways allow more glanceable
              widgets; when stopped, unlock richer interactions.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>City: high-alert UI, fewer distractions</li>
              <li>Motorway: glanceable widgets</li>
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
      <div className="px-12 md:px-24 py-12 md:py-24 max-w-prose lg:max-w-7/12 relative">
        <div className="mb-[70vh] space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-24">
            Thoughts on Context-Aware Interfaces
          </h1>
          <ul className="list-disc pl-6  space-y-2">
            <li>
              We&apos;ve had context-aware UI for years (brightness, weather
              cards, OS prefs, Citymapper&apos;s giant “Get me home” button late
              at night).
            </li>
            <li>
              ML personalization made it adaptive (app suggestions, Siri/Google
              nudges), but mostly as nudges, not composing flows.
            </li>
            <li>
              Generative UI is the next step: an agent blends probabilistic
              intent + deterministic tool calls and workflows to render the
              right micro-UI at the right time, with reasons and overrides.
            </li>
          </ul>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Why it matters (user value)
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fewer steps, less friction</li>
            <li>Content that fits the moment</li>
            <li>Real-time adaptation without manual tuning</li>
            <li>Transparent data use and consent</li>
            <li>Natural interactions (voice, gaze, zero-UI)</li>
            <li>
              Reduced &quot;gulf of envisioning&quot; (surface what&apos;s
              possible)
            </li>
            <li>
              Principle: explain inferences, keep actions reversible, always
              allow override/opt-out
            </li>
          </ul>

          <h2 className="text-2xl font-bold tracking-tight mb-4">AI Agents</h2>

          <AxisDiagram />

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Agent</strong>: To create an agent, an LLM is given tools
              (basically functions it is able to call to expand its capability).
              LLM chooses which “tool” to call, e.g. search web, apply focus
              mode, just answer a question, when to generate an answer vs call a
              tool. Non-deterministic &ndash; LLM decides what to do. We lose a
              lot of predictability. Future of general intelligence is probably
              quite an agentic one &ndash; the LLM is smart enough to handle the
              control flow for you and you don&apos;t need to put workflows on
              top of it to stitch it together.
            </li>
            <li>
              <strong>Workflow</strong>: A workflow is a sequence of steps that
              are executed in order. It is deterministic and predictable. We can
              apply workflows to make the system more deterministic, i.e. reduce
              the decision space of the LLM, and combine tool calls (or actions)
              into workflows. Better for actions that require a deterministic
              outcome, like a system that needs to do one thing and do it well.
            </li>
          </ul>

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
