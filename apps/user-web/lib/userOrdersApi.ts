import { api } from "./apiClient";

export const fetchOrderDetail = (id: string) => api.get(`/orders/${id}`);
export const getUserOrders = () => api.get("/orders/my");
export const getUserOrderById = (id: string) => api.get(`/orders/${id}`);
export const cancelOrder = (id: string) => api.put(`/orders/${id}/cancel`, {});
