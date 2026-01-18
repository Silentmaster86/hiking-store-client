import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { getOrderById } from "../api/orders";
import { useAuth } from "../context/AuthContext.jsx";

const Wrap = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 12px 0;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 14px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const H1 = styled.h1`
  margin: 0 0 6px;
  font-size: 28px;
  letter-spacing: -0.5px;
`;

const Muted = styled.p`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  &:first-child {
    border-top: 0;
    padding-top: 0;
  }
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 900;
`;

const Val = styled.div`
  font-weight: 1000;
`;

const Btn = styled(Link)`
  display: inline-flex;
  margin-top: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 1000;
  text-decoration: none;
  &:hover { background: rgba(255,255,255,0.06); }
`;

const ErrorBox = styled.div`
  margin-top: 10px;
  border: 1px solid rgba(220, 38, 38, 0.4);
  background: rgba(220, 38, 38, 0.08);
  color: rgba(220, 38, 38, 0.95);
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 800;
`;

function formatPrice(cents) {
  const v = (Number(cents || 0) / 100).toFixed(2);
  return `£${v}`;
}

export default function OrderConfirmationPage() {
  const { id } = useParams();

  const location = useLocation();
  const { user } = useAuth();
  const [order, setOrder] = useState(location.state?.order || null);
  const [status, setStatus] = useState(order ? "ready" : "loading"); // loading | ready | error
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Order #${id} — Confirmation`;
  }, [id]);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (order) return;

      setStatus("loading");
      setError("");

      try {
        const data = await getOrderById(id);
        const fetched = data?.order ?? data;

        if (!alive) return;
        setOrder(fetched);
        setStatus("ready");
      } catch (err) {
        if (!alive) return;
        setError(
          err?.message === "Failed to fetch"
            ? "Cannot connect to the server. Please try again."
            : err?.message || "Cannot load order."
        );
        setStatus("error");
      }
    }

    load();
    return () => { alive = false; };
  }, [id, order]);

  return (
    <Wrap>
      <H1>Order confirmed 🎉</H1>
      <Muted>Thanks! Your order has been placed.</Muted>

      <Card>
        {status === "loading" && <Muted>Loading order…</Muted>}
        {status === "error" && <ErrorBox>{error}</ErrorBox>}

        {status === "ready" && order && (
          <>
            <Row>
              <Label>Order ID</Label>
              <Val>#{order.id}</Val>
            </Row>

            <Row>
              <Label>Status</Label>
              <Val>{order.status}</Val>
            </Row>

            <Row>
              <Label>Total</Label>
              <Val>{formatPrice(order.total_cents)}</Val>
            </Row>

            {user ? (
              <Btn to={`/orders/${order.id}`}>View full order details</Btn>
            ) : (
            <Btn to={`/orders/${order.id}`}>Sign in to view full order details</Btn>
            )}

            <Btn to="/products">Continue shopping</Btn>  
          </>
        )}
      </Card>
    </Wrap>
  );
}
