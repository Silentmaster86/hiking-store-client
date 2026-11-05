import styled from "styled-components";
import { Link } from "react-router-dom";
import { categories } from "../../constants/categories";
import { site } from "../../config/site";
import { useAuth } from "../../context/auth-context";
const Wrap = styled.footer`
  margin-top: 30px; border-top: 1px solid ${({ theme }) => theme.colors.border}; background: ${({ theme }) => theme.colors.surface};
  .inner { max-width: ${({ theme }) => theme.container.max}; margin: 0 auto; padding: 28px ${({ theme }) => theme.container.pad}; }
  .columns { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1.2fr; gap: 24px; }
  nav, .about { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
  h2 { font-size: 15px; margin: 0 0 4px; }
  p { margin: 0 0 16px; line-height: 1.6; font-size: 14px; color: ${({ theme }) => theme.colors.muted}; }
  a { color: ${({ theme }) => theme.colors.text}; text-decoration: none; font-size: 14px; overflow-wrap: anywhere; }
  a:hover { text-decoration: underline; }
  .brand { font-size: 18px; font-weight: 800; display: inline-block; margin-bottom: 12px; }
  .socials, .legal { display: flex; flex-wrap: wrap; gap: 14px; }
  .bottom { border-top: 1px solid ${({ theme }) => theme.colors.border}; margin-top: 24px; padding-top: 18px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  small { color: ${({ theme }) => theme.colors.muted}; }
  @media(max-width: 980px) { .columns { grid-template-columns: 1fr 1fr; } }
  @media(max-width: 560px) { .columns { grid-template-columns: 1fr; } }
`;
export default function Footer() {
  const { user } = useAuth();
  return <Wrap><div className="inner"><div className="columns">
    <div><Link className="brand" to="/">{site.name}</Link><p>Outdoor essentials for UK adventures. A portfolio store with demo orders and no real payments or deliveries.</p>
      <div className="socials"><a href={site.github} target="_blank" rel="noreferrer">GitHub</a><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>
    </div>
    <nav aria-label="Shop links"><h2>Shop</h2><Link to="/products">All products</Link>{categories.map((item) => <Link key={item.slug} to={`/products?category=${item.slug}`}>{item.label}</Link>)}</nav>
    <nav aria-label="Account links"><h2>Your account</h2><Link to="/cart">Cart</Link><Link to="/orders">Your orders</Link>{!user && <><Link to="/login">Sign in</Link><Link to="/register">Create account</Link></>}</nav>
    <div className="about"><h2>About this project</h2><p>Try the shopping flow with test details. Products and images are illustrative.</p><Link to="/about">About this demo</Link><a href={`mailto:${site.contactEmail}`}>Contact the project owner</a></div>
  </div><div className="bottom"><small>© {new Date().getFullYear()} {site.name} · Portfolio demo</small><nav className="legal" aria-label="Legal links"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/data-deletion">Delete my data</Link></nav></div></div></Wrap>;
}
