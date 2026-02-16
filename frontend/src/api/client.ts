const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// sponsor mock user id (header override supported by backend)
const DEFAULT_USER_ID = "sponsor_123";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "X-User-Id": DEFAULT_USER_ID
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export type Summary = { views: number; rsvps: number; attendance: number };

export type EventRow = {
  event_id: string;
  title: string;
  start_time: string;
  views: number;
  rsvps: number;
  attendance: number;
};

export type EventsResponse = { events: EventRow[] };

export type TimePoint = { date: string; value: number };
export type TimeseriesResponse = { metric: string; days: number; points: TimePoint[] };

export const api = {
  me: () => request<{ user_id: string; role: string }>("/me"),
  summary: () => request<Summary>("/sponsor/summary"),
  events: () => request<EventsResponse>("/sponsor/events"),
  timeseries: (metric: "views" | "rsvps" | "attendance", days: number) =>
    request<TimeseriesResponse>(`/sponsor/timeseries?metric=${metric}&days=${days}`)
};
