import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CartDrawer from "../ui/CartDrawer";
import Footer from "./Footer";
import DemoNotice from "./DemoNotice";
import PageMetadata from "./PageMetadata";
import SessionNotice from "./SessionNotice";
const Shell = styled.div`min-height: 100vh; display: flex; flex-direction: column;`;
const Main = styled.main`
  max-width: ${({ theme }) => theme.container.max}; margin: 0 auto;
  padding: 26px ${({ theme }) => theme.container.pad}; width: 100%; flex: 1; min-width: 0;
`;
const SkipLink = styled.a`
  position: fixed; left: 12px; top: 12px; z-index: 100; padding: 12px; border-radius: 8px;
  transform: translateY(-180%); background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryText};
  &:focus { transform: translateY(0); }
`;
export default function Layout() {
  return <Shell><PageMetadata /><SkipLink href="#main-content">Skip to content</SkipLink>
    <Navbar /><DemoNotice /><SessionNotice /><Main id="main-content" tabIndex={-1}><Outlet /></Main><Footer /><CartDrawer />
  </Shell>;
}
