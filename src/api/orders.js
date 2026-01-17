// src/api/orders.js
const BASE = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
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

// GET /orders
export function getOrders() {
  return request("/orders");
}

// GET /orders/:id
export function getOrderById(orderId) {
  return request(`/orders/${orderId}`);
}

// POST /checkout  (jeśli Twój backend tak ma)
// body np: { email, address, ... } – zależy jak zrobiłeś backend
export function checkout(payload) {
  return request("/checkout", {
    method: "POST",
    body: payload,
  });
}

