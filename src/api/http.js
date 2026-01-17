const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("Missing VITE_API_URL. Set it in Netlify / .env.local");
}

export async function apiGet(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }

  return res.json();
}
