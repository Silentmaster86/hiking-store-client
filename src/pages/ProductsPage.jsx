import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/products";
import { useCart } from "../context/CartContext";

const Wrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 8px 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
`;

const H1 = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.5px;
`;

const Sub = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 16px;
`;

const Chip = styled(Link)`
  text-decoration: none;
  font-weight: 1000;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 12px;
  border-radius: 999px;
  white-space: nowrap;

  &:hover {
    opacity: 0.92;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 980px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme, $highlight }) =>
    $highlight
      ? `0 0 0 6px rgba(34,197,94,0.14), ${theme.shadows.soft}`
      : theme.shadows.soft};
  transition: box-shadow 0.2s ease;
`;

const Img = styled.div`
  height: 170px;
  background: ${({ $url }) =>
    $url
      ? `url(${$url}) center/cover no-repeat`
      : `linear-gradient(120deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02))`};
`;

const Body = styled.div`
  padding: 14px;
`;

const Name = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
`;

const Desc = styled.p`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  line-height: 1.35;
  min-height: 38px;
`;

const Price = styled.div`
  font-weight: 700;
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Btn = styled.button`
  border: 0;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  font-weight: 700;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.92;
  }
`;

function formatPrice(cents) {
  const value = (Number(cents || 0) / 100).toFixed(2);
  return `£${value}`;
}

const CATS = [
  {
    slug: "boots",
    label: "🥾 Boots",
    title: "Hiking Boots",
    desc:
      "Support, grip, and comfort for muddy trails and long UK hikes. Pick your footwear and hit the path.",
  },
  {
    slug: "jackets",
    label: "🧥 Jackets",
    title: "Jackets & Layers",
    desc:
      "Rain-ready shells and warm midlayers for unpredictable weather. Stay dry, warm, and comfortable.",
  },
  {
    slug: "backpacks",
    label: "🎒 Backpacks",
    title: "Backpacks",
    desc:
      "Daypacks and trail packs for weekend adventures. Carry essentials with comfort and smart storage.",
  },
  {
    slug: "accessories",
    label: "🧭 Accessories",
    title: "Accessories",
    desc:
      "The small gear that makes a big difference: poles, bottles, lights, first-aid and more.",
  },
];

function getCategoryMeta(category) {
  return CATS.find((c) => c.slug === category) || null;
}

export default function ProductsPage() {
  const { addItem } = useCart();

  const [items, setItems] = useState(null); // null = loading
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const category = searchParams.get("category");

  const catMeta = getCategoryMeta(category);

  useEffect(() => {
    let mounted = true;

    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load products");
        setItems([]); // żeby nie wisieć w loading
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const title = category
      ? `${catMeta?.title || category} — Hiking Store`
      : "Products — Hiking Store";
    document.title = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const visibleItems = useMemo(() => {
    const list = items || [];
    return category ? list.filter((p) => p.category_slug === category) : list;
  }, [items, category]);

  return (
    <Wrap>
      <TitleRow>
        <div>
          <H1>{category ? (catMeta?.title || "Category") : "Shop"}</H1>
          <Sub>
            {category
              ? (catMeta?.desc || `Browse products in "${category}".`)
              : "Outdoor essentials for UK weekends."}
          </Sub>
        </div>
      </TitleRow>

      {category && (
        <Chips>
          {category && <Chip to="/products">🛒 All products</Chip>}
              
          {CATS.filter((c) => !category || c.slug !== category).map((c) => (
            <Chip key={c.slug} to={`/products?category=${c.slug}`}>
              {c.label}
            </Chip>
          ))}
        </Chips>

      )}

      {items === null && !error && <div>Loading products…</div>}

      {error && (
        <div style={{ color: "crimson" }}>
          {error}
          <div style={{ marginTop: 8, color: "#666" }}>
            Tip: sprawdź czy w Netlify masz ustawione <b>VITE_API_URL</b> na Render.
          </div>
        </div>
      )}

      {items !== null && !error && visibleItems.length === 0 && (
        <div style={{ opacity: 0.8 }}>
          No products found{category ? ` in "${category}"` : ""}.
        </div>
      )}

      {items !== null && !error && visibleItems.length > 0 && (
        <Grid>
          {visibleItems.map((p) => {
            const isHighlighted =
              highlightId && String(p.id) === String(highlightId);

            return (
              <Card key={p.id} $highlight={isHighlighted}>
                <Img $url={p.image_url || ""} />
                <Body>
                  <Name>{p.name}</Name>
                  <Desc>{p.description}</Desc>
                  <Bar>
                    <Price>{formatPrice(p.price_cents)}</Price>
                    <Btn onClick={() => addItem(p, 1)}>Add to cart</Btn>
                  </Bar>
                </Body>
              </Card>
            );
          })}
        </Grid>
      )}
    </Wrap>
  );
}
