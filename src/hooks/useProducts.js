import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
export function useProducts() {
  const [attempt, setAttempt] = useState(0), [snapshot, setSnapshot] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchProducts({ signal: controller.signal }).then((items) => {
      if (!Array.isArray(items)) throw new Error("Unexpected catalogue response");
      if (!controller.signal.aborted) setSnapshot({ attempt, items, status: "ready" });
    }).catch(() => {
      if (!controller.signal.aborted) setSnapshot({ attempt, items: [], status: "error" });
    });
    return () => controller.abort();
  }, [attempt]);
  return { ...(snapshot?.attempt === attempt ? snapshot : { items: [], status: "loading" }), retry: () => setAttempt((value) => value + 1) };
}
