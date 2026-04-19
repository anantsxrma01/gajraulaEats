import { api } from "./apiClient";

export const getNearbyShops = () => api.get("/shops/nearby");
export const getShopPublic = (id: string) => api.get(`/shops/${id}/public`);
export const getShopMenu = (shopId: string) => api.get(`/menu/${shopId}`);

export const getShops = () => api.get("/shops");
export const getShopById = (id: string) => api.get(`/shops/${id}`);
