import { api } from "./apiClient";

export async function fetchShopOrders(status?: string) {
  const query = status ? `?status=${status}` : "";
  return api.get(`/shop-owner/orders${query}`);
}

export async function updateOrderStatus(id: string, new_status: string, cancellation_reason?: string) {
  return api.patch(`/shop-owner/orders/${id}/status`, { new_status, cancellation_reason });
}