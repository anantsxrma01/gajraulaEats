import { apiFetch } from "./apiClient";

export function getShops(status?: string) {
  const query = status ? `?status=${status}` : "";
  return apiFetch(`/admin/shops${query}`);
}

export function approveShop(id: string) {
  return apiFetch(`/admin/shops/${id}/approve`, {
    method: "PATCH",
  });
}

export function rejectShop(id: string, reason: string) {
  return apiFetch(`/admin/shops/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}

export function suspendShop(id: string) {
  return apiFetch(`/admin/shops/${id}/suspend`, {
    method: "PATCH",
  });
}