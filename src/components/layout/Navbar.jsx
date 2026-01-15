import styled from "styled-components";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(10px);
  background: rgba(11, 15, 20, 0.75);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Row = styled.div`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const Brand = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: 0.4px;

  span {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 700;
  }
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primary2});
  box-shadow: 0 0 0 6px rgba(45, 212, 191, 0.10);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 680px) {
    display: none;
  }
`;

const Link = styled.a`
  padding: 10px 10px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 700;

  &:hover {
    background: rgba(255,255,255,0.06);
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CartBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover { border-color: rgba(255,255,255,0.18); }
`;

export default function Navbar() {
  // TODO: później podłączymy z backendu: ilość itemów w koszyku
  const cartCount = 0;

  return (
    <Bar>
      <Container>
        <Row>
          <Brand href="/">
            <Dot />
            <div>
              Hiking Store <span>UK</span>
            </div>
          </Brand>

          <Nav>
            <Link href="/">Home</Link>
            <Link href="/products">Shop</Link>
            <Link href="/orders">Orders</Link>
          </Nav>

          <Right>
            <CartBtn href="/cart" aria-label="Cart">
              Cart <Badge>{cartCount}</Badge>
            </CartBtn>
            <Button as="a" href="/auth" $variant="primary">
              Sign in
            </Button>
          </Right>
        </Row>
      </Container>
    </Bar>
  );
}
