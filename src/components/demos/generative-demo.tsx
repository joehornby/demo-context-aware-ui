"use client";

import { useState } from "react";
import type { AppContext } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ToolCall =
  | { name: "getWeather"; args: { city: string } }
  | { name: "getCalendar"; args: { date: string } }
  | { name: "getEvents"; args: { city: string; when: string } };

function simulateTool(call: ToolCall) {
  if (call.name === "getWeather") {
    return { condition: "cloudy", tempC: 18 };
  }
  if (call.name === "getCalendar") {
    return { freeBlocks: ["14:00–16:00"] };
  }
  if (call.name === "getEvents") {
    return [
      { title: "Design Expo", time: "15:00", type: "indoor" },
      { title: "Park Run", time: "15:30", type: "outdoor" },
    ];
  }
  throw new Error(`Unknown tool: ${(call as ToolCall).name}`);
}

export function GenerativeDemo({ context }: { context: AppContext }) {
  const [log, setLog] = useState<string[]>([]);
  const [plan, setPlan] = useState<
    { title: string; reason: string; cta: string }[] | null
  >(null);

  const run = () => {
    const steps: string[] = [];
    steps.push("User hint: 'I have 2 hours free this afternoon'");
    const weather = simulateTool({
      name: "getWeather",
      args: { city: context.location?.city ?? "London" },
    }) as { condition: string; tempC: number };
    steps.push(`Tool:getWeather → ${weather.condition}, ${weather.tempC}°C`);
    const cal = simulateTool({
      name: "getCalendar",
      args: { date: new Date().toDateString() },
    }) as { freeBlocks: string[] };
    steps.push(`Tool:getCalendar → free ${cal.freeBlocks.join(", ")}`);
    const events = simulateTool({
      name: "getEvents",
      args: { city: context.location?.city ?? "London", when: "afternoon" },
    }) as { title: string; time: string; type: string }[];
    steps.push(`Tool:getEvents → ${events.map((e) => e.title).join(", ")}`);

    const picks = [
      {
        title: "Design Expo at 15:00",
        reason:
          "Indoor option fits cloudy weather; near you; fits 14–16 free block",
        cta: "Get ticket",
      },
      {
        title: "Park Run at 15:30",
        reason: "Outdoor if you prefer; bring a light jacket",
        cta: "Join run",
      },
    ];
    setPlan(picks);
    setLog(steps);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold">Agent-crafted plan</h3>
        <Button onClick={run} size="sm">
          Generate
        </Button>
      </div>

      <div className="mt-3">
        <h4 className="text-xs font-semibold mb-1">
          Reasoning trace (simulated)
        </h4>
        <div className="rounded-md border bg-white p-2 h-24 overflow-auto text-xs text-stone-600">
          {log.length ? (
            <ul className="list-disc pl-5 space-y-1">
              {log.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          ) : (
            <p>—</p>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        {plan ? (
          plan.map((p, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm">{p.reason}</div>
                <Button variant="outline" size="sm" className="mt-2">
                  {p.cta}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-sm">
            Press Generate to see tool-calls and a proposed plan.
          </div>
        )}
      </div>
    </div>
  );
}