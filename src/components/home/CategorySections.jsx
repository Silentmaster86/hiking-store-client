import styled from "styled-components";
import { Link } from "react-router-dom";

const Section = styled.section`
  margin: 22px 0;
`;

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const TitleWrap = styled.div`
  display: grid;
  gap: 4px;
`;

const H2 = styled.h2`
  margin: 0;
  font-size: 20px;
  letter-spacing: -0.2px;
`;

const P = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const ViewAll = styled(Link)`
  text-decoration: none;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 12px;
  border-radius: 12px;
  white-space: nowrap;

  &:hover { opacity: 0.92; }
`;

const Grid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 980px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const MiniCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Img = styled.div`
  height: 110px;
  background: linear-gradient(120deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02));
`;

const Body = styled.div`
  padding: 12px;
`;

const Name = styled.div`
  font-weight: 900;
  font-size: 14px;
  margin-bottom: 6px;
`;

const Price = styled.div`
  font-weight: 800;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Chip = styled(Link)`
  text-decoration: none;
  font-weight: 900;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  padding: 8px 10px;
  border-radius: 999px;
  &:hover { opacity: 0.92; }
`;

function formatPrice(cents) {
  const value = (Number(cents || 0) / 100).toFixed(2);
  return `£${value}`;
}

const CATS = [
  { slug: "boots", title: "Hiking Boots", desc: "Support & grip for every trail." },
  { slug: "jackets", title: "Jackets & Layers", desc: "Stay warm & dry in UK weather." },
  { slug: "backpacks", title: "Backpacks", desc: "Day hikes to weekend adventures." },
  { slug: "accessories", title: "Accessories", desc: "Small gear, big comfort." },
];

export default function CategorySections({ products = [] }) {
  return (
    <>
      {CATS.map((cat) => {
        const items = products
          .filter((p) => p.category_slug === cat.slug)
          .slice(0, 4);

        return (
          <Section key={cat.slug}>
            <Head>
              <TitleWrap>
                <H2>{cat.title}</H2>
                <P>{cat.desc}</P>
                  
                <Chips>
                  {CATS.filter((c) => c.slug !== cat.slug).map((c) => (
                    <Chip key={c.slug} to={`/products?category=${c.slug}`}>
                      {c.title}
                    </Chip>
                  ))}
                </Chips>
              </TitleWrap>
                
              <ViewAll to={`/products?category=${cat.slug}`}>View all</ViewAll>
            </Head>
                
            {items.length === 0 ? (
              <div style={{ opacity: 0.75, padding: "8px 0" }}>
                No products in this category yet.
              </div>
            ) : (
              <Grid>
                {items.map((p) => (
                  <MiniCard key={p.id}>
                    <Img />
                    <Body>
                      <Name>{p.name}</Name>
                      <Price>{formatPrice(p.price_cents)}</Price>
                    </Body>
                  </MiniCard>
                ))}
              </Grid>
            )}
          </Section>

        );
      })}
    </>
  );
}
