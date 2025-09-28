import { NextRequest, NextResponse } from "next/server";

// Environment variables
const OPENTRIPMAP_API_KEY = process.env.OPENTRIPMAP_API_KEY;
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;

type Suggestion = {
  source: "opentripmap" | "ticketmaster";
  title: string;
  url: string;
  when?: string | null;
  category?: string | null;
  indoor?: boolean | null;
  lat?: number;
  lon?: number;
};

// Minimal shapes for third-party APIs we touch to avoid using `any`
type OpenTripMapPlace = {
  name?: string;
  xid?: string;
  kinds?: string;
  point?: { lat?: number; lon?: number };
};

function hasName(p: OpenTripMapPlace): p is OpenTripMapPlace & { name: string } {
  return typeof p?.name === "string" && Boolean(p.name);
}

type TMEvent = {
  name: string;
  url: string;
  dates?: { start?: { localDate?: string; dateTime?: string } };
  _embedded?: {
    venues?: Array<{
      name?: string;
      location?: { latitude?: string | number; longitude?: string | number };
    }>;
  };
  classifications?: Array<{ segment?: { name?: string } }>;
};

type TicketmasterResponse = {
  _embedded?: { events?: TMEvent[] };
};

function pick<T>(arr: T[], max: number): T[] {
  return arr.slice(0, Math.max(0, max));
}

function isNight(localTime: string | undefined): boolean {
  if (!localTime) return false;
  // Expect formats like "13:45:02" or locale strings; try to parse hours
  const match = localTime.match(/(\d{1,2}):(\d{2})/);
  if (!match) return false;
  const hour = parseInt(match[1], 10);
  return hour >= 20 || hour < 6;
}

function preferIndoor(condition: string | undefined): boolean {
  return condition === "rainy";
}

function preferOutdoor(condition: string | undefined): boolean {
  return condition === "sunny";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const condition = searchParams.get("condition") || undefined; // sunny | rainy | cloudy
  const localTime = searchParams.get("localTime") || undefined;
  const radius = Number(searchParams.get("radius")) || 5000; // meters

  if (!isFinite(lat) || !isFinite(lon)) {
    return NextResponse.json(
      { error: "lat and lon required" },
      { status: 400 }
    );
  }

  const wantIndoor = preferIndoor(condition);
  const wantOutdoor = preferOutdoor(condition);
  const night = isNight(localTime);

  const promises: Promise<Suggestion[]>[] = [];

  // OpenTripMap: nearby interesting places
  if (OPENTRIPMAP_API_KEY) {
    promises.push(
      fetchOpenTripMap({ lat, lon, radius, wantIndoor, wantOutdoor })
    );
  }

  // Ticketmaster: events near location; night bias for evenings
  if (TICKETMASTER_API_KEY) {
    promises.push(fetchTicketmaster({ lat, lon, night }));
  }

  let results: Suggestion[] = [];
  try {
    const lists = await Promise.allSettled(promises);
    for (const r of lists) {
      if (r.status === "fulfilled") results = results.concat(r.value);
    }
  } catch {}

  // Simple re-ranking: prefer indoor when rainy; outdoor when sunny; otherwise neutral
  results.sort((a, b) => scoreSuggestion(b) - scoreSuggestion(a));

  function scoreSuggestion(s: Suggestion): number {
    let score = 0;
    if (wantIndoor && s.indoor) score += 2;
    if (wantOutdoor && s.indoor === false) score += 2;
    if (night && s.source === "ticketmaster") score += 1;
    // Slight bump for having time info
    if (s.when) score += 0.5;
    return score;
  }

  // Return top 6
  return NextResponse.json(
    { suggestions: pick(results, 6) },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}

async function fetchOpenTripMap(params: {
  lat: number;
  lon: number;
  radius: number;
  wantIndoor: boolean;
  wantOutdoor: boolean;
}): Promise<Suggestion[]> {
  const { lat, lon, radius, wantIndoor, wantOutdoor } = params;
  // Categories: indoor museums/galleries; outdoor parks/gardens/viewpoints
  const indoorKinds = [
    "museums",
    "theatres_and_entertainments",
    "galleries",
    "cultural",
  ]; // indoor-ish
  const outdoorKinds = [
    "parks",
    "gardens",
    "natural",
    "view_points",
    "urban_environment",
  ]; // outdoor-ish
  const kinds = wantIndoor
    ? indoorKinds
    : wantOutdoor
    ? outdoorKinds
    : indoorKinds.concat(outdoorKinds);

  const url = new URL("https://api.opentripmap.com/0.1/en/places/radius");
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("rate", "2"); // more interesting
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "20");
  url.searchParams.set("kinds", kinds.join(","));
  url.searchParams.set("apikey", OPENTRIPMAP_API_KEY!);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const raw = (await res.json()) as unknown;
  if (!Array.isArray(raw)) return [];
  const data = raw as OpenTripMapPlace[];
  const suggestions: Suggestion[] = data
    .filter(hasName)
    .slice(0, 12)
    .map((p) => ({
      source: "opentripmap",
      title: p.name,
      url: `https://opentripmap.com/en/card/${p.xid ?? "?"}`,
      when: null,
      category: p.kinds || null,
      indoor: kinds.some((k) => indoorKinds.includes(k))
        ? true
        : kinds.some((k) => outdoorKinds.includes(k))
        ? false
        : null,
      lat: typeof p?.point?.lat === "number" ? p.point.lat : undefined,
      lon: typeof p?.point?.lon === "number" ? p.point.lon : undefined,
    }));
  return suggestions;
}

async function fetchTicketmaster(params: {
  lat: number;
  lon: number;
  night: boolean;
}): Promise<Suggestion[]> {
  const { lat, lon } = params;
  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", TICKETMASTER_API_KEY!);
  url.searchParams.set("latlong", `${lat.toFixed(4)},${lon.toFixed(4)}`);
  url.searchParams.set("radius", "25"); // miles
  url.searchParams.set("unit", "miles");
  url.searchParams.set("size", "20");
  // If night, prefer events starting later; otherwise general
  // Ticketmaster supports startDateTime/endDateTime in ISO8601 UTC; we'll keep general as demo

  const res = await fetch(url.toString(), { next: { revalidate: 120 } });
  if (!res.ok) return [];
  const raw = (await res.json()) as unknown;
  const embeddedEvents = (raw as TicketmasterResponse)?._embedded?.events;
  const events = Array.isArray(embeddedEvents) ? embeddedEvents : undefined;
  if (!events) return [];
  const suggestions: Suggestion[] = events.slice(0, 12).map((e: TMEvent) => {
    const name: string = e.name;
    const url: string = e.url;
    const dates = e.dates?.start?.localDate || e.dates?.start?.dateTime || null;
    const venue = e._embedded?.venues?.[0]?.name || null;
    const lat = Number(e._embedded?.venues?.[0]?.location?.latitude);
    const lon = Number(e._embedded?.venues?.[0]?.location?.longitude);
    return {
      source: "ticketmaster",
      title: venue ? `${name} @ ${venue}` : name,
      url,
      when: dates,
      category: e.classifications?.[0]?.segment?.name || null,
      indoor: true, // most events are indoor; conservative default
      lat: isFinite(lat) ? lat : undefined,
      lon: isFinite(lon) ? lon : undefined,
    } satisfies Suggestion;
  });
  return suggestions;
}


