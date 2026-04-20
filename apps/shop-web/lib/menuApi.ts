import { api } from "./apiClient";

export async function fetchCategories() {
  return api.get("/shop-owner/menu/categories");
}

export async function createCategory(payload: { name: string; sort_order?: number }) {
  return api.post("/shop-owner/menu/categories", payload);
}

export async function updateCategory(id: string, payload: any) {
  return api.patch(`/shop-owner/menu/categories/${id}`, payload);
}

export async function deleteCategory(id: string) {
  return api.delete(`/shop-owner/menu/categories/${id}`);
}

export async function fetchItems() {
  return api.get("/shop-owner/menu/items");
}

export async function createItem(payload: any) {
  return api.post("/shop-owner/menu/items", payload);
}

export async function updateItem(id: string, payload: any) {
  return api.patch(`/shop-owner/menu/items/${id}`, payload);
}

export async function deleteItem(id: string) {
  return api.delete(`/shop-owner/menu/items/${id}`);
}
