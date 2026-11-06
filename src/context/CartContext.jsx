import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCart, addCartItem, updateCartItem, removeCartItem } from "../api/cart";
import { CartContext } from "./cart-context";
import { useAuth } from "./auth-context";

export function CartProvider({ children }) {
  const { user, status } = useAuth();
  return <SessionCart key={user?.id ?? "guest"} ready={status === "ready"}>{children}</SessionCart>;
}

function SessionCart({ ready, children }) {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState({ cartId: null, items: [], notice: null, maxQuantity: 99 });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const writing = useRef(false);
  const alive = useRef(true);
  const revision = useRef(0);
  const needsRefresh = useRef(false);

  const applyCart = useCallback((data) => {
    setCart({ cartId: data?.cartId ?? null, items: Array.isArray(data?.items) ? data.items : [], notice: data?.notice || null, maxQuantity: data?.maxQuantity || 99 });
    setStatus("done");
    setError("");
    needsRefresh.current = false;
  }, []);

  useEffect(() => {
    alive.current = true;
    if (ready) {
      const version = ++revision.current;
      getCart().then((data) => {
        if (alive.current && version === revision.current) applyCart(data);
      }).catch(() => {
        if (!alive.current || version !== revision.current) return;
        setStatus("error");
        setError("Could not load your cart. Please try again.");
      });
    }
    return () => { alive.current = false; };
  }, [ready, applyCart]);

  const refresh = useCallback(async () => {
    if (!ready || writing.current) return false;
    const version = ++revision.current;
    setStatus("loading");
    setError("");
    try {
      const data = await getCart();
      if (alive.current && version === revision.current) applyCart(data);
      return true;
    } catch {
      if (alive.current && version === revision.current) {
        setStatus("error");
        setError("Could not load your cart. Please try again.");
      }
      return false;
    }
  }, [ready, applyCart]);

  const mutate = useCallback(async (operation) => {
    if (!ready || writing.current || needsRefresh.current) return false;
    writing.current = true;
    ++revision.current;
    setStatus("saving");
    setError("");
    let saved = false;
    try {
      await operation();
      saved = true;
      const data = await getCart();
      if (alive.current) applyCart(data);
      return true;
    } catch {
      if (alive.current) {
        needsRefresh.current = true;
        setStatus("error");
        setError(saved
          ? "Your change was saved, but the cart could not be refreshed. Refresh the cart before trying again."
          : "We couldn’t update your cart. Refresh your cart and try again.");
      }
      return false;
    } finally {
      writing.current = false;
    }
  }, [ready, applyCart]);

  const addItem = useCallback(async (product, quantity = 1) => {
    const success = await mutate(() => addCartItem(product.id, quantity));
    if (alive.current) setOpen(true);
    return success;
  }, [mutate]);
  const setQty = useCallback((id, quantity) => {
    const value = Number(quantity);
    if (!Number.isInteger(value) || value < 0 || value > 99) return Promise.resolve(false);
    return mutate(() => value === 0 ? removeCartItem(id) : updateCartItem(id, value));
  }, [mutate]);
  const removeItem = useCallback((id) => mutate(() => removeCartItem(id)), [mutate]);
  const value = useMemo(() => ({
    ...cart, open, status: ready ? status : "loading", error, refresh, addItem, setQty, removeItem,
    totalCents: cart.items.reduce((sum, item) => sum + Number(item.price_cents) * Number(item.quantity), 0),
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    toggleCart: () => setOpen((previous) => !previous),
  }), [cart, open, status, error, refresh, addItem, setQty, removeItem, ready]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
