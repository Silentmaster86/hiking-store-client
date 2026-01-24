import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../api/orders";
import OrderStatusTimeline from "../components/orders/OrderStatusTimeline";
import { SkeletonLine, SkeletonBlock } from "../components/ui/Skeletons";

const Wrap = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 12px 0;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
  margin-bottom: 12px;
`;

const H1 = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.5px;
`;

const Back = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 1000;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 12px;
  border-radius: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 14px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 900;
`;

const Val = styled.div`
  font-weight: 1000;
`;

const Table = styled.div`
  margin-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Line = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Muted = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

const ErrorBox = styled.div`
  border: 1px solid rgba(220, 38, 38, 0.4);
  background: rgba(220, 38, 38, 0.08);
  color: rgba(220, 38, 38, 0.95);
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 800;
`;

const GhostBtn = styled.button`
  margin-top: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 1000;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function formatPrice(cents) {
  const v = (Number(cents || 0) / 100).toFixed(2);
  return `£${v}`;
}

function formatDateTime(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB");
  } catch {
    return iso;
  }
}

const STATUS_FLOW = ["pending", "paid", "shipped", "delivered"];

function nextStatus(current) {
  const s = String(current || "pending").toLowerCase();
  const idx = STATUS_FLOW.indexOf(s);
  if (idx === -1) return "pending";
  return STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
}

function DetailsSkeleton() {
  return (
    <>
      <div style={{ display: "grid", gap: 10, paddingTop: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <SkeletonLine $h="12px" $w="20%" />
          <SkeletonLine $h="12px" $w="30%" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <SkeletonLine $h="12px" $w="20%" />
          <SkeletonLine $h="12px" $w="25%" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <SkeletonLine $h="12px" $w="20%" />
          <SkeletonLine $h="12px" $w="40%" />
        </div>

        <div style={{ marginTop: 8 }}>
          <SkeletonBlock $h="56px" $w="100%" $radius="14px" />
        </div>

        <SkeletonBlock $h="40px" $w="170px" $radius="14px" />
      </div>

      <div style={{ marginTop: 14 }}>
        <SkeletonLine $h="12px" $w="18%" />
        <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "grid", gap: 8 }}>
                <SkeletonLine $h="12px" $w="70%" />
                <SkeletonLine $h="10px" $w="45%" />
              </div>
              <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                <SkeletonLine $h="12px" $w="60px" />
                <SkeletonLine $h="10px" $w="30px" />
              </div>
              <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                <SkeletonLine $h="12px" $w="35px" />
                <SkeletonLine $h="10px" $w="60px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Order #${id} — Hiking Store`;
  }, [id]);

  useEffect(() => {
    let active = true;

    async function load() {
      setStatus("loading");
      setError("");
      try {
        const data = await getOrderById(id); // { order, items }
        if (!active) return;
        setOrder(data?.order || null);
        setItems(Array.isArray(data?.items) ? data.items : []);
        setStatus("done");
      } catch (e) {
        if (!active) return;

        let msg = e?.message || "Failed to load order.";
        const lower = String(msg).toLowerCase();

        if (lower.includes("unauthorized") || lower.includes(" 401") || lower.includes("401 ")) {
          msg = "You must be signed in to view this order.";
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
  }, [id]);

  async function handleAdvanceStatus() {
    if (!order) return;

    try {
      setStatus("loading");
      setError("");

      const newStatus = nextStatus(order.status);
      const data = await updateOrderStatus(order.id, newStatus);

      setOrder(data?.order || order);
      setStatus("done");
    } catch (e) {
      let msg = e?.message || "Could not update status.";
      const lower = String(msg).toLowerCase();

      if (lower.includes("unauthorized") || lower.includes(" 401") || lower.includes("401 ")) {
        msg = "You must be signed in to update order status.";
      } else if (msg === "Failed to fetch") {
        msg = "Cannot connect to the server. Please try again.";
      }

      setError(msg);
      setStatus("error");
    }
  }

  const isBusy = status === "loading";
  const isDelivered = String(order?.status || "").toLowerCase() === "delivered";

  return (
    <Wrap>
      <Top>
        <H1>Order #{id}</H1>
        <Back to="/orders">Back</Back>
      </Top>

      <Card>
        {status === "error" && <ErrorBox>{error}</ErrorBox>}
        {status === "loading" && <DetailsSkeleton />}

        {status === "done" && !order && <Muted>Order not found.</Muted>}

        {status === "done" && order && (
          <>
            <Row>
              <Label>Status</Label>
              <Val>{order.status}</Val>
            </Row>

            <Row>
              <Label>Total</Label>
              <Val>{formatPrice(order.total_cents)}</Val>
            </Row>

            <Row>
              <Label>Created</Label>
              <Val>{formatDateTime(order.created_at)}</Val>
            </Row>

            <OrderStatusTimeline status={order.status} />

            <GhostBtn
              type="button"
              onClick={handleAdvanceStatus}
              disabled={isBusy || isDelivered}
              title={isDelivered ? "Order already delivered" : "Move to next status"}
            >
              {isDelivered ? "Delivered" : isBusy ? "Updating…" : "Advance status"}
            </GhostBtn>

            <Table>
              <Muted style={{ marginTop: 10, marginBottom: 6, fontWeight: 900 }}>Items</Muted>

              {items.map((it, idx) => (
                <Line key={`${it.product_id}-${idx}`}>
                  <div>
                    <div style={{ fontWeight: 1000 }}>{it.name}</div>
                    <Muted>Product ID: {it.product_id}</Muted>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 1000 }}>{formatPrice(it.price_cents)}</div>
                    <Muted>each</Muted>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 1000 }}>x{it.quantity}</div>
                    <Muted>{formatPrice(it.line_total_cents)}</Muted>
                  </div>
                </Line>
              ))}
            </Table>
          </>
        )}
      </Card>
    </Wrap>
  );
}
