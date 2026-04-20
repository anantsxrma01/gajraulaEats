const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-8qpa.onrender.com/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("admin_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_phone");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  get: (path, options) => apiFetch(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiFetch(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: (path, body, options) =>
    apiFetch(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (path, options) => apiFetch(path, { ...options, method: "DELETE" }),
};

export default api;
