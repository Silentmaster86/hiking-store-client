import { useEffect, useMemo, useState } from "react";
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
    background: rgba(255, 255, 255, 0.03);
  }
`;

const Left = styled.div`
  display: grid;
  gap: 6px;
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
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.muted};
  width: fit-content;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $tone }) => {
    if ($tone === "success") return "rgba(34,197,94,0.95)"; // green
    if ($tone === "info") return "rgba(59,130,246,0.95)"; // blue
    if ($tone === "warn") return "rgba(245,158,11,0.95)"; // amber
    if ($tone === "purple") return "rgba(168,85,247,0.95)"; // purple
    if ($tone === "danger") return "rgba(220,38,38,0.95)"; // red
    return "rgba(148,163,184,0.9)"; // gray
  }};
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

function statusMeta(status) {
  const s = String(status || "pending").toLowerCase();

  if (s === "delivered") return { label: "Delivered", tone: "success" };
  if (s === "shipped") return { label: "Shipped", tone: "purple" };
  if (s === "paid") return { label: "Paid", tone: "info" };
  if (s === "pending") return { label: "Pending", tone: "warn" };
  if (s === "cancelled") return { label: "Cancelled", tone: "danger" };

  return { label: s || "-", tone: "neutral" };
}

function StatusBadge({ status }) {
  const m = statusMeta(status);
  return (
    <Badge title={`Status: ${m.label}`}>
      <Dot $tone={m.tone} />
      {m.label}
    </Badge>
  );
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
        const lower = String(msg).toLowerCase();

        if (lower.includes("unauthorized") || lower.includes(" 401") || lower.includes("401 ")) {
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

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [orders]);

  return (
    <Wrap>
      <H1>Your orders</H1>
      <Sub>Available after login. If you checked out as a guest, you can claim an order later.</Sub>

      <Card>
        {status === "error" && (
          <ErrorBox>
            {error}
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/products" style={{ color: "inherit", textDecoration: "underline", fontWeight: 900 }}>
                Go to Products
              </Link>
            </div>
          </ErrorBox>
        )}

        {status === "loading" && <Muted>Loading…</Muted>}

        {status === "done" && sortedOrders.length === 0 && <Muted>No orders yet.</Muted>}

        {status === "done" &&
          sortedOrders.map((o) => (
            <Row key={o.id} to={`/orders/${o.id}`}>
              <Left>
                <Title>Order #{o.id}</Title>
                <StatusBadge status={o.status} />
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
