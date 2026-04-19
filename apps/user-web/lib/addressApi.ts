import { api } from "./apiClient";

export const getMyAddresses = () => api.get("/addresses");
export const createAddress = (data: any) => api.post("/addresses", data);
export const setDefaultAddress = (id: string) =>
  api.put(`/addresses/${id}/default`, {});
