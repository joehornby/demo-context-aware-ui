"use client";

import { useMemo, useState } from "react";
import type { AppContext } from "@/lib/context";

type Props = { context: AppContext };

const REFERRERS: AppContext["referrer"][] = [
  "linkedin",
  "instagram",
  "direct",
  "other",
];

function getCopyFor(ref: AppContext["referrer"]) {
  return ref === "linkedin"
    ? {
        title: "Welcome, LinkedIn visitor",
        body: "Here are case studies, team profiles, and open roles to help you evaluate us.",
        cta: "View case studies",
      }
    : ref === "instagram"
    ? {
        title: "Hey there from Instagram",
        body: "Check out quick visual demos and highlights to get a feel for the product.",
        cta: "Watch quick demos",
      }
    : ref === "direct"
    ? {
        title: "Welcome",
        body: "Explore product features and see how it can help you accomplish your goals.",
        cta: "Explore features",
      }
    : {
        title: "Welcome, friend",
        body: "Whether you’re researching or browsing, here are a few ways to start.",
        cta: "Start here",
      };
}

export function ReferrerDemo({ context }: Props) {
  const [selectedReferrer, setSelectedReferrer] = useState<
    AppContext["referrer"] | "detected"
  >("detected");

  const effectiveReferrer =
    selectedReferrer === "detected" ? context.referrer : selectedReferrer;

  const copy = useMemo(
    () => getCopyFor(effectiveReferrer),
    [effectiveReferrer]
  );

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
      {/* Selector */}
      <div className="mb-4">
        <div className="text-xs text-slate-500 mb-1">Simulate referrer</div>
        <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 text-sm">
          <button
            className={`px-3 py-1 rounded ${
              selectedReferrer === "detected"
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-100"
            }`}
            onClick={() => setSelectedReferrer("detected")}
          >
            Detected
          </button>
          {REFERRERS.map((r) => (
            <button
              key={r}
              className={`px-3 py-1 rounded capitalize ${
                selectedReferrer === r
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100"
              }`}
              onClick={() => setSelectedReferrer(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Tiny browser mock */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden mb-3">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-slate-50">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
          </div>
          <div className="ml-2 text-xs font-medium text-slate-700">
            {effectiveReferrer === "linkedin"
              ? "LinkedIn"
              : effectiveReferrer === "instagram"
              ? "Instagram"
              : effectiveReferrer === "direct"
              ? "Direct"
              : "Other site"}
          </div>
          <div className="ml-auto text-[10px] text-slate-400">
            referrer: {effectiveReferrer}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{copy.title}</h3>
          <p className="text-slate-600 mb-4">{copy.body}</p>
          <button className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
            {copy.cta}
          </button>
        </div>
      </div>

      <div className="mt-auto text-xs text-slate-500">
        Detected referrer:{" "}
        <span className="font-medium">{context.referrer}</span>
        {selectedReferrer !== "detected" && (
          <>
            <span className="mx-1">•</span>
            Overridden to:{" "}
            <span className="font-medium">{effectiveReferrer}</span>
          </>
        )}
      </div>
    </div>
  );
}