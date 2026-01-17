import { apiRequest } from "./http";

// GET /orders
export function getOrders() {
  return apiRequest("/orders", { method: "GET" });
}

// GET /orders/:id
export function getOrderById(orderId) {
  return apiRequest(`/orders/${orderId}`, { method: "GET" });
}

// POST /orders/claim  { guestToken }
export function claimOrder(guestToken) {
  return apiRequest("/orders/claim", {
    method: "POST",
    body: JSON.stringify({ guestToken }),
  });
}
