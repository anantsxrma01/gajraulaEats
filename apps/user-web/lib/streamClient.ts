// Real-time Order Stream (SSE)

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://backend-8qpa.onrender.com";

export function createOrderEventSource(orderId: string) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const url = `${API_BASE}/orders/${orderId}/stream?token=${token}`;

  console.log("STREAM CONNECT:", url);

  return new EventSource(url); 
}