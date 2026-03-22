import { apiFetch } from "./apiClient";

export async function fetchCategories() {
  return apiFetch("/shop-owner/menu/categories");
}

export async function createCategory(payload: { name: string; sort_order?: number }) {
  return apiFetch("/shop-owner/menu/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(id: string, payload: any) {
  return apiFetch(`/shop-owner/menu/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: string) {
  return apiFetch(`/shop-owner/menu/categories/${id}`, {
    method: "DELETE",
  });
}

export async function fetchItems() {
  return apiFetch("/shop-owner/menu/items");
}

export async function createItem(payload: any) {
  return apiFetch("/shop-owner/menu/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateItem(id: string, payload: any) {
  return apiFetch(`/shop-owner/menu/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteItem(id: string) {
  return apiFetch(`/shop-owner/menu/items/${id}`, {
    method: "DELETE",
  });
}
