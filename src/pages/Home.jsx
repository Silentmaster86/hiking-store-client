import styled from "styled-components";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

const Hero = styled.section`
  padding: 46px 0 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 22px;
  box-shadow: ${({ theme }) => theme.shadow.soft};
`;

const Title = styled.h1`
  margin: 0 0 10px;
  font-size: 44px;
  line-height: 1.05;

  @media (max-width: 520px) {
    font-size: 34px;
  }
`;

const Lead = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 16px;
  line-height: 1.6;
`;

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

const Pill = styled.span`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.04);
  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const Side = styled.div`
  display: grid;
  gap: 18px;
`;

const Section = styled.section`
  padding: 22px 0 36px;
`;

const H2 = styled.h2`
  margin: 0 0 12px;
  font-size: 18px;
  letter-spacing: 0.3px;
`;

const Categories = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Cat = styled.a`
  display: block;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  transition: transform 0.08s ease, border-color 0.2s ease;

  &:hover { transform: translateY(-1px); border-color: rgba(255,255,255,0.18); }

  strong { display: block; font-size: 14px; }
  span { display: block; margin-top: 6px; color: ${({ theme }) => theme.colors.muted}; font-weight: 600; }
`;

export default function Home() {
  return (
    <>
      <Hero>
        <Container>
          <Grid>
            <Card>
              <Title>Gear up for the next trail.</Title>
              <Lead>
                Outdoor essentials for hiking in the UK: jackets, backpacks, accessories — simple checkout and fast delivery.
              </Lead>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button as="a" href="/products" $variant="primary">Shop products</Button>
                <Button as="a" href="/cart">View cart</Button>
              </div>

              <Pills>
                <Pill>Free returns (demo)</Pill>
                <Pill>Secure checkout</Pill>
                <Pill>REI-style UI</Pill>
              </Pills>
            </Card>

            <Side>
              <Card>
                <H2>Popular categories</H2>
                <Categories>
                  <Cat href="/products?cat=jackets">
                    <strong>Jackets</strong>
                    <span>Wind & rain protection</span>
                  </Cat>
                  <Cat href="/products?cat=backpacks">
                    <strong>Backpacks</strong>
                    <span>Daypacks & trekking</span>
                  </Cat>
                  <Cat href="/products?cat=accessories">
                    <strong>Accessories</strong>
                    <span>All the small essentials</span>
                  </Cat>
                </Categories>
              </Card>

              <Card>
                <H2>Featured</H2>
                <Lead style={{ marginBottom: 0 }}>
                  Next step: pokażemy tutaj realne produkty z API (cards + loading skeleton).
                </Lead>
              </Card>
            </Side>
          </Grid>
        </Container>
      </Hero>

      <Section>
        <Container>
          <Card>
            <H2>Next to build</H2>
            <Lead style={{ margin: 0 }}>
              Products page → Product cards → Product details → Cart → Checkout form.
            </Lead>
          </Card>
        </Container>
      </Section>
    </>
  );
}
