import { useEffect, useMemo, useRef, useState } from "react";

export function useSectionObserver(ids: string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0]);
  const activeIdRef = useRef<string>(ids[0]);
  const refs = useMemo(
    () =>
      ids.reduce<Record<string, React.RefObject<HTMLDivElement | null>>>(
        (acc, id) => {
          acc[id] = { current: null };
          return acc;
        },
        {}
      ),
    [ids]
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const ratiosRef = useRef<Record<string, number>>({});
  const lastSwitchAtRef = useRef<number>(0);

  // Tunables to reduce flicker: require stronger dominance and add a short cooldown
  const MIN_VISIBLE_RATIO = 0.35; // don't switch unless winner is at least 35% visible
  const HYSTERESIS_DELTA = 0.12; // winner must exceed current by 12%
  const SWITCH_COOLDOWN_MS = 200; // minimum time between switches

  useEffect(() => {
    const sections = ids
      .map((id) => refs[id].current)
      .filter(Boolean) as HTMLDivElement[];

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Track latest ratios for all observed sections
        for (const entry of entries) {
          const id =
            (entry.target.getAttribute("data-section-id") as string) || ids[0];
          ratiosRef.current[id] = entry.intersectionRatio;
        }

        // Determine the most visible section using the stored ratios
        let topId = ids[0];
        let topRatio = ratiosRef.current[topId] ?? 0;
        for (const id of ids) {
          const r = ratiosRef.current[id] ?? 0;
          if (r > topRatio) {
            topId = id;
            topRatio = r;
          }
        }

        const currentId = activeIdRef.current;
        const currentRatio = ratiosRef.current[currentId] ?? 0;

        // Apply certainty rules to avoid flicker
        const now = performance.now();
        const cooledDown = now - lastSwitchAtRef.current >= SWITCH_COOLDOWN_MS;
        const dominantEnough = topRatio >= MIN_VISIBLE_RATIO;
        const exceedsByDelta = topRatio >= currentRatio + HYSTERESIS_DELTA;

        if (
          topId !== currentId &&
          cooledDown &&
          dominantEnough &&
          exceedsByDelta
        ) {
          lastSwitchAtRef.current = now;
          setActiveId(topId);
        }
      },
      {
        root: null,
        // Require the section to be closer to center before we consider it
        rootMargin: "0px 0px -35% 0px",
        threshold: [0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [ids, refs]);

  // Keep a ref in sync so the observer callback can read the latest without re-instantiating
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  return { refs, activeId };
}