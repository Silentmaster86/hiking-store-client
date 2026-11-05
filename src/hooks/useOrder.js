import { useEffect, useState } from "react";
import { getOrderById } from "../api/orders";
export function useOrder(id) {
  const [attempt, retry] = useState(0);
  const [result, setResult] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    getOrderById(id, { signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setResult({ id, attempt, status: "ready", ...data });
    }).catch((error) => {
      if (!controller.signal.aborted) setResult({ id, attempt, status: "error", error: error.status === 404
        ? "This order is unavailable in this session. Sign in to the owning account or use the browser in which you placed it."
        : "We couldn’t load this order. Please try again." });
    });
    return () => controller.abort();
  }, [id, attempt]);
  const current = result?.id === id && result?.attempt === attempt ? result : { status: "loading" };
  return { ...current, refresh: () => retry((value) => value + 1) };
}
