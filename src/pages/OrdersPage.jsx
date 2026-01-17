import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getOrders } from "../api/orders";

const Wrap = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 12px 0;
`;

const H1 = styled.h1`
  margin: 0 0 6px;
  font-size: 28px;
  letter-spacing: -0.5px;
`;

const Sub = styled.p`
  margin: 0 0 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 14px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Row = styled(Link)`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background: rgba(255,255,255,0.03);
  }
`;

const Left = styled.div`
  display: grid;
  gap: 4px;
`;

const Right = styled.div`
  text-align: right;
  display: grid;
  gap: 4px;
`;

const Title = styled.div`
  font-weight: 1000;
`;

const Muted = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  color: ${({ theme }) => theme.colors.muted};
  width: fit-content;
`;

const ErrorBox = styled.div`
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

function formatDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}

function prettyStatus(s) {
  const v = String(s || "").toLowerCase();
  if (v === "paid") return "Paid";
  if (v === "pending") return "Pending";
  if (v === "cancelled") return "Cancelled";
  return s || "-";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("idle"); // loading | error | done
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Orders — Hiking Store";
  }, []);

  useEffect(() => {
    let active = true;

      async function load() {
          setStatus("loading");
          setError("");
          try {
              const data = await getOrders(); // { orders: [...] }
              if (!active) return;
              setOrders(Array.isArray(data?.orders) ? data.orders : []);
              setStatus("done");
          } catch (e) {
              if (!active) return;

              let msg = e?.message || "Failed to load orders.";

              if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
                  msg = "You must be signed in to view your orders.";
              } else if (msg === "Failed to fetch") {
                  msg = "Cannot connect to the server. Please try again.";
              }
      
              setError(msg);
              setStatus("error");
          }
      }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Wrap>
      <H1>Your orders</H1>
      <Sub>Available after login. If you checked out as a guest, you can claim an order later.</Sub>

      <Card>
        {status === "error" && (
          <ErrorBox>
            {error}
            {error.includes("signed in") && (
              <div style={{ marginTop: 8, opacity: 0.9 }}>
                Tip: go to <b>Account</b> and log in, then come back here.
              </div>
            )}
          </ErrorBox>
        )}


        {status === "loading" && <Muted>Loading…</Muted>}

        {status === "done" && orders.length === 0 && (
          <Muted>No orders yet.</Muted>
        )}

        {status === "done" &&
          orders.map((o) => (
            <Row key={o.id} to={`/orders/${o.id}`}>
              <Left>
                <Title>Order #{o.id}</Title>
                <Badge>{prettyStatus(o.status)}</Badge>
              </Left>

              <Right>
                <Title>{formatPrice(o.total_cents)}</Title>
                <Muted>{formatDate(o.created_at)}</Muted>
              </Right>
            </Row>
          ))}
      </Card>
    </Wrap>
  );
}
