import { api } from "./apiClient";

export async function getShops() {
  return api.get("/admin/shops");
}

export async function createShop(data) {
  return api.post("/shops", data);
}

export async function assignOwner(shopId, ownerId) {
  return api.patch(`/admin/shops/${shopId}/owner`, { ownerId });
}
