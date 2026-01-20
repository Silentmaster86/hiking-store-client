import { useMemo, useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

/* =========================
   Layout wrappers
   ========================= */

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
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

  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 10px;
  }
`;

/* =========================
   Brand (NOT a link)
   ========================= */

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: -0.3px;
  cursor: default;
  user-select: none;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 0 4px rgba(255, 153, 0, 0.12);
`;

/* =========================
   Desktop nav (hidden on mobile)
   ========================= */

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LinkPill = styled(NavLink)`
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px solid transparent;
  text-decoration: none;

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

/* =========================
   Right side actions
   ========================= */

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const BtnBase = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 768px) {
    padding: 9px 10px;
    border-radius: 10px;
  }
`;

const AuthLink = styled(LinkPill)`
  @media (max-width: 768px) {
    display: none; /* desktop-only login link */
  }
`;

const LogoutBtn = styled(BtnBase)`
  @media (max-width: 768px) {
    display: none; /* desktop-only logout button */
  }
`;

/* Desktop-only cart button */
const CartBtn = styled(BtnBase)`
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none; /* IMPORTANT: hide on mobile (we use cart icon instead) */
  }
`;

/* =========================
   Mobile controls (ONLY on mobile)
   ========================= */

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const BurgerBtn = styled(BtnBase)`
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 420px) {
    width: 38px;
    height: 38px;
  }
`;

const IconBtn = styled(BtnBase)`
  width: 40px;
  height: 40px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: 420px) {
    width: 38px;
    height: 38px;
  }
`;

const CartCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 1000;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText || "#1b1200"};
  position: absolute;
  top: -6px;
  right: -6px;
  border: 1px solid rgba(0, 0, 0, 0.28);
`;

/* =========================
   Mobile menu overlay + panel
   ========================= */

const MenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.55);
`;

const MenuPanel = styled.div`
  position: fixed;
  top: 58px;
  left: 10px;
  right: 10px;
  z-index: 50;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  overflow: hidden;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MenuList = styled.div`
  display: grid;
`;

const MenuItem = styled(NavLink)`
  padding: 12px 14px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.02);

  &:first-child {
    border-top: 0;
  }

  &.active {
    background: rgba(255, 255, 255, 0.06);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const MenuAction = styled.button`
  padding: 12px 14px;
  border: 0;
  width: 100%;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export default function Navbar() {
  const nav = useNavigate();

  const { toggleCart, items } = useCart();
  const { user, status, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  // Cart count (sum quantities)
  const count = useMemo(
    () => items.reduce((s, x) => s + (x.quantity || 0), 0),
    [items]
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    nav("/", { replace: true });
  }

  const isLoadingAuth = status === "loading";
  const isLoggedIn = !!user && !isLoadingAuth;

  return (
    <>
      <Bar>
        <Inner>
          <Brand>
            <Dot />
            Hiking Store
          </Brand>

          {/* Desktop nav */}
          <Nav>
            <LinkPill to="/" end>
              Home
            </LinkPill>
            <LinkPill to="/products">Products</LinkPill>
            {isLoggedIn && <LinkPill to="/orders">Orders</LinkPill>}
          </Nav>

          <Right>
            {/* Mobile controls */}
            <MobileOnly>
              <BurgerBtn
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                ☰
              </BurgerBtn>

              <IconBtn
                type="button"
                aria-label="Open cart"
                onClick={() => {
                  toggleCart();
                  setMenuOpen(false);
                }}
              >
                🛒
                {count > 0 && <CartCount>{count}</CartCount>}
              </IconBtn>
            </MobileOnly>

            {/* Desktop auth */}
            {!isLoadingAuth && !user && <AuthLink to="/login">Login</AuthLink>}
            {!isLoadingAuth && user && (
              <LogoutBtn type="button" onClick={handleLogout}>
                Logout
              </LogoutBtn>
            )}

            {/* Desktop cart (hidden on mobile to avoid duplicate UI) */}
            <CartBtn
              type="button"
              onClick={() => {
                toggleCart();
                setMenuOpen(false);
              }}
            >
              Cart{count > 0 ? ` (${count})` : ""}
            </CartBtn>
          </Right>
        </Inner>
      </Bar>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <MenuOverlay onClick={() => setMenuOpen(false)} />
          <MenuPanel role="dialog" aria-label="Mobile navigation">
            <MenuList>
              <MenuItem to="/" end onClick={closeMenu}>
                Home
              </MenuItem>
              <MenuItem to="/products" onClick={closeMenu}>Products</MenuItem>

              {isLoggedIn && <MenuItem to="/orders" onClick={closeMenu}>Orders</MenuItem>}

              {!isLoadingAuth && !user && <MenuItem to="/login" onClick={closeMenu}>Sign in</MenuItem>}

              {!isLoadingAuth && user && (
                <MenuAction type="button" onClick={handleLogout}>
                  Logout
                </MenuAction>
              )}
            </MenuList>
          </MenuPanel>
        </>
      )}
    </>
  );
}
