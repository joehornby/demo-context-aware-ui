"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Squircle } from "corner-smoothing";
import { AnimatePresence, motion } from "motion/react";

type Action =
  | { type: "calendar"; title: string; when: string }
  | { type: "share"; to: string; filename?: string }
  | { type: "note"; text: string };

function CalendarCard({ a }: { a: { title: string; when: string } }) {
  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const defaultDate = `${yyyy}-${mm}-${dd}`;
  const timeMatch = a.when.match(/\b(\d{1,2}:\d{2})\b/i);
  const defaultTime = timeMatch ? timeMatch[1] : "15:00";
  const defaultInvitees = "Alex Johnson; Priya Patel; Sam Lee";

  return (
    <div className="border rounded p-2">
      <div className="text-sm font-medium">New calendar event</div>
      <div className="text-xs text-stone-600">
        {a.title} — {a.when}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="text-xs text-stone-600">Subject</label>
          <input
            type="text"
            defaultValue={a.title}
            className="mt-1 w-full rounded border border-stone-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400/30"
          />
        </div>
        <div>
          <label className="text-xs text-stone-600">Date</label>
          <input
            type="date"
            defaultValue={defaultDate}
            className="mt-1 w-full rounded border border-stone-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400/30"
          />
        </div>
        <div>
          <label className="text-xs text-stone-600">Time</label>
          <input
            type="time"
            defaultValue={defaultTime}
            className="mt-1 w-full rounded border border-stone-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400/30"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-stone-600">Invitees</label>
          <input
            type="text"
            defaultValue={defaultInvitees}
            className="mt-1 w-full rounded border border-stone-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400/30"
          />
        </div>
      </div>

      <Button variant="outline" size="sm" className="mt-2">
        Add to calendar
      </Button>
    </div>
  );
}

function ShareDropzoneCard({ a }: { a: { to: string; filename?: string } }) {
  return (
    <div className="border rounded p-2">
      <div className="text-sm font-medium">Share a file</div>
      <div className="text-xs text-stone-600">Recipient: {a.to}</div>

      <div className="mt-2">
        <div
          className="h-28 w-full rounded-md border-2 border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 transition-colors flex flex-col items-center justify-center text-stone-600"
          role="button"
          aria-label="Upload file"
        >
          <div className="text-sm">Drag & drop a file here</div>
          <div className="text-[11px] text-stone-400">or click to choose</div>
        </div>
      </div>
    </div>
  );
}

export function ConversationDemo() {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [actionsLoadingCount, setActionsLoadingCount] = useState(0);

  function scheduleAction(action: Action) {
    setActionsLoadingCount((c) => c + 1);
    setTimeout(() => {
      setActions((a) => [...a, action]);
      setActionsLoadingCount((c) => Math.max(0, c - 1));
    }, 1000);
  }

  // Simulate incoming transcript
  useEffect(() => {
    const lines = [
      "Let's meet at 3 for half an hour.",
      "I'll put it in the calendar",
      "Also send me that file after the call.",
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i < lines.length) {
        const line = lines[i++];
        setTranscript((t) => [...t, line]);
        // naive intent detection
        if (line.toLowerCase().includes("meet")) {
          scheduleAction({
            type: "calendar",
            title: "Sync @ 3pm",
            when: "Today 15:00",
          });
        }
        if (line.toLowerCase().includes("file")) {
          scheduleAction({ type: "share", to: "alex@example.com" });
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
            <AnimatePresence initial={false}>
              {transcript.map((t, i) => {
                const isSelf = i % 2 === 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ y: 8, scale: 0.98, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: -8, scale: 0.98, opacity: 0 }}
                    transition={{ duration: 0.11, ease: "easeOut" }}
                  >
                    <Squircle
                      cornerRadius={16}
                      cornerSmoothing={0.88}
                      className={
                        isSelf ? "flex justify-end" : "flex justify-start"
                      }
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
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-md border bg-white p-3 flex flex-col">
          <div className="text-xs text-stone-500 mb-2">Suggested actions</div>
          <div className="space-y-2">
            {actions.map((a, i) =>
              a.type === "calendar" ? (
                <CalendarCard key={i} a={a} />
              ) : a.type === "share" ? (
                <ShareDropzoneCard key={i} a={a} />
              ) : (
                <div key={i} className="border rounded p-2">
                  <div className="text-sm font-medium">Note</div>
                  <div className="text-xs text-stone-600">{a.text}</div>
                </div>
              )
            )}
            {actionsLoadingCount > 0 &&
              Array.from({ length: actionsLoadingCount }).map((_, i) => (
                <div
                  key={"pending-" + i}
                  className="flex items-center gap-2 text-xs text-stone-500"
                >
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-500" />
                  Loading suggestion…
                </div>
              ))}
            {actions.length === 0 && actionsLoadingCount === 0 && (
              <div className="text-xs text-stone-500">—</div>
            )}
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