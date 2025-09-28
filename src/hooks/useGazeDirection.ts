"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type GazeDirection = "left" | "right" | "center";

type Options = {
  // Pixels from center considered neutral
  deadzonePx?: number;
  // Number of samples to keep for smoothing
  windowSize?: number;
  // Minimum consecutive agreement to switch direction
  hysteresisCount?: number;
  // Whether to start eye tracking immediately
  autoStart?: boolean;
  // Adaptively recenter around recent gaze
  adaptiveCenter?: boolean;
  // Smoothing factor for adaptive center (0..1)
  centerAlpha?: number;
  // Low-pass filter for raw x position (0..1). Larger = more responsive, smaller = smoother
  positionAlpha?: number;
  // Minimum time between direction switches (ms)
  minSwitchMs?: number;
};

type Return = {
  direction: GazeDirection;
  enabled: boolean;
  enable: () => void;
  disable: () => void;
  recenter: () => void;
  setCenter: (x: number) => void;
};

declare global {
  interface Window {
    webgazer?: WebGazerAPI;
  }
}

interface WebGazerAPI {
  showVideo(v: boolean): WebGazerAPI;
  showFaceOverlay(v: boolean): WebGazerAPI;
  showFaceFeedbackBox(v: boolean): WebGazerAPI;
  showPredictionPoints(v: boolean): WebGazerAPI;
  setGazeListener(
    cb: (data: { x?: number | null } | null) => void
  ): WebGazerAPI;
  begin(): Promise<void>;
  clearGazeListener?: () => void;
  pause?: () => void;
  end(): Promise<void>;
}

function loadWebgazerScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no-window"));
    if (window.webgazer) return resolve();

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/webgazer/dist/webgazer.min.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("failed-to-load-webgazer"));
    document.head.appendChild(script);
  });
}

export function useGazeDirection(options: Options = {}): Return {
  const {
    deadzonePx = 80,
    windowSize = 7,
    hysteresisCount = 3,
    autoStart = false,
    adaptiveCenter = true,
    centerAlpha = 0.02,
    positionAlpha = 0.12,
    minSwitchMs = 150,
  } = options;

  const [enabled, setEnabled] = useState<boolean>(false);
  const [direction, setDirection] = useState<GazeDirection>("center");
  const directionRef = useRef<GazeDirection>("center");

  const samplesRef = useRef<GazeDirection[]>([]);
  const targetRef = useRef<GazeDirection>("center");
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef<boolean>(false);
  const centerRef = useRef<number>(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0
  );
  const streamsRef = useRef<Set<MediaStream>>(new Set());
  const smoothedXRef = useRef<number | null>(null);
  const lastSwitchAtRef = useRef<number>(0);

  const computeDirection = useCallback(
    (x: number | null): GazeDirection => {
      if (x == null) return "center";
      const delta = x - centerRef.current;
      if (Math.abs(delta) <= deadzonePx) return "center";
      return delta < 0 ? "left" : "right";
    },
    [deadzonePx]
  );

  const pushSample = useCallback(
    (dir: GazeDirection) => {
      const arr = samplesRef.current;
      arr.push(dir);
      if (arr.length > windowSize) arr.shift();
      // Majority vote with hysteresis requirement
      const counts: Record<GazeDirection, number> = {
        left: 0,
        right: 0,
        center: 0,
      };
      for (const d of arr) counts[d] += 1;
      let next: GazeDirection = "center";
      if (counts.left > counts.right && counts.left >= counts.center)
        next = "left";
      else if (counts.right > counts.left && counts.right >= counts.center)
        next = "right";
      else next = "center";

      if (next !== targetRef.current) {
        // require next to persist for hysteresisCount samples
        const lastK = arr.slice(-hysteresisCount);
        const stable =
          lastK.length === hysteresisCount && lastK.every((d) => d === next);
        const now =
          typeof performance !== "undefined" ? performance.now() : Date.now();
        const cooledDown = now - lastSwitchAtRef.current >= minSwitchMs;
        if (stable && cooledDown) {
          targetRef.current = next;
          directionRef.current = next;
          setDirection(next);
          lastSwitchAtRef.current = now;
        }
      } else if (directionRef.current !== next) {
        directionRef.current = next;
        setDirection(next);
      }
    },
    [windowSize, hysteresisCount, minSwitchMs]
  );

  const start = useCallback(async () => {
    if (startedRef.current) return;
    try {
      await loadWebgazerScript();
      if (!window.webgazer) return;
      // Configure webgazer
      window.webgazer
        .showVideo(false)
        .showFaceOverlay(false)
        .showFaceFeedbackBox(false)
        .showPredictionPoints(false);
      await window.webgazer
        .setGazeListener((data: { x?: number | null } | null) => {
          if (!data || typeof data.x !== "number") return;
          // Low-pass filter x position
          if (smoothedXRef.current == null) smoothedXRef.current = data.x;
          smoothedXRef.current =
            (1 - positionAlpha) * (smoothedXRef.current ?? data.x) +
            positionAlpha * data.x;
          if (adaptiveCenter && Number.isFinite(data.x)) {
            // Exponential moving average to track neutral center
            centerRef.current =
              (1 - centerAlpha) * centerRef.current + centerAlpha * data.x;
          }
          pushSample(computeDirection(smoothedXRef.current));
        })
        .begin();
      // Capture the created MediaStream for robust shutdown
      try {
        const videoEl = document.getElementById(
          "webgazerVideoFeed"
        ) as HTMLVideoElement | null;
        const s = (videoEl?.srcObject as MediaStream | null) ?? null;
        if (s) streamsRef.current.add(s);
      } catch {}
      startedRef.current = true;
      setEnabled(true);
    } catch (e) {
      // silently fail; caller can keep hover fallback
      console.warn("webgazer failed to start", e);
    }
  }, [
    computeDirection,
    pushSample,
    adaptiveCenter,
    centerAlpha,
    positionAlpha,
  ]);

  const stop = useCallback(async () => {
    setEnabled(false);
    try {
      if (window.webgazer) {
        try {
          window.webgazer.clearGazeListener?.();
        } catch {}
        try {
          window.webgazer.pause?.();
        } catch {}
        try {
          await window.webgazer.end();
        } catch {}
      }
    } catch {}
    // Aggressively stop any leftover camera tracks and remove elements
    try {
      // Stop tracks on known webgazer video
      const el = document.getElementById(
        "webgazerVideoFeed"
      ) as HTMLVideoElement | null;
      const stream = el?.srcObject as MediaStream | null;
      if (stream) {
        for (const track of stream.getTracks()) track.stop();
        el!.srcObject = null;
        streamsRef.current.add(stream);
      }
      el?.remove();
      // Also stop tracks on any other video elements just in case
      const mediaEls = Array.from(
        document.querySelectorAll("video, audio")
      ) as (HTMLVideoElement | HTMLAudioElement)[];
      for (const m of mediaEls) {
        const s = m.srcObject as MediaStream | null;
        if (s) {
          for (const t of s.getTracks()) t.stop();
          m.srcObject = null;
          streamsRef.current.add(s);
        }
      }
      // Finally stop any streams we captured
      for (const s of streamsRef.current) {
        try {
          for (const t of s.getTracks()) t.stop();
        } catch {}
      }
      streamsRef.current.clear();
      document.getElementById("webgazerFaceOverlay")?.remove();
      document.getElementById("webgazerFaceFeedbackBox")?.remove();
    } catch {}
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    samplesRef.current = [];
    targetRef.current = "center";
    setDirection("center");
    startedRef.current = false;
    centerRef.current =
      typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    smoothedXRef.current = null;
  }, []);

  useEffect(() => {
    if (autoStart) start();
    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  const recenter = useCallback(() => {
    centerRef.current =
      typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  }, []);

  const setCenter = useCallback((x: number) => {
    if (Number.isFinite(x)) centerRef.current = x;
  }, []);

  const api = useMemo<Return>(
    () => ({
      direction,
      enabled,
      enable: start,
      disable: stop,
      recenter,
      setCenter,
    }),
    [direction, enabled, start, stop, recenter, setCenter]
  );
  return api;
}



