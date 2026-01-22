import styled from "styled-components";
import { Link } from "react-router-dom";

const Grid = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 980px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const Tile = styled(Link)`
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 18px;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.soft};

  &:hover { opacity: 0.96; }
`;

const Img = styled.div`
  height: 140px;
  background: ${({ $url }) =>
    $url
      ? `url(${$url}) center/cover no-repeat`
      : `linear-gradient(120deg, rgba(0,0,0,0.10), rgba(0,0,0,0.02))`};
`;

const Body = styled.div`
  padding: 14px;
  display: grid;
  gap: 6px;
`;

const CatTitle = styled.div`
  font-weight: 1000;
  font-size: 14px;
  opacity: 0.95;
`;

const ProductName = styled.div`
  font-weight: 900;
  font-size: 13px;
  opacity: 0.9;
`;

const Price = styled.div`
  font-weight: 1000;
  font-size: 13px;
`;

function formatPrice(cents) {
  const value = (Number(cents || 0) / 100).toFixed(2);
  return `£${value}`;
}

const CATS = [
  { slug: "boots", title: "🥾 Boots" },
  { slug: "jackets", title: "🧥 Jackets & Layers" },
  { slug: "backpacks", title: "🎒 Backpacks" },
  { slug: "accessories", title: "🧭 Accessories" },
];

function pickRandom(arr) {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function CategoryTiles({ products = [] }) {
  return (
    <Grid>
      {CATS.map((cat) => {
        const items = products.filter((p) => p.category_slug === cat.slug);
        const sample = pickRandom(items);

        return (
          <Tile key={cat.slug} to={`/products?category=${cat.slug}`}>
            <Img $url={sample?.image_url || ""} />
            <Body>
              <CatTitle>{cat.title}</CatTitle>

              {sample ? (
                <>
                  <ProductName>{sample.name}</ProductName>
                  <Price>{formatPrice(sample.price_cents)}</Price>
                </>
              ) : (
                <ProductName style={{ opacity: 0.65 }}>No products yet</ProductName>
              )}
            </Body>
          </Tile>
        );
      })}
    </Grid>
  );
}
