const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-8qpa.onrender.com/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export function clearAuthAndRedirect() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store", // Force no cache for admin dashboard responses
  });

  if (res.status === 401) {
    clearAuthAndRedirect();
    throw new Error("Session expired. Please log in again.");
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    if (res.status === 403) {
      if (typeof window !== "undefined") window.location.href = "/not-allowed";
    }
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  get: (path: string, options?: RequestInit) => apiFetch(path, { ...options, method: "GET" }),
  post: (path: string, body?: any, options?: RequestInit) =>
    apiFetch(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: (path: string, body?: any, options?: RequestInit) =>
    apiFetch(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string, options?: RequestInit) => apiFetch(path, { ...options, method: "DELETE" }),
};
