import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import CategorySections from "../components/home/CategorySections";

const Wrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 8px 0;
`;

const Hero = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 22px;
  padding: 22px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: -1px;
`;

const Lead = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 60ch;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Primary = styled(Link)`
  text-decoration: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText};
  border-radius: 14px;
  padding: 12px 14px;
  font-weight: 1000;
  border: 1px solid rgba(0,0,0,0.2);
`;

const Ghost = styled(Link)`
  text-decoration: none;
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 14px;
  padding: 12px 14px;
  font-weight: 1000;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Grid = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Tile = styled(Link)`
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 18px;
  padding: 14px;
  color: ${({ theme }) => theme.colors.text};

  &:hover { background: rgba(255,255,255,0.06); }
`;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setStatus("loading");
    fetchProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setStatus("done");
      })
      .catch(() => { setStatus("error"); });
  }, []);
  
  return (

    <Wrap>
    <Hero>
      <Title>Gear up for the trail.</Title>
      <Lead>
        Outdoor essentials for hiking in the UK — jackets, packs, accessories.
        Fast checkout, clean UI, real API + sessions.
      </Lead>

      <Actions>
        <Primary to="/products">Shop products</Primary>
      </Actions>

      <Grid>
        <Tile to="/products?category=boots">🥾 Boots</Tile>
        <Tile to="/products?category=jackets">🧥 Jackets & Layers</Tile>
        <Tile to="/products?category=backpacks">🎒 Backpacks</Tile>
        <Tile to="/products?category=accessories">🎯 Accessories</Tile>
      </Grid>

      </Hero>

      {status === "loading" && <div>Loading</div>}
      {status === "done" && <CategorySections products={products} />}
      {status === "error" && <div style={{ color: "crimson"}}>Failed to load.</div>}
    </Wrap>
  );
}
