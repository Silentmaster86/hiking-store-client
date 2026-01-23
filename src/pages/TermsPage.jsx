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

export default function TermsPage() {
  return (
    <Wrap>
      <H1>Terms & Conditions</H1>

      <P>
        This website is a demonstration project created for portfolio and
        educational purposes only.
      </P>

      <H2>No real purchases</H2>
      <P>
        Products, prices, and checkout flows are simulated. No real payments
        are processed and no physical goods are shipped.
      </P>

      <H2>Accounts</H2>
      <P>
        User accounts are provided for demonstration of authentication and
        session handling only.
      </P>

      <H2>Liability</H2>
      <P>
        The owner of this website is not responsible for any damages or losses
        arising from the use of this demo application.
      </P>

      <H2>Changes</H2>
      <P>
        These terms may be updated at any time to reflect changes to this
        demonstration project.
      </P>
    </Wrap>
  );
}
