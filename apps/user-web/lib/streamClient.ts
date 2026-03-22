import { getAuthToken } from "./apiClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export function createOrderEventSource(orderId: string): EventSource | null {
  if (typeof window === "undefined") return null;
  const token = getAuthToken();
  if (!token) return null;

  const url = new URL(`${API_BASE}/orders/${orderId}/stream`);
  url.searchParams.set("token", token);

  const es = new EventSource(url.toString());

  return es;
}
