import { apiFetch } from "./apiClient";

export async function fetchShopOrders(status?: string) {
  const query = status ? `?status=${status}` : "";
  return apiFetch(`/shop-owner/orders${query}`);
}

export async function updateOrderStatus(id: string, new_status: string, cancellation_reason?: string) {
  return apiFetch(`/shop-owner/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ new_status, cancellation_reason }),
  });
}