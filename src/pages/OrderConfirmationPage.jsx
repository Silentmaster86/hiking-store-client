import { useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { claimOrder } from "../api/orders";
import { useAuth } from "../context/auth-context";
import { useOrder } from "../hooks/useOrder";
import OrderSummary from "../components/orders/OrderSummary";
const Wrap = styled.section`
  max-width: 760px; margin: 0 auto; padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border}; background: ${({ theme }) => theme.colors.surface}; border-radius: 18px;
  a { color: ${({ theme }) => theme.colors.text}; text-underline-offset: 3px; }
  button { border: 0; border-radius: 10px; font: inherit; font-weight: 800; background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryText}; cursor: pointer; }
  button:disabled { opacity: .6; cursor: not-allowed; }
  button, a { display: inline-block; margin: 8px; padding: 10px; }
`;
export default function OrderConfirmationPage() {
  const { id } = useParams(), location = useLocation();
  const { user } = useAuth();
  const { status, order, items, error, refresh } = useOrder(id);
  const [claiming, setClaiming] = useState(false), [claimError, setClaimError] = useState("");
  async function saveOrder() {
    if (claiming) return;
    setClaiming(true); setClaimError("");
    try { await claimOrder(id); refresh(); }
    catch (error) { setClaimError(error.message || "Could not save this order."); }
    finally { setClaiming(false); }
  }
  return <Wrap>
    {status === "loading" && <><h1>Checking your order…</h1><p role="status">Loading order details.</p></>}
    {status === "error" && <><h1>We couldn’t display this order</h1><p role="alert">{error}</p><button onClick={refresh}>Try again</button><Link to="/login" state={{ from: location }}>Sign in</Link></>}
    {status === "ready" && order && <>
      <h1>Order confirmed</h1><p>Thanks! Your demo order has been placed.</p>
      <OrderSummary order={order} items={items} />
      {order.canClaim && <p>Guest access is saved in this browser for up to 7 days. Save the order to an account to keep it in your order history.</p>}
      {order.canClaim && (user ? <button disabled={claiming} onClick={saveOrder}>{claiming ? "Saving…" : "Save order to my account"}</button>
        : <Link to="/login" state={{ from: location }}>Sign in to save this order to your account</Link>)}
      {claimError && <p role="alert">{claimError}</p>}
      <Link to={`/orders/${order.id}`}>View full order details</Link>
    </>}
    <Link to="/products">Continue shopping</Link>
  </Wrap>;
}
