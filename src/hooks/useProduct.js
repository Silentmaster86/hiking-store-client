import { useEffect, useState } from "react";
import { fetchProduct } from "../api/products";
export function useProduct(id) {
  const [attempt, setAttempt] = useState(0), [snapshot, setSnapshot] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchProduct(id, { signal: controller.signal }).then(item => {
      if (!item?.id) throw new Error("Unexpected product response");
      if (!controller.signal.aborted) setSnapshot({ id, attempt, item, status: "ready" });
    }).catch(error => {
      if (!controller.signal.aborted) setSnapshot({ id, attempt, status: error.status === 404 || error.status === 400 ? "missing" : "error" });
    });
    return () => controller.abort();
  }, [id, attempt]);
  return { ...(snapshot?.id === id && snapshot?.attempt === attempt ? snapshot : { status: "loading" }), retry: () => setAttempt(value => value + 1) };
}
