import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type FetchWithTimeoutOptions = RequestInit & { timeoutMs?: number };

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = 8000, signal, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  let cleanup: (() => void) | null = null;

  try {
    // Combine provided signal with our timeout signal if present, without using `any`
    type AbortSignalAny = typeof AbortSignal & {
      any?: (signals: AbortSignal[]) => AbortSignal;
    };
    const abortSignalAny = AbortSignal as AbortSignalAny;

    let combinedSignal: AbortSignal = controller.signal;

    if (signal) {
      if (typeof abortSignalAny.any === "function") {
        combinedSignal = abortSignalAny.any([signal, controller.signal]);
      } else {
        const combo = new AbortController();
        const onAbort = () => combo.abort();
        if (signal.aborted || controller.signal.aborted) combo.abort();
        signal.addEventListener("abort", onAbort);
        controller.signal.addEventListener("abort", onAbort);
        combinedSignal = combo.signal;
        cleanup = () => {
          signal.removeEventListener("abort", onAbort);
          controller.signal.removeEventListener("abort", onAbort);
        };
      }
    }

    const response = await fetch(input, { ...rest, signal: combinedSignal });
    return response;
  } finally {
    clearTimeout(id);
    // remove event listeners if we created a combined controller
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      cleanup && cleanup();
    } catch {}
  }
}
