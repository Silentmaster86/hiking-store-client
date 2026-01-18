import styled from "styled-components";

const Wrap = styled.div`
  margin-top: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 12px;
`;

const Title = styled.div`
  font-weight: 1000;
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px 12px;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 999px;
  margin-top: 4px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ $state, theme }) => {
    if ($state === "done") return theme.colors.primary;
    if ($state === "active") return "rgba(45, 212, 191, 0.25)";
    return "transparent";
  }};
`;

const Step = styled.div`
  padding: 2px 0;
`;

const Label = styled.div`
  font-weight: 950;
`;

const Sub = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

const STEPS = [
  { key: "pending", label: "Pending", sub: "Order created" },
  { key: "paid", label: "Paid", sub: "Payment confirmed" },
  { key: "shipped", label: "Shipped", sub: "Packed & handed to courier" },
  { key: "delivered", label: "Delivered", sub: "Arrived to customer" },
];

function normalizeStatus(status) {
  const s = String(status || "pending").toLowerCase();
  return s;
}

export default function OrderStatusTimeline({ status }) {
  const current = normalizeStatus(status);

  // cancelled: traktuj jako specjalny case
  if (current === "cancelled") {
    return (
      <Wrap>
        <Title>Order status</Title>
        <Sub style={{ color: "rgba(220,38,38,0.95)", fontWeight: 900 }}>
          Cancelled
        </Sub>
      </Wrap>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === current);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <Wrap>
      <Title>Order status</Title>

      <Row>
        {STEPS.map((s, idx) => {
          let state = "todo";
          if (idx < safeIndex) state = "done";
          if (idx === safeIndex) state = "active";

          return (
            <div key={s.key} style={{ display: "contents" }}>
              <Dot $state={state} />
              <Step>
                <Label>{s.label}</Label>
                <Sub>{s.sub}</Sub>
              </Step>
            </div>
          );
        })}
      </Row>
    </Wrap>
  );
}
