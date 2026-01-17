import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(10px);
  background: rgba(11, 15, 20, 0.78);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.container.max};
  padding: 12px ${({ theme }) => theme.container.pad};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: -0.3px;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.14);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LinkPill = styled(NavLink)`
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px solid transparent;

  &.active {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(255, 255, 255, 0.04);
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(255, 255, 255, 0.03);
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CartBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 800;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;
const { toggleCart, items } = useCart();
  const count = items.reduce((s, x) => s + (x.quantity || 0), 0);

export default function Navbar() {
  return (
    <Bar>
      <Inner>
        <Brand to="/" end>
          <Dot />
          Hiking Store
        </Brand>

        <Nav>
          <LinkPill to="/" end>
            Home
          </LinkPill>
          <LinkPill to="/products">Products</LinkPill>
        </Nav>

        <Right>
          <CartBtn type="button" onClick={toggleCart}>
      Cart{count > 0 ? ` (${count})` : ""}
    </CartBtn>
        </Right>
      </Inner>
    </Bar>
  );
}
