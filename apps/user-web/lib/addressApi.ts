import { api } from "./apiClient";

// 📍 Get addresses
export const getAddresses = () =>
  api.get("/address");

// ➕ Add address
export const createAddress = (data: any) =>
  api.post("/address", data);