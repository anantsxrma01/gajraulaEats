import { apiFetch } from "./apiClient";

export function getShops(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch(`/admin/shops${query}`);
}

// Backend route: PATCH /admin/shops/:id/status  { status: "APPROVED" }
export function approveShop(id: string) {
  return apiFetch(`/admin/shops/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "APPROVED" }),
  });
}

// Backend route: PATCH /admin/shops/:id/status  { status: "REJECTED", rejection_reason }
export function rejectShop(id: string, reason: string) {
  return apiFetch(`/admin/shops/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "REJECTED", rejection_reason: reason }),
  });
}

// Backend does not have a dedicated suspend endpoint — reuse status route
export function suspendShop(id: string) {
  return apiFetch(`/admin/shops/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "SUSPENDED" }),
  });
}