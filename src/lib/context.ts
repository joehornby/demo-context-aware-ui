export type AppContext = {
  time: string;
  referrer: "linkedin" | "instagram" | "direct" | "other";
  location?: { city: string; country: string };
  weather?: { condition: "sunny" | "rainy" | "cloudy"; tempC: number };
};

export function getInitialContext(): AppContext {
  // Simulated context for demo purposes
  const ref = typeof document !== "undefined" ? document.referrer : "";

  const referrer: AppContext["referrer"] = ref.includes("linkedin")
    ? "linkedin"
    : ref.includes("instagram")
    ? "instagram"
    : ref
    ? "other"
    : "direct";

  const now = new Date();
  return {
    time: now.toLocaleTimeString(),
    referrer,
    location: { city: "London", country: "UK" },
    weather: { condition: "cloudy", tempC: 18 },
  };
}