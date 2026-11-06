import { Link } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/cart-context";

const Card = styled.section`
  max-width: 760px;
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  li { margin: 16px 0; }
  button { margin: 4px; padding: 8px 12px; cursor: pointer; }
  a { color: inherit; }
  a.primary { display: inline-block; padding: 12px 16px; border-radius: 10px; background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryText}; font-weight: 800; text-decoration: none; }
`;
const money = (cents) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(cents / 100);

export default function CartPage() {
  const { items, notice, maxQuantity, totalCents, status, error, refresh, setQty, removeItem } = useCart();
  const busy = status === "loading" || status === "saving";
  return (
    <Card aria-busy={busy}>
      <h1>Your cart</h1>
      {notice && <p role="status">{notice}</p>}
      {error && <div role="alert">{error}<button onClick={refresh}>Refresh cart</button></div>}
      {busy && <p role="status">Updating your cart…</p>}
      {!busy && !error && items.length === 0 && <p>Your cart is empty. <Link to="/products">Browse the shop</Link>.</p>}
      <ul>{items.map((item) => (
        <li key={item.cart_item_id}>
          <strong>{item.name}</strong> — {money(item.price_cents)} each
          <div>
            <button disabled={busy} aria-label={`Decrease quantity of ${item.name}`} onClick={() => setQty(item.cart_item_id, item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button disabled={busy || item.quantity >= maxQuantity} aria-label={`Increase quantity of ${item.name}`} onClick={() => setQty(item.cart_item_id, item.quantity + 1)}>+</button>
            <button disabled={busy} onClick={() => removeItem(item.cart_item_id)}>Remove</button>
          </div>
          <p>{money(item.price_cents * item.quantity)}</p>
        </li>
      ))}</ul>
      <p><strong>Total: {money(totalCents)}</strong></p>
      {items.length > 0 && !busy && !error && <Link className="primary" to="/checkout">Continue to checkout</Link>}
    </Card>
  );
}
