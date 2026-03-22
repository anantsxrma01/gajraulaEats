import { apiFetch } from "./apiClient";

export async function placeOrder(payload: {
  shop_id: string;
  address_id: string;
  items: { item_id: string; qty: number }[];
  payment_mode?: "COD" | "ONLINE";
}) {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrderDetail(id: string) {
  return apiFetch(`/orders/${id}`);
}