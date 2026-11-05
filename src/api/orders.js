import { apiRequest } from "./http";

// GET /orders
export function getOrders() {
  return apiRequest("/orders", { method: "GET" });
}

// GET /orders/:id
export function getOrderById(orderId, options = {}) {
  return apiRequest(`/orders/${orderId}`, { ...options, method: "GET" });
}

// Save an order authorized by this browser session to the signed-in account.
export function claimOrder(orderId) {
  return apiRequest(`/orders/${orderId}/claim`, { method: "POST" });
}

// PATCH /orders/:id/status  { status }
export function updateOrderStatus(orderId, status) {
  return apiRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

