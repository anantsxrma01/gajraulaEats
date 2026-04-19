declare var process: any;

// ✅ Always use backend (not gateway for now)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api-gateway-g6za.onrender.com";

// ===== Auth Token =====
export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token"); // ✅ FIXED
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

// ===== Token Expiry Check =====
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch {
    return true; // malformed, consider expired
  }
}

// ===== Core Fetch =====
async function request(path: string, options: RequestInit = {}) {
  const token = getAuthToken();

  if (token && isTokenExpired(token)) {
    setAuthToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Token expired");
  }

  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;

  console.log("API:", url);

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON: ${text}`);
  }

  if (!res.ok) {
    if (res.status === 401) {
      setAuthToken(null); // Clear invalid token
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw new Error(data.message || `Error ${res.status}`);
  }

  return data;
}

// ===== Helper Methods =====
export const api = {
  get: (path: string) => request(path),

  post: (path: string, body: any) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (path: string, body: any) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (path: string) =>
    request(path, {
      method: "DELETE",
    }),
};