import styled from "styled-components";
const Wrap = styled.section`
  max-width: 800px; margin: 0 auto; padding: clamp(18px, 3vw, 30px); border-radius: 18px;
  background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border};
  p, li { color: ${({ theme }) => theme.colors.muted}; line-height: 1.7; }
  h1 { margin-top: 0; } h2 { margin-top: 28px; font-size: 22px; }
  a { color: ${({ theme }) => theme.colors.text}; overflow-wrap: anywhere; }
`;
export default function InfoPage({ title, children }) { return <Wrap><h1>{title}</h1>{children}</Wrap>; }
