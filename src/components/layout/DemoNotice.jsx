import styled from "styled-components";
import { Link } from "react-router-dom";
const Notice = styled.div`
  background: #162338; border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px 18px; text-align: center; color: ${({ theme }) => theme.colors.muted}; font-size: 13px;
  a { color: ${({ theme }) => theme.colors.text}; white-space: nowrap; }
`;
export default function DemoNotice() {
  return <Notice>Portfolio demo · No payments or deliveries. Use test details. <Link to="/about">About this demo</Link></Notice>;
}
