import { apiGet, apiRequest } from "./http";

export function getMe() {
  return apiGet("/auth/me", { cache: "no-store" });
}

export function login({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register({ email, password, firstName, lastName }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
}

export function logout() {
  return apiRequest("/auth/logout", { method: "POST" });
}
