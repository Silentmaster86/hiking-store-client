// src/api/http.js
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("Missing VITE_API_URL. Set it in Netlify / .env.local");
}

async function parseResponse(res) {
  const text = await res.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });

  if (!res.ok) {
    const data = await parseResponse(res);
    const msg =
      (data && (data.error || data.message)) ||
      `${options.method || "GET"} ${path} failed: ${res.status}`;
    throw new Error(msg);
  }

  return parseResponse(res);
}

// zostawiamy, żeby reszta app dalej działała
export async function apiGet(path, options = {}) {
  return apiRequest(path, { method: "GET", ...options });
}
