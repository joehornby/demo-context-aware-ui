"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Squircle } from "corner-smoothing";

type Action =
  | { type: "calendar"; title: string; when: string }
  | { type: "share"; to: string; filename?: string }
  | { type: "note"; text: string };

export function ConversationDemo() {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  // Simulate incoming transcript
  useEffect(() => {
    const lines = [
      "Let's meet at 3pm for 30 minutes.",
      "Can you put it in the calendar?",
      "Also send me that file after the call.",
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i < lines.length) {
        const line = lines[i++];
        setTranscript((t) => [...t, line]);
        // naive intent detection
        if (line.toLowerCase().includes("calendar")) {
          setActions((a) => [
            ...a,
            { type: "calendar", title: "Sync @ 3pm", when: "Today 15:00" },
          ]);
        }
        if (line.toLowerCase().includes("file")) {
          setActions((a) => [...a, { type: "share", to: "alex@example.com" }]);
        }
      } else {
        clearInterval(id);
      }
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <h3 className="text-xl font-semibold">Live conversation → actions</h3>

      <div className="mt-3 grid grid-cols-2 gap-3 h-full">
        <div className="rounded-md border bg-white p-3 flex flex-col">
          <div className="text-xs text-stone-500 mb-2">Chat</div>
          <div className="flex flex-col gap-2 overflow-auto pr-1">
            {transcript.map((t, i) => {
              const isSelf = i % 2 === 1;
              return (
                <Squircle
                  key={i}
                  cornerRadius={16}
                  cornerSmoothing={0.88}
                  className={isSelf ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      (isSelf
                        ? "bg-stone-600 text-stone-50"
                        : "bg-stone-100 text-stone-800") +
                      " max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm"
                    }
                  >
                    {t}
                  </div>
                </Squircle>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border bg-white p-3 flex flex-col">
          <div className="text-xs text-stone-500 mb-1">Suggested actions</div>
          <div className="space-y-2">
            {actions.map((a, i) =>
              a.type === "calendar" ? (
                <div key={i} className="border rounded p-2">
                  <div className="text-sm font-medium">
                    Create calendar event
                  </div>
                  <div className="text-xs text-stone-600">
                    {a.title} — {a.when}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Open editor
                  </Button>
                </div>
              ) : a.type === "share" ? (
                <div key={i} className="border rounded p-2">
                  <div className="text-sm font-medium">Share a file</div>
                  <div className="text-xs text-stone-600">
                    Recipient: {a.to}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload & send
                  </Button>
                </div>
              ) : (
                <div key={i} className="border rounded p-2">
                  <div className="text-sm font-medium">Note</div>
                  <div className="text-xs text-stone-600">{a.text}</div>
                </div>
              )
            )}
            {!actions.length && <div className="text-xs text-stone-500">—</div>}
          </div>
          <p className="mt-auto text-xs text-stone-500">
            With consent, speech-to-intent can prefill components to reduce
            clicks. Always show indicators and allow opt-out.
          </p>
        </div>
      </div>
    </div>
  );
}