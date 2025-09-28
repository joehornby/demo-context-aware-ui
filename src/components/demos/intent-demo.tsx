"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGazeDirection } from "@/hooks/useGazeDirection";

type Target = "temperature" | "music" | null;

export function IntentDemo() {
  const [target, setTarget] = useState<Target>(null);
  const [temp, setTemp] = useState<number>(21);
  const [volume, setVolume] = useState<number>(40);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<"intro" | "camera" | "calibrate" | "demo">(
    "intro"
  );
  const [calPoints, setCalPoints] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  const { direction, enabled, enable, disable, recenter, setCenter } =
    useGazeDirection({
      deadzonePx: 120,
      windowSize: 11,
      hysteresisCount: 3,
      autoStart: false,
      adaptiveCenter: true,
      centerAlpha: 0.03,
    });

  useEffect(() => {
    if (!enabled || step !== "demo") return;
    if (direction === "left") setTarget("temperature");
    else if (direction === "right") setTarget("music");
    else if (direction === "center") setTarget(null);
  }, [direction, enabled, step]);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, mounted]);

  return (
    <div className="flex h-full flex-col">
      <h3 className="text-xl font-semibold">Look → Turn → Adjust</h3>

      <div className="mt-2">
        <Button
          onClick={() => {
            setIsOpen(true);
            setStep("intro");
          }}
        >
          Launch eye tracking demo
        </Button>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsOpen(false);
            setStep("intro");
            setCalPoints(0);
            if (enabled) disable();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="p-0 border rounded-lg w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-w-none sm:max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-2rem)] xl:max-w-[calc(100vw-2rem)] 2xl:max-w-[calc(100vw-2rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-2rem)] xl:h-[calc(100vh-2rem)] 2xl:h-[calc(100vh-2rem)]"
        >
          <DialogTitle className="sr-only">Eye Tracking Demo</DialogTitle>
          <div className="absolute inset-0 p-6 md:p-12">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Eye Tracking Demo</h4>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setStep("intro");
                  setCalPoints(0);
                  if (enabled) disable();
                }}
              >
                Close
              </Button>
            </div>

            {step === "intro" && (
              <div className="mt-12 max-w-2xl">
                <p className="mb-4">
                  This demo uses your camera locally to estimate gaze position.
                  Nothing is sent to a server.
                </p>
                <Button onClick={() => setStep("camera")}>Continue</Button>
              </div>
            )}

            {step === "camera" && (
              <div className="mt-12 max-w-2xl">
                <p className="mb-4">Enable the camera to proceed.</p>
                <div className="flex gap-3">
                  <Button
                    onClick={async () => {
                      await enable();
                      recenter();
                      setStep("calibrate");
                    }}
                  >
                    Enable camera
                  </Button>
                  <Button variant="outline" onClick={() => setStep("intro")}>
                    Back
                  </Button>
                </div>
              </div>
            )}

            {step === "calibrate" && (
              <div className="absolute inset-0">
                {(["tl", "tr", "c", "bl", "br"] as const).map((pos, idx) => {
                  const coords = (
                    pos === "tl"
                      ? { top: 24, left: 24 }
                      : pos === "tr"
                      ? { top: 24, right: 24 }
                      : pos === "bl"
                      ? { bottom: 24, left: 24 }
                      : pos === "br"
                      ? { bottom: 24, right: 24 }
                      : {
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }
                  ) as React.CSSProperties;
                  const size = 28;
                  return (
                    <button
                      key={pos}
                      style={{
                        position: "absolute",
                        width: size,
                        height: size,
                        borderRadius: 9999,
                        ...coords,
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 focus:outline-none"
                      onClick={(e) => {
                        const rect = (
                          e.target as HTMLButtonElement
                        ).getBoundingClientRect();
                        const x = rect.left + rect.width / 2;
                        setCenter(x);
                        setCalPoints((c) => c + 1);
                        if (idx === 4) {
                          setStep("demo");
                        }
                      }}
                      aria-label={`Calibration ${idx + 1}`}
                    />
                  );
                })}
                <div className="absolute bottom-5/12 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-2 rounded border text-sm">
                  Calibration: {Math.min(calPoints, 5)} / 5
                </div>
              </div>
            )}

            {step === "demo" && (
              <div className="mt-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs text-stone-500">
                    Gaze: {direction}
                  </span>
                  <Button size="sm" variant="outline" onClick={recenter}>
                    Recenter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStep("calibrate")}
                  >
                    Recalibrate
                  </Button>
                  <Button size="sm" variant="outline" onClick={disable}>
                    Disable camera
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div
                    className={`rounded-lg border p-6 h-[50vh] ${
                      target === "temperature"
                        ? "ring-2 ring-emerald-400 border-emerald-300"
                        : "border-stone-200"
                    }`}
                    onMouseEnter={() => setTarget("temperature")}
                  >
                    <div className="text-stone-500">Temperature</div>
                    <div className="text-5xl font-semibold mt-2">{temp}°C</div>
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={() => setTemp((t) => Math.max(16, t - 1))}
                        variant="outline"
                      >
                        -
                      </Button>
                      <Button
                        onClick={() => setTemp((t) => Math.min(28, t + 1))}
                        variant="outline"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div
                    className={`rounded-lg border p-6 h-[50vh] ${
                      target === "music"
                        ? "ring-2 ring-emerald-400 border-emerald-300"
                        : "border-stone-200"
                    }`}
                    onMouseEnter={() => setTarget("music")}
                  >
                    <div className="text-stone-500">Music volume</div>
                    <div className="text-5xl font-semibold mt-2">{volume}%</div>
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={() => setVolume((v) => Math.max(0, v - 1))}
                        variant="outline"
                      >
                        -
                      </Button>
                      <Button
                        onClick={() => setVolume((v) => Math.min(100, v + 1))}
                        variant="outline"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}