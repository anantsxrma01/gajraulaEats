import { api } from "./apiClient";

export async function getDashboardStats() {
  return api.get("/admin/stats/overview");
}
