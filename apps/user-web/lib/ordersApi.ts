import { api } from "./apiClient";

// 🧾 Create Order
export const createOrder = (data: any) =>
  api.post("/orders", data);

// 📦 Get My Orders
export const getMyOrders = () =>
  api.get("/orders");

// 🔍 Get Order by ID
export const getOrderById = (id: string) =>
  api.get(`/orders/${id}`);