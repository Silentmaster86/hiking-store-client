import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "hiking_store_cart_v1";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { open: false, items: [] };
    const parsed = JSON.parse(raw);
    return {
      open: false,
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return { open: false, items: [] };
  }
}

export function CartProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  // init from localStorage
  useEffect(() => {
    const data = readStored();
    setItems(data.items);
  }, []);

  // persist items
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  }, [items]);

  const api = useMemo(() => {
    function openCart() {
      setOpen(true);
    }
    function closeCart() {
      setOpen(false);
    }
    function toggleCart() {
      setOpen((v) => !v);
    }

    function addItem(product, qty = 1) {
      const id = product.id;
      setItems((prev) => {
        const next = [...prev];
        const idx = next.findIndex((x) => x.id === id);
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        } else {
          next.unshift({
            id,
            name: product.name,
            price_cents: product.price_cents,
            quantity: qty,
          });
        }
        return next;
      });
      setOpen(true);
    }

    function setQty(id, quantity) {
      const q = Number(quantity);
      if (!Number.isFinite(q)) return;
      setItems((prev) => {
        if (q <= 0) return prev.filter((x) => x.id !== id);
        return prev.map((x) => (x.id === id ? { ...x, quantity: q } : x));
      });
    }

    function removeItem(id) {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }

    function clear() {
      setItems([]);
    }

    return {
      open,
      items,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      setQty,
      removeItem,
      clear,
    };
  }, [open, items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
