import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import CategoryTiles from "../components/home/CategoryTiles";

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

export default function HomePage() {
  const [products, setProducts] = useState(null); // null = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Failed to load");
        setProducts([]); // żeby nie wisieć w loading, opcjonalnie
      });

    return () => {
      mounted = false;
    };
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

        {products === null && !error && <div style={{ marginTop: 14 }}>Loading…</div>}
        {error && <div style={{ marginTop: 14, color: "crimson" }}>{error}</div>}

        {/* NAJWAŻNIEJSZE: products || [] */}
        {products !== null && !error && <CategoryTiles products={products || []} />}
      </Hero>
    </Wrap>
  );
}
