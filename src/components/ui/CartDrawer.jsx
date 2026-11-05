import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/auth-context";
import { useModalDialog, closeOnBackdrop } from "../../hooks/useModalDialog";
import { useCart } from "../../context/cart-context";
import { SkeletonLine, SkeletonBlock } from "./Skeletons";

const Panel = styled.dialog`
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  max-height: none;
  max-width: none;
  margin: 0 0 0 auto;
  padding: 0;
  border: 0;
  color: inherit;
  &::backdrop { background: rgba(0,0,0,0.65); }

  width: min(420px, 92vw);

  @media (max-width: 520px) {
    width: min(340px, 88vw);
  }

  @media (max-width: 480px) {
    width: min(340px, 88vw);
  }

  z-index: 60;
  background: ${({ theme }) => theme.colors.surface};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  transition: transform 220ms ease;
  display: none;
  &[open] { display: flex; }
  flex-direction: column;
  backdrop-filter: blur(12px);

  @media (max-width: 380px) {
    width: min(320px, 90vw);
  }
`;

const Head = styled.div`
  padding: 12px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.div`
  font-weight: 1000;
  display: flex;
  gap: 10px;
  align-items: baseline;
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 10px;
  border-radius: 999px;
`;

const CloseBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const List = styled.div`
  padding: 10px 12px;
  overflow: auto;
  flex: 1;
`;

const Row = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.02);
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

const ErrorBox = styled.div`
  border: 1px solid rgba(220, 38, 38, 0.4);
  background: rgba(220, 38, 38, 0.08);
  color: ${({ theme }) => theme.colors.danger};
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 1000;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
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
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Foot = styled.div`
  padding: 10px 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(0, 0, 0, 0.12);
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
  &:hover {
    opacity: 0.92;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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

function CartSkeleton() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "64px 1fr",
            gap: 12,
            padding: "10px 0",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SkeletonBlock $h="56px" $w="64px" $radius="12px" />
          <div style={{ display: "grid", gap: 8 }}>
            <SkeletonLine $h="12px" $w="70%" />
            <SkeletonLine $h="10px" $w="45%" />
            <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
              <SkeletonBlock $h="28px" $w="90px" $radius="12px" />
              <SkeletonBlock $h="28px" $w="70px" $radius="12px" />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <SkeletonLine $h="12px" $w="30%" />
          <SkeletonLine $h="12px" $w="22%" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <SkeletonLine $h="12px" $w="38%" />
          <SkeletonLine $h="12px" $w="26%" />
        </div>
        <SkeletonBlock $h="42px" $w="100%" $radius="14px" />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const {
    open,
    closeCart,
    items,
    status,
    error,
    refresh,
    setQty,
    removeItem,
    totalCents,
  } = useCart();

  const nav = useNavigate();

  const dialog = useModalDialog(open);
  const { user } = useAuth();

  const busy = status === "loading" || status === "saving";

  return (
    <>
      <Panel ref={dialog} $open={open} aria-label="Shopping cart" aria-hidden={!open} inert={!open} onCancel={(event) => { event.preventDefault(); closeCart(); }} onClose={closeCart} onClick={(event) => closeOnBackdrop(event, closeCart)}>
        <Head>
          <Title>
            Cart {busy && <Tag>Syncing…</Tag>}
          </Title>
          <CloseBtn autoFocus type="button" onClick={closeCart}>
            Close
          </CloseBtn>
        </Head>

        <List>
          {status === "error" && <ErrorBox role="alert">{error || "Could not load your cart."}<CloseBtn type="button" onClick={refresh}>Refresh cart</CloseBtn></ErrorBox>}

          {/* ✅ Skeleton gdy jeszcze nie mamy items */}
          {busy && items.length === 0 && <CartSkeleton />}

          {/* Empty state dopiero gdy NIE loading */}
          {!busy && status !== "error" && items.length === 0 && (
            <Muted>Your cart is empty. Browse the shop to get started.</Muted>
          )}

          {/* Items */}
          {items.length > 0 &&
            items.map((it) => {
              const id = it.cart_item_id;
              return (
                <Row key={id}>
                  <div>
                    <Name>{it.name}</Name>
                    <Muted>{formatPrice(it.price_cents)} each</Muted>
                  </div>

                  <Controls>
                    <Qty>
                      <QtyBtn type="button" disabled={busy} aria-label={`Decrease quantity of ${it.name}`} onClick={() => setQty(id, it.quantity - 1)}>
                        −
                      </QtyBtn>
                      <QtyVal>{it.quantity}</QtyVal>
                      <QtyBtn type="button" disabled={busy} aria-label={`Increase quantity of ${it.name}`} onClick={() => setQty(id, it.quantity + 1)}>
                        +
                      </QtyBtn>
                    </Qty>

                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ fontWeight: 1000 }}>
                        {formatPrice(Number(it.price_cents) * Number(it.quantity))}
                      </div>
                      <Remove type="button" disabled={busy} onClick={() => removeItem(id)}>
                        Remove
                      </Remove>
                    </div>
                  </Controls>
                </Row>
              );
            })}
        </List>

        <Foot>
          <TotalRow>
            <TotalLabel>Total</TotalLabel>
            <TotalVal>{formatPrice(totalCents)}</TotalVal>
          </TotalRow>

          <CTA
            type="button"
            onClick={() => {
              closeCart();
              nav("/checkout");
            }}
            disabled={items.length === 0 || busy || status === "error"}
          >
            Checkout
          </CTA>

          <Small>{user ? "Your cart is saved to your account." : "Your cart is saved in this browser session."}</Small>
        </Foot>
      </Panel>
    </>
  );
}
