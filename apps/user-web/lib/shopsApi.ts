import { api } from "./apiClient";

// 🏪 Get all shops
export const getShops = () => api.get("/shops");

// 🏪 Get single shop
export const getShopById = (id: string) =>
  api.get(`/shops/${id}`);

// 🍽️ Get menu for a shop
export const getMenu = (shopId: string) =>
  api.get(`/menu/${shopId}`);