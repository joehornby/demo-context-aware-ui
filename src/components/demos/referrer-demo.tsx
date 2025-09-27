"use client";

import { useMemo, useState } from "react";
import type { AppContext } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Squircle } from "corner-smoothing";

type Props = { context: AppContext };

const REFERRERS: AppContext["referrer"][] = ["linkedin", "instagram", "other"];

function getCopyFor(ref: AppContext["referrer"]) {
  return ref === "linkedin"
    ? {
        title: "Welcome, potential colleague",
        body: "Here's my portfolio and work experience. Feel free to reach out if you're interested in collaborating.",
        cta: "View work",
      }
    : ref === "instagram"
    ? {
        title: "Hey there potential customer",
        body: "Check out quick visual demos and highlights to get a feel for the products and services I offer.",
        cta: "Watch a demo",
      }
    : {
        title: "Welcome, friend",
        body: "Here's a limited preview of my portfolio.",
        cta: "View portfolio",
      };
}

export function ReferrerDemo({ context }: Props) {
  const [selectedReferrer, setSelectedReferrer] =
    useState<AppContext["referrer"]>("linkedin");

  const copy = useMemo(() => getCopyFor(selectedReferrer), [selectedReferrer]);

  const effectiveReferrer = selectedReferrer;

  return (
    <div className="flex h-full flex-col overflow-visible">
      {/* Selector */}
      <div className="mb-4">
        <div className="text-xs text-slate-500 mb-1">
          Simulate the site you just came from
        </div>
        <Squircle
          cornerRadius={16}
          cornerSmoothing={0.88}
          className="inline-flex bg-white p-2 text-sm h-auto"
        >
          {REFERRERS.map((r) => (
            <Button
              key={r}
              variant={selectedReferrer === r ? "default" : "ghost"}
              size="sm"
              className="capitalize px-3"
              onClick={() => setSelectedReferrer(r)}
            >
              {r}
            </Button>
          ))}
        </Squircle>
      </div>

      {/* Tiny browser mock */}
      <Card className="overflow-hidden mb-3 shadow-none">
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

        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2">{copy.title}</h3>
          <p className="text-slate-600 mb-4">{copy.body}</p>
          <Button size="sm">{copy.cta}</Button>
        </CardContent>
      </Card>

      <div className="mt-auto text-xs text-slate-500">
        Detected referrer:{" "}
        <span className="font-medium">{context.referrer}</span>
        <span className="mx-1">•</span>
        Selected: <span className="font-medium">{effectiveReferrer}</span>
      </div>
    </div>
  );
}