import styled from "styled-components";
import { useCart } from "../../context/CartContext";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 50;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 180ms ease;
`;

const Panel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(420px, 92vw);
  z-index: 60;
  background: ${({ theme }) => theme.colors.surface};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  transition: transform 220ms ease;
  display: flex;
  flex-direction: column;
`;

const Head = styled.div`
  padding: 14px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.div`
  font-weight: 1000;
`;

const CloseBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  &:hover { background: rgba(255,255,255,0.06); }
`;

const List = styled.div`
  padding: 12px 14px;
  overflow: auto;
  flex: 1;
`;

const Row = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.02);
  border-radius: 16px;
  padding: 12px;
  display: grid;
  gap: 10px;
  margin-bottom: 10px;
`;

const Name = styled.div`
  font-weight: 1000;
`;

const Muted = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Qty = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const QtyBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 1000;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.06); }
`;

const QtyVal = styled.div`
  min-width: 26px;
  text-align: center;
  font-weight: 1000;
`;

const Remove = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 900;
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const Foot = styled.div`
  padding: 12px 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(0,0,0,0.12);
`;

const TotalRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

const TotalLabel = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 900;
`;

const TotalVal = styled.div`
  font-weight: 1100;
  font-size: 18px;
`;

const CTA = styled.button`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
  color: #03130f;
  border-radius: 14px;
  padding: 12px 12px;
  font-weight: 1100;
  cursor: pointer;
  &:hover { opacity: 0.92; }
`;

const Small = styled.div`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  line-height: 1.35;
`;

function formatPrice(cents) {
  const v = (Number(cents || 0) / 100).toFixed(2);
  return `£${v}`;
}

export default function CartDrawer() {
  const { open, closeCart, items, setQty, removeItem } = useCart();

  const totalCents = items.reduce(
    (sum, it) => sum + Number(it.price_cents || 0) * Number(it.quantity || 0),
    0
  );

  return (
    <>
      <Overlay $open={open} onClick={closeCart} />
      <Panel $open={open} aria-hidden={!open}>
        <Head>
          <Title>Cart</Title>
          <CloseBtn type="button" onClick={closeCart}>
            Close
          </CloseBtn>
        </Head>

        <List>
          {items.length === 0 ? (
            <Muted>Your cart is empty. Add something from Products.</Muted>
          ) : (
            items.map((it) => (
              <Row key={it.id}>
                <div>
                  <Name>{it.name}</Name>
                  <Muted>{formatPrice(it.price_cents)} each</Muted>
                </div>

                <Controls>
                  <Qty>
                    <QtyBtn type="button" onClick={() => setQty(it.id, it.quantity - 1)}>
                      −
                    </QtyBtn>
                    <QtyVal>{it.quantity}</QtyVal>
                    <QtyBtn type="button" onClick={() => setQty(it.id, it.quantity + 1)}>
                      +
                    </QtyBtn>
                  </Qty>

                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ fontWeight: 1000 }}>
                      {formatPrice(it.price_cents * it.quantity)}
                    </div>
                    <Remove type="button" onClick={() => removeItem(it.id)}>
                      Remove
                    </Remove>
                  </div>
                </Controls>
              </Row>
            ))
          )}
        </List>

        <Foot>
          <TotalRow>
            <TotalLabel>Total</TotalLabel>
            <TotalVal>{formatPrice(totalCents)}</TotalVal>
          </TotalRow>

          <CTA
            type="button"
            onClick={() => alert("Next step: connect /checkout and /payments")}
            disabled={items.length === 0}
            style={{ opacity: items.length === 0 ? 0.6 : 1, cursor: items.length === 0 ? "not-allowed" : "pointer" }}
          >
            Checkout
          </CTA>

          <Small>
            Na razie to guest cart (localStorage). Za chwilę podepniemy to pod Twoje endpointy:
            <b> /cart</b> + <b>/checkout</b>.
          </Small>
        </Foot>
      </Panel>
    </>
  );
}
