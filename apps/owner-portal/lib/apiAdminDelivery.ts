import { apiFetch } from "./apiClient";

export function fetchDeliveryPartners(params?: { status?: string; is_online?: string }) {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.is_online) query.append("is_online", params.is_online);

  const q = query.toString() ? `?${query.toString()}` : "";
  return apiFetch(`/admin/delivery-partners${q}`);
}

export function updateDeliveryPartnerStatus(id: string, status: string) {
  return apiFetch(`/admin/delivery-partners/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function fetchDeliveryPartnerDetails(id: string) {
  return apiFetch(`/admin/delivery-partners/${id}`);
}

export function fetchDeliveryPartnerOrders(id: string, limit: number = 20) {
  return apiFetch(`/admin/delivery-partners/${id}/orders?limit=${limit}`);
}