const API_URL = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); }
    catch { if (res.ok) throw new Error("The server returned an unexpected response."); }
  }
  if (!res.ok) {
    const error = new Error(res.status === 401 ? "Unauthorized"
      : data?.error || data?.message || "The request could not be completed. Please try again.");
    error.status = res.status;
    error.code = data?.code;
    error.fieldErrors = data?.fieldErrors;
    throw error;
  }
  return data;
}

export function apiGet(path, options = {}) {
  return apiRequest(path, { ...options, method: "GET" });
}
