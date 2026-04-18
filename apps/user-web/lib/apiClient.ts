// apps/user-web/lib/apiClient.ts

declare var process: any;

// 🔥 ALWAYS point to API Gateway
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api-gateway-g6za.onrender.com";

// ===== Auth Token Helpers =====
export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userToken");
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("userToken", token);
  else localStorage.removeItem("userToken");
}

// ===== Core API Fetch =====
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;

  // 🔍 DEBUG (remove later)
  console.log("API CALL:", url);

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Invalid response from server: ${text}`);
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}