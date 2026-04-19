// Real-time Order Stream (SSE)

declare var process: any;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://backend-8qpa.onrender.com/api";

export function connectOrderStream(
  orderId: string,
  onMessage: (data: any) => void,
  onError?: (err: any) => void
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const url = `${API_BASE}/orders/stream/${orderId}?token=${token}`;

  console.log("STREAM CONNECT:", url);

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Stream parse error:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("Stream error:", err);
    if (onError) onError(err);
    eventSource.close();
  };

  return () => {
    console.log("STREAM CLOSED");
    eventSource.close();
  };
}