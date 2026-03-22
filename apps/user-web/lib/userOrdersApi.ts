import { apiFetch } from "./apiClient";

export async function fetchMyOrders() {
  return apiFetch("/orders/my");
}

export async function fetchOrderDetail(id: string) {
  return apiFetch(`/orders/${id}`);
}
