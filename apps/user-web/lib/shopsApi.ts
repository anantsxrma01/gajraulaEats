import { apiFetch } from "./apiClient";

export async function getNearbyShops() {
  return apiFetch("/shops/nearby");
}

export async function getShopPublic(id: string) {
  return apiFetch(`/shops/${id}/public`);
}

export async function getShopMenu(id: string) {
  return apiFetch(`/shops/${id}/menu`);
}
