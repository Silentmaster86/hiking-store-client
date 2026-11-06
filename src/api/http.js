const API_URL = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const { timeoutMs = 15000, signal, ...requestOptions } = options;
  const controller = new AbortController();
  let timedOut = false;
  const forwardAbort = () => controller.abort(signal.reason);
  if (signal?.aborted) forwardAbort();
  else signal?.addEventListener("abort", forwardAbort, { once: true });
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...requestOptions,
    signal: controller.signal,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(!["GET", "HEAD", "OPTIONS"].includes((options.method || "GET").toUpperCase()) ? { "X-Store-Request": "1" } : {}),
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
    error.orderId = data?.orderId;
    throw error;
  }
  return data;
  } catch (error) {
    if (timedOut) throw Object.assign(new Error("The server is taking too long to respond. Please try again."), { code: "REQUEST_TIMEOUT" });
    if (signal?.aborted) throw error;
    if (error instanceof TypeError) throw Object.assign(new Error("Could not connect to the server. Check your connection and try again."), { code: "NETWORK_ERROR" });
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", forwardAbort);
  }
}

export function apiGet(path, options = {}) {
  return apiRequest(path, { ...options, method: "GET" });
}
