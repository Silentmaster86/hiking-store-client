import styled from "styled-components";
import { Link } from "react-router-dom";
import CategoryTiles from "../components/home/CategoryTiles";
const Hero = styled.section`
  background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 22px; padding: clamp(18px, 3vw, 30px); box-shadow: ${({ theme }) => theme.shadows.soft};
  h1 { margin: 0 0 12px; font-size: clamp(28px, 4vw, 44px); letter-spacing: -1px; }
  p { max-width: 60ch; line-height: 1.6; color: ${({ theme }) => theme.colors.muted}; }
  a.primary { display: inline-block; margin: 4px 0; border-radius: 12px; padding: 12px 18px;
    background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryText}; font-weight: 800; text-decoration: none; }
`;
export default function HomePage() {
  return <Hero><h1>Gear up for the trail.</h1>
    <p>Explore hiking footwear, jackets, backpacks and trail accessories for your next UK adventure.</p>
    <Link className="primary" to="/products">Shop all products</Link>
    <CategoryTiles />
  </Hero>;
}
