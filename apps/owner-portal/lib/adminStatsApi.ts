import { apiFetch } from "./apiClient";

export async function fetchOverview() {
  return apiFetch("/admin/stats/overview");
}

export async function fetchDaily(days = 7) {
  return apiFetch(`/admin/stats/daily?days=${days}`);
}

export async function fetchTopShops(limit = 5, days = 30) {
  return apiFetch(`/admin/stats/top-shops?limit=${limit}&days=${days}`);
}

export async function fetchTopItems(limit = 5, days = 30) {
  return apiFetch(`/admin/stats/top-items?limit=${limit}&days=${days}`);
}