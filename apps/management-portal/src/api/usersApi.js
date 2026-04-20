import { api } from "./apiClient";

export async function getUsers() {
  return api.get("/users");
}

export async function updateUserRole(userId, role) {
  return api.patch(`/users/${userId}/role`, { role });
}
