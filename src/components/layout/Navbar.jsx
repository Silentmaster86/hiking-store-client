import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(12px);
  background: rgba(11, 15, 20, 0.72);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.container.max};
  padding: 10px ${({ theme }) => theme.container.pad};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 1000;
  letter-spacing: -0.3px;
  white-space: nowrap;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 0 4px rgba(255, 153, 0, 0.16);
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  /* Hide desktop nav on small screens */
  @media (max-width: 760px) {
    display: none;
  }
`;

const LinkPill = styled(NavLink)`
  padding: 9px 11px;
  border-radius: 12px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px solid transparent;
  text-decoration: none;

  &.active {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(255, 255, 255, 0.06);
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 9px 10px;
  cursor: pointer;
  font-weight: 1000;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }

  /* Slightly smaller on very small screens */
  @media (max-width: 380px) {
    padding: 8px 9px;
    border-radius: 11px;
  }
`;

const CartCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(255, 153, 0, 0.20);
  border: 1px solid rgba(255, 153, 0, 0.30);
  font-size: 12px;
  font-weight: 1000;
`;

const MobileMenuBtn = styled(IconBtn)`
  display: none;

  @media (max-width: 760px) {
    display: inline-flex;
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 40;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 160ms ease;
`;

const MobilePanel = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: min(320px, 86vw);
  z-index: 50;
  background: rgba(15, 23, 42, 0.92);
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(14px);
  transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
  transition: transform 180ms ease;
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

const MobileTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 4px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const MobileNav = styled.nav`
  display: grid;
  gap: 8px;
  padding: 12px 4px;
`;

const MobileLink = styled(NavLink)`
  text-decoration: none;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 1000;

  &.active {
    border-color: rgba(255,153,0,0.35);
    background: rgba(255,153,0,0.14);
  }

  &:hover {
    background: rgba(255,255,255,0.07);
  }
`;

const Small = styled.div`
  margin-top: auto;
  padding: 12px 4px 6px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

export default function Navbar() {
  const nav = useNavigate();
  const { toggleCart, items } = useCart();
  const { user, status, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const count = items.reduce((s, x) => s + (x.quantity || 0), 0);
  const authed = status !== "loading" && Boolean(user?.id || user?.email);

  async function handleLogout() {
    await logout();
    nav("/");
  }

  // Close menu on route change (simple + effective)
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <>
      <Bar>
        <Inner>
          <Brand to="/" end>
            <Dot />
            Hiking Store
          </Brand>

          <DesktopNav>
            <LinkPill to="/" end>Home</LinkPill>
            <LinkPill to="/products">Products</LinkPill>
            {authed && <LinkPill to="/orders">Orders</LinkPill>}
          </DesktopNav>

          <Right>
            {/* Mobile hamburger */}
            <MobileMenuBtn type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              ☰
            </MobileMenuBtn>

            {/* Auth action stays visible on mobile */}
            {status !== "loading" && !authed && (
              <IconBtn type="button" onClick={() => nav("/login")}>
                Login
              </IconBtn>
            )}

            {status !== "loading" && authed && (
              <IconBtn type="button" onClick={handleLogout}>
                Logout
              </IconBtn>
            )}

            {/* Cart always visible */}
            <IconBtn type="button" onClick={toggleCart} aria-label="Open cart">
              🛒
              {count > 0 && <CartCount>{count}</CartCount>}
            </IconBtn>
          </Right>
        </Inner>
      </Bar>

      {/* Mobile slide-in menu */}
      <MobileOverlay $open={menuOpen} onClick={() => setMenuOpen(false)} />
      <MobilePanel $open={menuOpen} aria-hidden={!menuOpen}>
        <MobileTop>
          <div style={{ fontWeight: 1100 }}>Menu</div>
          <IconBtn type="button" onClick={() => setMenuOpen(false)}>Close</IconBtn>
        </MobileTop>

        <MobileNav>
          <MobileLink to="/" end onClick={() => setMenuOpen(false)}>Home</MobileLink>
          <MobileLink to="/products" onClick={() => setMenuOpen(false)}>Products</MobileLink>
          {authed && (
            <MobileLink to="/orders" onClick={() => setMenuOpen(false)}>Orders</MobileLink>
          )}
        </MobileNav>

        <Small>Outdoor store demo · React + sessions + PostgreSQL</Small>
      </MobilePanel>
    </>
  );
}
