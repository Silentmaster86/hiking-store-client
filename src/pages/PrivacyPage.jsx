import styled from "styled-components";

const Wrap = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 18px 0;
`;

const H1 = styled.h1`
  margin-bottom: 12px;
`;

const P = styled.p`
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
`;

const H2 = styled.h2`
  margin-top: 22px;
`;

export default function PrivacyPage() {
  return (
    <Wrap>
      <H1>Privacy Policy</H1>

      <P>
        This is a demo e-commerce project built for portfolio and educational
        purposes. No real purchases are processed.
      </P>

      <H2>Information we collect</H2>
      <P>
        We may collect basic account information such as name and email address
        when you create an account. This data is used only to demonstrate
        authentication and order flows.
      </P>

      <H2>How we use your information</H2>
      <P>
        Your information is used only to operate this demo application,
        including login, cart, and order history features.
      </P>

      <H2>Cookies & sessions</H2>
      <P>
        This site may use cookies or session storage to keep you logged in and
        maintain your cart. These are used strictly for functionality.
      </P>

      <H2>Contact</H2>
      <P>
        If you have any questions about this privacy policy, please contact:
        hello@hiking-store.local
      </P>
    </Wrap>
  );
}
