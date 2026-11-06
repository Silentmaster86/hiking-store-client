import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { useAuth } from "../context/auth-context";
import { createCheckout, getCheckoutAttempt } from "../api/checkout";
import { checkoutPayload, validateCheckout, localFieldErrors } from "../validation/checkout";
import { money } from "../utils/orderFormatting";
const Wrap = styled.section`
  max-width: 760px; margin: 0 auto;
  form { border: 1px solid ${({ theme }) => theme.colors.border}; background: ${({ theme }) => theme.colors.surface}; border-radius: 18px; padding: 18px; }
  fieldset { padding: 0; margin: 0; border: 0; }
  .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  label { display: grid; gap: 6px; font-weight: 700; }
  input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid ${({ theme }) => theme.colors.border}; background: rgba(0,0,0,.2); color: inherit; font-size: 16px; }
  [aria-invalid="true"] { border-color: #fca5a5; }
  .error { color: #fca5a5; font-size: 14px; }
  button { padding: 12px 16px; margin-top: 14px; border: 0; border-radius: 10px; background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryText}; cursor: pointer; font-weight: 800; }
  button:disabled { opacity: .6; cursor: not-allowed; }
  @media(max-width: 600px) { .fields { grid-template-columns: 1fr; } }
`;
const fields = [
  ["email", "Email", "email", "email", 254], ["firstName", "First name", "text", "given-name", 80],
  ["lastName", "Last name", "text", "family-name", 80], ["address1", "Address line 1", "text", "address-line1", 200],
  ["address2", "Address line 2 (optional)", "text", "address-line2", 200], ["city", "Town or city", "text", "address-level2", 200],
  ["postcode", "Postcode", "text", "postal-code", 12],
];
export default function CheckoutPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { items, totalCents, refresh, status: cartStatus, error: cartError } = useCart();
  const [form, setForm] = useState(() => ({ email: user?.email || "", firstName: user?.firstName || "", lastName: user?.lastName || "", address1: "", address2: "", city: "", postcode: "", country: "GB" }));
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const key = useRef(null);
  const storageKey = `checkout-attempt:${user?.id || "guest"}`;
  useEffect(() => {
    let pending;
    try { pending = sessionStorage.getItem(storageKey); } catch { return; }
    if (!pending) return;
    const controller = new AbortController();
    getCheckoutAttempt(pending, { signal: controller.signal }).then((data) => {
      if (controller.signal.aborted || !data?.order?.id) return;
      try { sessionStorage.removeItem(storageKey); } catch { /* Storage can be disabled. */ }
      nav(`/order/${data.order.id}/confirmation`, { replace: true });
      void refresh();
    }).catch(() => { /* An unfinished attempt remains available for a safe retry. */ });
    return () => controller.abort();
  }, [storageKey, nav, refresh]);
  const canSubmit = cartStatus === "done" && items.length > 0 && !submitting;
  function attemptKey() {
    if (!key.current) {
      try { key.current = sessionStorage.getItem(`checkout-attempt:${user?.id || "guest"}`); } catch { /* Storage can be disabled. */ }
      key.current ||= crypto.randomUUID();
      try { sessionStorage.setItem(`checkout-attempt:${user?.id || "guest"}`, key.current); } catch { /* In-memory retry still works. */ }
    }
    return key.current;
  }
  function forgetAttempt() {
    try { sessionStorage.removeItem(`checkout-attempt:${user?.id || "guest"}`); } catch { /* Storage can be disabled. */ }
    key.current = null;
  }
  function focusError(next) { document.getElementById(Object.keys(next)[0])?.focus(); }
  async function onSubmit(event) {
    event.preventDefault();
    if (busy.current || !canSubmit) return;
    const next = validateCheckout(form);
    setErrors(next); setError("");
    if (Object.keys(next).length) { focusError(next); return; }
    busy.current = true; setSubmitting(true);
    try {
      const data = await createCheckout(checkoutPayload(form), attemptKey());
      if (!data?.order?.id) throw new Error("The order response was incomplete. Retry this checkout attempt.");
      forgetAttempt();
      nav(`/order/${data.order.id}/confirmation`, { replace: true });
      void refresh();
    } catch (err) {
      if (err.code === "IDEMPOTENCY_CONFLICT" && err.orderId) {
        forgetAttempt();
        nav(`/order/${err.orderId}/confirmation`, { replace: true });
        void refresh();
        return;
      }
      const next = localFieldErrors(err.fieldErrors);
      setErrors(next);
      setError(["NETWORK_ERROR", "REQUEST_TIMEOUT"].includes(err.code) || err.message === "Failed to fetch" ? "We couldn’t confirm the result. Retry to safely check the same order attempt." : err.message || "Checkout failed. Please try again.");
      focusError(next);
      // Validation failures occur before an order is created.
      if (err.status === 422) forgetAttempt();
    } finally { busy.current = false; setSubmitting(false); }
  }
  return <Wrap>
    <h1>Checkout</h1><p>Portfolio demo — no payments are taken and no goods are shipped. Use test details.</p>
    {cartStatus === "loading" && <p role="status">Loading your cart…</p>}
    {cartError && <p role="alert">{cartError} <button onClick={refresh}>Refresh cart</button></p>}
    {cartStatus === "done" && items.length === 0 && <p>Your cart is empty. <Link to="/products">Browse the shop</Link>.</p>}
    {items.length > 0 && <><ul>{items.map((item) => <li key={item.cart_item_id}>{item.name} × {item.quantity} — {money(item.price_cents * item.quantity)}</li>)}</ul>
      <p>Items: {items.reduce((sum, item) => sum + item.quantity, 0)} · Subtotal: {money(totalCents)} · Delivery: Free (demo) · <strong>Total: {money(totalCents)}</strong></p></>}
    <form noValidate onSubmit={onSubmit}>
      {error && <p role="alert" className="error">{error}</p>}
      <fieldset disabled={submitting || cartStatus !== "done" || !items.length}>
        <div className="fields">{fields.map(([name, label, type, autoComplete, maxLength]) => <label key={name} htmlFor={name}>{label}
          <input id={name} name={name} type={type} required={name !== "address2"} autoComplete={autoComplete} maxLength={maxLength}
            value={form[name]} onChange={(event) => setForm((previous) => ({ ...previous, [name]: event.target.value }))}
            aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} />
          {errors[name] && <span className="error" id={`${name}-error`}>{errors[name]}</span>}
        </label>)}</div>
        <p>Country: United Kingdom</p>
        {errors.country && <p className="error">{errors.country}</p>}
        <button type="submit" disabled={!canSubmit}>{submitting ? "Placing order…" : "Place demo order"}</button>
      </fieldset>
    </form>
  </Wrap>;
}
