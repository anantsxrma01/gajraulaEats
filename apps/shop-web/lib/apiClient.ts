const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return res.json();
}
