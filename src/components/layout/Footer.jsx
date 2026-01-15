import styled from "styled-components";
import Container from "../ui/Container";

const Wrap = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 26px 0;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function Footer() {
  return (
    <Wrap>
      <Container>
        <Row>
          <div>© {new Date().getFullYear()} Hiking Store UK</div>
          <div>Built with React + styled-components</div>
        </Row>
      </Container>
    </Wrap>
  );
}
