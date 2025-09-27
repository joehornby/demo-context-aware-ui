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

  try {
    // Combine provided signal with our timeout signal if present
    const combinedSignal = signal
      ? (AbortSignal as any).any
        ? (AbortSignal as any).any([signal, controller.signal])
        : controller.signal
      : controller.signal;

    const response = await fetch(input, { ...rest, signal: combinedSignal });
    return response;
  } finally {
    clearTimeout(id);
  }
}
