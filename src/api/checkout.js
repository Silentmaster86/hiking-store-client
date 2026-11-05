import { apiRequest } from "./http";
export function createCheckout(payload, key) {
  return apiRequest("/checkout", { method: "POST", headers: { "Idempotency-Key": key }, body: JSON.stringify(payload) });
}

export function getCheckoutAttempt(key, options = {}) {
  return apiRequest(`/checkout/attempt/${encodeURIComponent(key)}`, { ...options, method: "GET" });
}
