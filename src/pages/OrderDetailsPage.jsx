import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useOrder } from "../hooks/useOrder";
import { updateOrderStatus } from "../api/orders";
import OrderSummary from "../components/orders/OrderSummary";
import OrderStatusTimeline from "../components/orders/OrderStatusTimeline";
const Wrap = styled.section`
  max-width: 900px; margin: 0 auto; padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border}; background: ${({ theme }) => theme.colors.surface}; border-radius: 18px;
  button, a { display: inline-block; padding: 10px; margin: 8px; color: inherit; }
`;
const next = { pending: "paid", paid: "shipped", shipped: "delivered" };
export default function OrderDetailsPage() {
  const { id } = useParams();
  const { status, order, items, error, refresh } = useOrder(id);
  const [busy, setBusy] = useState(false), [failure, setFailure] = useState("");
  async function simulate() {
    if (busy || !next[order?.status]) return;
    setBusy(true); setFailure("");
    try { await updateOrderStatus(id, next[order.status]); refresh(); }
    catch (error) { setFailure(error.message); }
    finally { setBusy(false); }
  }
  return <Wrap>
    <h1>{status === "ready" ? `Order #${order.id}` : "Order details"}</h1>
    {status === "loading" && <p role="status">Loading your order…</p>}
    {status === "error" && <><p role="alert">{error}</p><button onClick={refresh}>Try again</button></>}
    {status === "ready" && order && <>
      <OrderSummary order={order} items={items} /><OrderStatusTimeline status={order.status} />
      {order.canSimulate && next[order.status] && <section><h2>Demo controls</h2><p>This simulates the next step. No real payment or shipment takes place.</p><button disabled={busy} onClick={simulate}>{busy ? "Updating…" : "Simulate next status"}</button></section>}
      {failure && <p role="alert">{failure}</p>}
    </>}
    <Link to="/orders">Back to orders</Link><Link to={`/order/${id}/confirmation`}>Order confirmation</Link>
  </Wrap>;
}
