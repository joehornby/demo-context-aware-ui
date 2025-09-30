"use client";

import { useMemo } from "react";
import { DemoPanel } from "@/components/demo-panel";
import AxisDiagram from "@/components/axis-diagram";
import { Section } from "@/components/section";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import { getInitialContext, type AppContext } from "@/lib/context";
import Image from "next/image";
import agent1 from "@/app/assets/agent-1.svg";
import agent2 from "@/app/assets/agent-2.svg";
import agent3 from "@/app/assets/agent-3.svg";
import agent4 from "@/app/assets/agent-4.svg";
import agent5 from "@/app/assets/agent-5.svg";
import agent6 from "@/app/assets/agent-6.svg";
import agent7 from "@/app/assets/agent-7.svg";

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

  const { refs, activeId, hasReachedFirst } = useSectionObserver(
    sections.map((s) => s.id)
  );

  // Ensure the first visible panel is the first demo when we've reached the demo area
  const panelActiveId = hasReachedFirst ? activeId || sections[0].id : "";

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
              <strong>Agent</strong> (LLM-drive, &quot;slippy hands&quot;)
              <ul>
                <li>
                  Probabilistic control flow: the LLM chooses which tool to call
                  and when.
                </li>
                <li>
                  Flexibile, exploratory, good under ambiguity and open-ended
                  goals.
                </li>
                <li>
                  Trade off: less predictable, harder to test and guarantee
                  outcomes.
                </li>
              </ul>
            </li>
            <li>
              <strong>Workflow</strong> (deterministic, &quot;iron grip&quot;)
              <ul>
                <li>
                  Predefined sequence of steps: predictable and repeatable.
                </li>
                <li>
                  Reduces the LLM&apos;s decision space (use LLM only for narrow
                  sub-tasks or selecting which workflow to use)
                </li>
                <li>
                  Best for reliability, compliance, and doing one thing well.
                </li>
              </ul>
            </li>
            <li>
              <strong>How to use them</strong>
              <ul>
                <li>
                  Agent for intent discovery, generating options, stitching
                  partial signals together.
                </li>
                <li>
                  Workflow for execution of critical actions or rendering
                  specific UIs.
                </li>
                <li>
                  Hybrid: agent proposes and workflow executes. Constrain with
                  tool schemas, policies and clear fallbacks.
                </li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-bold tracking-tight mb-4">Tools?</h2>
          <p>You can provide the LLM with tools via the system prompt.</p>

          <h3 className="text-lg font-semibold mb-2">Simplified example:</h3>
          <p>
            Just a list of available tools (or functions, or actions) with
            inputs/type definitions (hidden for clarity) and descriptions.
          </p>

          <Image src={agent1} alt="Agent tools in system prompt" />

          <p>The magic happens when we ask the LLM to choose a tool.</p>

          <p>Example prompt sequence:</p>
          <p className="text-sm text-muted-foreground">
            Note: User prompt doesn’t have to be text or voice, it could be
            triggered through some other interaction, mechanism or event.
          </p>

          <Image src={agent2} alt="Request sent to LLM" />

          <p>
            Assistant interprets request for help as a desire to focus and
            understands it needs to start understanding the context and change
            to a focus mode. It starts by requesting to run the
            getVehicleContext tool.
          </p>

          <Image src={agent3} alt="Vehicle computer" />

          <p>
            This instructs the vehicle to run that function on the vehicle
            computer.
          </p>

          <Image
            src={agent4}
            alt="Loop between LLM and computer running actions"
          />

          <p>
            Then the vehicle and assistant communicate back and forth to
            establish what action needs to happen. Each time the assistant
            establishes the next tool that needs to run, and the vehicle runs
            it, until...
          </p>

          <Image src={agent5} alt="Loop between computer and LLM" />

          <p>
            The assistant has decided which focus mode to set and requesting to
            run the setFocusMode tool.
          </p>

          <Image src={agent6} alt="LLM resulting tool" />

          <p>The vehicle executes the focus mode change.</p>

          <Image src={agent7} alt="Vehicle executes tool" />

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

          {/* Demo panel appears only once a demo section is active */}
          {hasReachedFirst && (
            <div className="fixed inset-x-0 bottom-0 h-[50vh] z-20 lg:inset-auto lg:fixed lg:top-4 lg:right-4 lg:w-5/12 lg:h-[calc(100vh-2rem)]">
              <DemoPanel
                activeId={panelActiveId}
                initialContext={initialContext}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
