// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { getCart, addCartItem, updateCartItem, removeCartItem } from "../api/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState("");

  // ✅ stable function => no infinite refresh loop
  const refresh = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const data = await getCart();
      setCartId(data?.cartId ?? null);
      setItems(Array.isArray(data?.items) ? data.items : []);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e.message || "Failed to load cart");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => {
    function openCart() {
      setOpen(true);
    }
    function closeCart() {
      setOpen(false);
    }
    function toggleCart() {
      setOpen((v) => !v);
    }

    async function addItem(product, quantity = 1) {
      await addCartItem(product.id, quantity);
      await refresh();
      setOpen(true);
    }

    // id = cart_item_id
    async function setQty(cartItemId, quantity) {
      const q = Number(quantity);
      if (!Number.isFinite(q)) return;

      if (q <= 0) {
        await removeCartItem(cartItemId);
      } else {
        await updateCartItem(cartItemId, q);
      }
      await refresh();
    }

    async function removeItem(cartItemId) {
      await removeCartItem(cartItemId);
      await refresh();
    }

    const totalCents = items.reduce(
      (sum, it) => sum + Number(it.price_cents || 0) * Number(it.quantity || 0),
      0
    );

    return {
      open,
      cartId,
      items,
      status,
      error,
      totalCents,
      openCart,
      closeCart,
      toggleCart,
      refresh,
      addItem,
      setQty,
      removeItem,
    };
  }, [open, cartId, items, status, error, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
