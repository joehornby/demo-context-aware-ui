"use client";

import { useEffect, useState } from "react";

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
          setActions((a) => [
            ...a,
            { type: "share", to: "alex@example.com" },
          ]);
        }
      } else {
        clearInterval(id);
      }
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-gradient-to-br from-rose-50 to-white p-4">
      <h3 className="text-xl font-semibold">Live conversation → actions</h3>

      <div className="mt-3 grid grid-cols-2 gap-3 h-full">
        <div className="rounded-md border bg-white p-3 flex flex-col">
          <div className="text-xs text-slate-500 mb-1">Transcript</div>
          <div className="text-sm text-slate-700 space-y-1 overflow-auto">
            {transcript.map((t, i) => (
              <div key={i}>• {t}</div>
            ))}
          </div>
        </div>

        <div className="rounded-md border bg-white p-3 flex flex-col">
          <div className="text-xs text-slate-500 mb-1">
            Suggested actions
          </div>
          <div className="space-y-2">
            {actions.map((a, i) =>
              a.type === "calendar" ? (
                <div key={i} className="border rounded p-2">
                  <div className="text-sm font-medium">
                    Create calendar event
                  </div>
                  <div className="text-xs text-slate-600">
                    {a.title} — {a.when}
                  </div>
                  <button className="mt-2 rounded border px-2 py-1 text-xs hover:bg-slate-50">
                    Open editor
                  </button>
                </div>
              ) : a.type === "share" ? (
                <div key={i} className="border rounded p-2">
                  <div className="text-sm font-medium">Share a file</div>
                  <div className="text-xs text-slate-600">
                    Recipient: {a.to}
                  </div>
                  <button className="mt-2 rounded border px-2 py-1 text-xs hover:bg-slate-50">
                    Upload & send
                  </button>
                </div>
              ) : (
                <div key={i} className="border rounded p-2">
                  <div className="text-sm font-medium">Note</div>
                  <div className="text-xs text-slate-600">{a.text}</div>
                </div>
              ),
            )}
            {!actions.length && (
              <div className="text-xs text-slate-500">—</div>
            )}
          </div>
          <p className="mt-auto text-xs text-slate-500">
            With consent, speech-to-intent can prefill components to reduce
            clicks. Always show indicators and allow opt-out.
          </p>
        </div>
      </div>
    </div>
  );
}