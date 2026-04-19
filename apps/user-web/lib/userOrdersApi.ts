import { api } from "./apiClient";

// 📦 Get logged-in user's orders
export const getUserOrders = () =>
  api.get("/orders/my");

// 🔍 Get single order (user context)
export const getUserOrderById = (id: string) =>
  api.get(`/orders/${id}`);

// ❌ Cancel order (if supported)
export const cancelOrder = (id: string) =>
  api.put(`/orders/${id}/cancel`, {});