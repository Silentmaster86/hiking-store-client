import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrap = styled.footer`
  margin-top: 28px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.02);
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 22px 0;
`;

const Top = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1.2fr 1fr 1fr 1.2fr;

  @media (max-width: 980px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Brand = styled.div`
  display: grid;
  gap: 10px;
`;

const Logo = styled.div`
  font-weight: 1000;
  letter-spacing: -0.4px;
  font-size: 16px;
`;

const Muted = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
  font-size: 13px;
  max-width: 52ch;
`;

const Col = styled.div`
  display: grid;
  gap: 8px;
  align-content: start;
`;

const H = styled.div`
  font-weight: 1000;
  font-size: 13px;
  letter-spacing: -0.2px;
`;

const A = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
  font-weight: 800;
  font-size: 13px;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

const Ext = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
  font-weight: 800;
  font-size: 13px;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

const Newsletter = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 10px;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;

  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(0, 0, 0, 0.18);
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 12px;
  outline: none;
`;

const Btn = styled.button`
  border: 0;
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 1000;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.accent};
  color: white;

  &:hover {
    opacity: 0.92;
  }
`;

const Social = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Pill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 900;
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 999px;

  &:hover {
    opacity: 0.92;
  }
`;

const Bottom = styled.div`
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Tiny = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

const MiniLinks = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

const Mini = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 900;
  font-size: 12px;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
  }
`;

export default function Footer() {
  const year = new Date().getFullYear();

  function handleNewsletterSubmit(e) {
    e.preventDefault();
    // MVP: tylko UX. Możemy później podpiąć backend / Mailchimp.
    alert("Thanks! Newsletter coming soon 🙂");
  }

  return (
    <Wrap>
      <Inner>
        <Top>
          <Brand>
            <Logo>Hiking Store</Logo>
            <Muted>
              Outdoor essentials for UK weekends — clean UI, real API + sessions.
              Built as a portfolio e-commerce project.
            </Muted>

            <Social>
              <Pill href="https://github.com/Silentmaster86" target="_blank" rel="noreferrer">
                🐙 GitHub
              </Pill>
              <Pill href="https://www.linkedin.com/in/przemyslaw-pietkun-front-end-dev" target="_blank" rel="noreferrer">
                💼 LinkedIn
              </Pill>
              <Pill href="mailto:hello@hiking-store.local">
                ✉️ Email
              </Pill>
            </Social>
          </Brand>

          <Col>
            <H>Shop</H>
            <A to="/products">All products</A>
            <A to="/products?category=boots">Boots</A>
            <A to="/products?category=jackets">Jackets</A>
            <A to="/products?category=backpacks">Backpacks</A>
            <A to="/products?category=accessories">Accessories</A>
          </Col>

          <Col>
            <H>Help</H>
            <A to="/cart">Cart</A>
            <A to="/orders">Orders</A>
            <A to="/login">Sign in</A>
            <A to="/register">Create account</A>
          </Col>

          <Newsletter>
            <H>Get trail deals (demo)</H>
            <Muted style={{ margin: 0 }}>
              Newsletter is UI-only for now. We can wire it to an API later.
            </Muted>
            <Form onSubmit={handleNewsletterSubmit}>
              <Input
                type="email"
                placeholder="Email address"
                required
                aria-label="Email address"
              />
              <Btn type="submit">Subscribe</Btn>
            </Form>
          </Newsletter>
        </Top>

        <Bottom>
          <Tiny>© {year} Hiking Store. All rights reserved.</Tiny>

          <MiniLinks>
            <Mini to="/products">Products</Mini>
            <Mini to="/privacy">Privacy</Mini>
            <Mini to="/terms">Terms</Mini>
          </MiniLinks>
        </Bottom>
      </Inner>
    </Wrap>
  );
}
