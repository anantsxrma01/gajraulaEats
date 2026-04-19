// 🔥 NO need for declare process

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://backend-8qpa.onrender.com/api";

// ===== Auth Token =====
export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

// ===== Safe JWT Decode (SSR safe) =====
function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];

    // browser vs node safe decode
    const decoded =
      typeof window !== "undefined"
        ? atob(payload)
        : Buffer.from(payload, "base64").toString("utf-8");

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// ===== Token Expiry =====
function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  return Date.now() > decoded.exp * 1000;
}

// ===== Core Request =====
async function request(path: string, options: RequestInit = {}) {
  const token = getAuthToken();

  // 🔒 Expiry check
  if (token && isTokenExpired(token)) {
    setAuthToken(null);

    // ❗ DO NOT redirect here
    throw new Error("AUTH_EXPIRED");
  }

  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;

  try {
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
      throw new Error("INVALID_JSON");
    }

    if (!res.ok) {
      if (res.status === 401) {
        setAuthToken(null);
        throw new Error("UNAUTHORIZED");
      }

      throw new Error(data.message || "API_ERROR");
    }

    return data;
  } catch (err: any) {
    // 🌐 Network error
    if (err.message === "Failed to fetch") {
      throw new Error("NETWORK_ERROR");
    }

    throw err;
  }
}

// ===== API Wrapper =====
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