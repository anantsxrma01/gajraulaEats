import { apiFetch } from "./apiClient";

export async function fetchPlatformSettings() {
  return apiFetch("/admin/settings");
}

export async function updatePlatformSettings(payload: any) {
  return apiFetch("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}