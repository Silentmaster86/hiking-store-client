import styled from "styled-components";

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(45, 212, 191, 0.18);
  border: 1px solid rgba(45, 212, 191, 0.35);
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 800;
`;

export default Badge;
