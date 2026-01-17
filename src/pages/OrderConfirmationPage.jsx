import { useEffect, useMemo } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import styled from "styled-components";

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

function formatPrice(cents) {
  const v = (Number(cents || 0) / 100).toFixed(2);
  return `£${v}`;
}

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();

  const order = useMemo(() => location.state?.order || null, [location.state]);

  useEffect(() => {
    document.title = `Order #${id} — Confirmation`;
  }, [id]);

  return (
    <Wrap>
      <H1>Order confirmed 🎉</H1>
      <Muted>Thanks! Your order has been placed.</Muted>

      <Card>
        <Row>
          <Label>Order ID</Label>
          <Val>#{id}</Val>
        </Row>

        <Row>
          <Label>Status</Label>
          <Val>{order?.status || "pending"}</Val>
        </Row>

        <Row>
          <Label>Total</Label>
          <Val>{formatPrice(order?.total_cents)}</Val>
        </Row>

        <Btn to="/products">Continue shopping</Btn>
      </Card>
    </Wrap>
  );
}
