// src/api/checkout.js
import { apiRequest } from "./http";

export function createCheckout(payload) {
  return apiRequest("/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
