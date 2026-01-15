import styled from "styled-components";

const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $variant, theme }) =>
    $variant === "primary"
      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary2})`
      : theme.colors.surface2};
  color: ${({ $variant, theme }) => ($variant === "primary" ? "#071018" : theme.colors.text)};
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.2px;
  box-shadow: ${({ $variant, theme }) => ($variant === "primary" ? theme.shadow.soft : "none")};
  transition: transform 0.08s ease, opacity 0.2s ease, border-color 0.2s ease;

  &:hover { opacity: 0.95; border-color: rgba(255,255,255,0.18); }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export default Button;
