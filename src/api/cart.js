// src/api/cart.js
const BASE = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token"); // jeśli masz auth
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// GET /cart
export function getCart() {
  return request("/cart");
}

// POST /cart/items  { productId, qty }
export function addCartItem(productId, qty = 1) {
  return request("/cart/items", {
    method: "POST",
    body: { productId, qty },
  });
}

// PATCH /cart/items/:id  { qty }
export function updateCartItem(itemId, qty) {
  return request(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: { qty },
  });
}

// DELETE /cart/items/:id
export function removeCartItem(itemId) {
  return request(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

// (opcjonalnie) DELETE /cart
export function clearCart() {
  return request("/cart", { method: "DELETE" });
}

