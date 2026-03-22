import { apiFetch } from "./apiClient";

export async function getMyAddresses() {
  return apiFetch("/addresses");
}

export async function createAddress(payload: any) {
  return apiFetch("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function setDefaultAddress(id: string) {
  return apiFetch(`/addresses/${id}/default`, {
    method: "PATCH",
  });
}
