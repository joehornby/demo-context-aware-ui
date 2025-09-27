"use client";

import type { AppContext } from "@/lib/context";

type Props = { context: AppContext };

export function ReferrerDemo({ context }: Props) {
  const { referrer } = context;

  const copy =
    referrer === "linkedin"
      ? {
          title: "Welcome, LinkedIn visitor",
          body:
            "Here are case studies, team profiles, and open roles to help you evaluate us.",
          cta: "View case studies",
        }
      : referrer === "instagram"
      ? {
          title: "Hey there from Instagram",
          body:
            "Check out quick visual demos and highlights to get a feel for the product.",
          cta: "Watch quick demos",
        }
      : referrer === "direct"
      ? {
          title: "Welcome",
          body:
            "Explore product features and see how it can help you accomplish your goals.",
          cta: "Explore features",
        }
      : {
          title: "Welcome, friend",
          body:
            "Whether you’re researching or browsing, here are a few ways to start.",
          cta: "Start here",
        };

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
      <h3 className="text-xl font-semibold mb-2">{copy.title}</h3>
      <p className="text-slate-600 mb-4">{copy.body}</p>
      <div className="mt-auto">
        <button className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
          {copy.cta}
        </button>
        <p className="mt-3 text-xs text-slate-500">
          Detected referrer: <span className="font-medium">{referrer}</span>
        </p>
      </div>
    </div>
  );
}