import { apiRequest } from "./http";

// GET /cart -> { cartId, items: [...] }
export function getCart() {
  return apiRequest("/cart", { method: "GET" });
}

// POST /cart/items -> body: { productId, quantity }
export function addCartItem(productId, quantity = 1) {
  return apiRequest("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

// PATCH /cart/items/:id -> body: { quantity }
export function updateCartItem(cartItemId, quantity) {
  return apiRequest(`/cart/items/${cartItemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

// DELETE /cart/items/:id
export function removeCartItem(cartItemId) {
  return apiRequest(`/cart/items/${cartItemId}`, {
    method: "DELETE",
  });
}
