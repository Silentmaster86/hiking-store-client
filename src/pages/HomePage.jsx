import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 16px;
`;

const Hero = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const H1 = styled.h1`
  margin: 0 0 10px;
  font-size: 34px;
  letter-spacing: -0.6px;
`;

const P = styled.p`
  margin: 0 0 18px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Btn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 800;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $primary, theme }) => ($primary ? theme.colors.primary : "transparent")};
  color: ${({ $primary }) => ($primary ? "#03130f" : "inherit")};
`;

export default function HomePage() {
  return (
    <Wrap>
      <Hero>
        <H1>Hiking Store UK</H1>
        <P>
          Outdoor essentials — products from Render API, UI in styled-components.
        </P>
        <Actions>
          <Btn to="/products" $primary>
            Browse products
          </Btn>
          <Btn to="/products">See deals</Btn>
        </Actions>
      </Hero>
    </Wrap>
  );
}
