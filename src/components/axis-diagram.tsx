"use client";

import React from "react";

export function AxisDiagram() {
  return (
    <div className="w-full">
      <div className="relative h-10">
        <div className="absolute left-[14px] right-[14px] top-1/2 -translate-y-1/2 h-[2px] bg-foreground" />
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground"
          width="14"
          height="16"
          viewBox="0 0 14 16"
          aria-hidden="true"
        >
          <path d="M14 0 L0 8 L14 16 Z" fill="currentColor" />
        </svg>
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground"
          width="14"
          height="16"
          viewBox="0 0 14 16"
          aria-hidden="true"
        >
          <path d="M0 0 L14 8 L0 16 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-6 text-sm leading-relaxed">
        <div>
          <div className="font-semibold text-base">Agent</div>
          <div>Probabilistic “slippy hands”</div>
          <div>LLM Driven</div>
        </div>
        <div className="text-left w-auto justify-self-end pr-2">
          <div className="font-semibold text-base">Workflow</div>
          <div>Deterministic “iron grip”</div>
          <div>Reduced LLM decisions</div>
        </div>
      </div>
    </div>
  );
}

export default AxisDiagram;


