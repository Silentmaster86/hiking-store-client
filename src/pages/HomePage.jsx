import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";

const Hero = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(120deg, rgba(34,197,94,0.14), rgba(45,212,191,0.10), rgba(255,255,255,0.02));
  border-radius: 20px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  overflow: hidden;
`;

const HeroGrid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;

  @media (min-width: 920px) {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
  }
`;

const H1 = styled.h1`
  margin: 0;
  font-size: 38px;
  letter-spacing: -0.9px;

  @media (min-width: 920px) {
    font-size: 44px;
  }
`;

const Lead = styled.p`
  margin: 10px 0 18px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.55;
  max-width: 58ch;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 900;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
  color: #03130f;
  &:hover { opacity: 0.92; }
`;

const Ghost = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 900;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  color: ${({ theme }) => theme.colors.text};
  &:hover { background: rgba(255,255,255,0.06); }
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const Badge = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(0,0,0,0.12);
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 800;
  font-size: 13px;
`;

const HeroCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  border-radius: 18px;
  padding: 16px;
`;

const Stat = styled.div`
  display: grid;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.02);
`;

const StatNum = styled.div`
  font-size: 26px;
  font-weight: 1000;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 800;
  font-size: 13px;
`;

const Section = styled.section`
  margin-top: 18px;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin: 22px 0 12px;
`;

const H2 = styled.h2`
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.2px;
`;

const Muted = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const Cards = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 760px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const InfoCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 14px;
`;

const InfoTitle = styled.div`
  font-weight: 1000;
  margin-bottom: 6px;
`;

const InfoText = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.45;
  font-size: 14px;
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 760px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const ProductCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Img = styled.div`
  height: 160px;
  background: linear-gradient(120deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
`;

const Body = styled.div`
  padding: 12px 14px 14px;
`;

const PName = styled.div`
  font-weight: 1000;
  margin-bottom: 6px;
`;

const PDesc = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  line-height: 1.4;
  min-height: 36px;
  margin-bottom: 10px;
`;

const PRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Price = styled.div`
  font-weight: 1000;
`;

const SmallBtn = styled(Link)`
  padding: 9px 10px;
  border-radius: 12px;
  font-weight: 900;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  &:hover { background: rgba(255,255,255,0.06); }
`;

const SkeletonCard = styled(ProductCard)`
  min-height: 240px;
`;

const SkeletonBar = styled.div`
  height: 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SkeletonBlock = styled.div`
  height: 160px;
  background: rgba(255,255,255,0.04);
`;


function formatPrice(cents) {
  const v = (Number(cents || 0) / 100).toFixed(2);
  return `£${v}`;
}

export default function HomePage() {
  const [best, setBest] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];
        setBest(arr.slice(0, 3));
        setStatus("done");
      })
      .catch(() => mounted && setStatus("error"));
    return () => (mounted = false);
  }, []);

  return (
    <>
      <Hero>
        <HeroGrid>
          <div>
            <H1>Outdoor gear for real weekends.</H1>
            <Lead>
              Lightweight packs, durable essentials and trail-ready kit — made for UK weather.
              Clean design, fast browsing, and a smooth cart experience.
            </Lead>


            <Actions>
              <Primary to="/products">Shop products</Primary>
              <Ghost to="/products?sort=popular">Browse best sellers</Ghost>
              <Ghost to="/#best">See featured</Ghost>
            </Actions>


            <BadgeRow>
              <Badge>UK delivery</Badge>
              <Badge>Secure checkout</Badge>
              <Badge>Built with PERN</Badge>
            </BadgeRow>
          </div>

          <HeroCard>
            <Stat>
              <StatNum>Fast</StatNum>
              <StatLabel>Vite + React UI</StatLabel>
            </Stat>
            <div style={{ height: 10 }} />
            <Stat>
              <StatNum>Reliable</StatNum>
              <StatLabel>Render API + Postgres</StatLabel>
            </Stat>
            <div style={{ height: 10 }} />
            <Stat>
              <StatNum>Clean</StatNum>
              <StatLabel>Styled-components theme</StatLabel>
            </Stat>
          </HeroCard>
        </HeroGrid>
      </Hero>

      <Section>
        <SectionHead>
          <H2>Why Hiking Store?</H2>
          <Muted>Simple, solid, portfolio-ready.</Muted>
        </SectionHead>

        <Cards>
          <InfoCard>
            <InfoTitle>Outdoor-first design</InfoTitle>
            <InfoText>
              Dark, contrasty UI + strong typography. Easy to extend with categories and filters.
            </InfoText>
          </InfoCard>
          <InfoCard>
            <InfoTitle>Guest cart + orders</InfoTitle>
            <InfoText>
              Możesz kupować bez logowania, a potem “claim” zamówienie po rejestracji.
            </InfoText>
          </InfoCard>
          <InfoCard>
            <InfoTitle>Deploy-ready</InfoTitle>
            <InfoText>
              Frontend on Netlify + backend on Render + Postgres. Idealny układ do portfolio.
            </InfoText>
          </InfoCard>
        </Cards>
      </Section>

      <Section>
        <SectionHead>
          <H2>Best sellers</H2>
          <SmallBtn to="/products">See all</SmallBtn>
        </SectionHead>

        {/*{status === "loading" && <Muted>Loading products…</Muted>}*/}
        {status === "error" && <Muted>Couldn’t load products. Check VITE_API_URL.</Muted>}

        {status === "loading" && (
          <Grid>
            {[1,2,3].map((n) => (
              <SkeletonCard key={n}>
                <SkeletonBlock />
                <Body>
                  <SkeletonBar style={{ width: "70%" }} />
                  <div style={{ height: 10 }} />
                  <SkeletonBar style={{ width: "90%" }} />
                  <div style={{ height: 10 }} />
                  <SkeletonBar style={{ width: "50%" }} />
                </Body>
              </SkeletonCard>
            ))}
          </Grid>
        )}
      </Section>
    </>
  );
}
