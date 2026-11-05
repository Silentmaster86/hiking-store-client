import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart-context";
import { useAuth } from "../../context/auth-context";
import { useModalDialog, closeOnBackdrop } from "../../hooks/useModalDialog";
const Bar = styled.header`
  position: sticky; top: 0; z-index: 30; background: #0d1522; border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  .inner { max-width: ${({ theme }) => theme.container.max}; padding: 12px ${({ theme }) => theme.container.pad}; margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
  .brand { display: flex; gap: 10px; align-items: center; color: inherit; text-decoration: none; font-weight: 800; white-space: nowrap; }
  .brand::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: ${({ theme }) => theme.colors.primary}; }
  nav, .actions { display: flex; align-items: center; gap: 10px; }
  nav a, button, .auth { color: inherit; text-decoration: none; padding: 10px 12px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 10px; background: transparent; font-weight: 700; cursor: pointer; }
  nav a.active { background: ${({ theme }) => theme.colors.surface2}; border-color: ${({ theme }) => theme.colors.primary}; }
  .mobile { display: none; }
  [role='alert'] { max-width: 1100px; margin: 0 auto; padding: 12px; color: ${({ theme }) => theme.colors.danger}; }
  @media(max-width: 768px) { .desktop { display: none; } .mobile { display: inline-flex; } .inner { gap: 8px; padding: 10px 12px; } button { min-width: 40px; min-height: 40px; } }
`;
const Menu = styled.dialog`
  padding: 0; margin: 0 auto; top: 68px; width: calc(100% - 24px); max-width: 540px; max-height: calc(100dvh - 84px);
  color: ${({ theme }) => theme.colors.text}; background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 14px;
  &::backdrop { background: rgba(0,0,0,.65); }
  a, button { display: block; width: 100%; text-align: left; padding: 14px 18px; color: inherit; border: 0; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; background: transparent; text-decoration: none; font: inherit; cursor: pointer; }
  a.active { background: ${({ theme }) => theme.colors.surface2}; }
`;
export default function Navbar() {
  const { toggleCart, items } = useCart();
  const { user, status, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false), [signingOut, setSigningOut] = useState(false), [error, setError] = useState("");
  const dialog = useModalDialog(menuOpen);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 769px)");
    const close = () => { if (query.matches) setMenuOpen(false); };
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);
  async function signOut() {
    if (signingOut) return;
    setSigningOut(true); setError("");
    try { await logout(); setMenuOpen(false); nav("/", { replace: true }); }
    catch { setError("We couldn’t sign you out. Please try again."); }
    finally { setSigningOut(false); }
  }
  return <>
    <Bar><div className="inner">
      <NavLink className="brand" to="/" aria-label="Hiking Store home">Hiking Store</NavLink>
      <nav className="desktop" aria-label="Main navigation"><NavLink to="/" end>Home</NavLink><NavLink to="/products">Shop</NavLink>{user && <NavLink to="/orders">Your orders</NavLink>}</nav>
      <div className="actions">
        {status === "ready" && (user ? <button className="desktop" disabled={signingOut} onClick={signOut}>{signingOut ? "Signing out…" : "Sign out"}</button> : <NavLink className="desktop auth" to="/login">Sign in</NavLink>)}
        <button className="desktop" onClick={toggleCart}>Cart{count ? ` (${count})` : ""}</button>
        <button className="mobile" aria-label="Open menu" aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>☰</button>
        <button className="mobile" aria-label={`Open cart, ${count} items`} onClick={toggleCart}>🛒{count > 0 && <span aria-hidden="true"> {count}</span>}</button>
      </div>
    </div>{error && <p role="alert">{error}</p>}</Bar>
    <Menu id="mobile-navigation" ref={dialog} aria-label="Mobile navigation" onCancel={(event) => { event.preventDefault(); closeMenu(); }} onClose={closeMenu} onClick={(event) => closeOnBackdrop(event, closeMenu)}>
      <button autoFocus onClick={closeMenu}>Close menu</button>
      <NavLink to="/" end onClick={closeMenu}>Home</NavLink><NavLink to="/products" onClick={closeMenu}>Shop</NavLink><NavLink to="/cart" onClick={closeMenu}>Cart</NavLink>
      {user && <NavLink to="/orders" onClick={closeMenu}>Your orders</NavLink>}
      {status === "ready" && (user ? <button disabled={signingOut} onClick={signOut}>{signingOut ? "Signing out…" : "Sign out"}</button> : <NavLink to="/login" onClick={closeMenu}>Sign in</NavLink>)}
    </Menu>
  </>;
}
