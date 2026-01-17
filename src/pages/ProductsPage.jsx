import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";


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
  margin-bottom: 16px;
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
  background: linear-gradient(120deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02));
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
  &:hover { opacity: 0.92; }
`;

function formatPrice(cents) {
  const value = (Number(cents || 0) / 100).toFixed(2);
  return `£${value}`;
}

export default function ProductsPage() {
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");


  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
        setStatus("done");
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || "Failed to load products");
        setStatus("error");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.title = "Products — Hiking Store";
  }, []);
  
  return (
  <Wrap>
    <TitleRow>
      <div>
        <H1>Shop</H1>
        <Sub>Outdoor essentials for UK weekends.</Sub>
      </div>
    </TitleRow>

    {status === "loading" && <div>Loading products…</div>}

    {status === "error" && (
      <div style={{ color: "crimson" }}>
        {error}
        <div style={{ marginTop: 8, color: "#666" }}>
          Tip: sprawdź czy w Netlify masz ustawione <b>VITE_API_URL</b> na Render.
        </div>
      </div>
    )}

    {status === "done" && (
      <Grid>
        {items.map((p) => {
          const isHighlighted =
            highlightId && String(p.id) === String(highlightId);

          return (
            <Card key={p.id} $highlight={isHighlighted}>
              <Img />
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
