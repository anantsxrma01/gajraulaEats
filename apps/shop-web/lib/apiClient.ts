const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-8qpa.onrender.com/api";

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

  // Ensure default cache policy is no-store
  const fetchOptions = {
    cache: "no-store" as RequestCache,
    ...options,
    headers,
  };

  const res = await fetch(`${API_BASE}${path}`, fetchOptions);

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: (path: string, options?: RequestInit) => apiFetch(path, { ...options, method: "GET" }),
  post: (path: string, body?: any, options?: RequestInit) =>
    apiFetch(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: (path: string, body?: any, options?: RequestInit) =>
    apiFetch(path, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: (path: string, options?: RequestInit) => apiFetch(path, { ...options, method: "DELETE" }),
};
