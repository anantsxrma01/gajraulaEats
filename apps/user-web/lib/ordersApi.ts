import { api } from "./apiClient";

export const getMyOrders = () => api.get("/orders/my");
export const placeOrder = (payload: any) => api.post("/orders", payload);
export const getOrderById = (id: string) => api.get(`/orders/${id}`);
