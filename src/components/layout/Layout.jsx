import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import CartDrawer from "../ui/CartDrawer";
import Footer from "./Footer";

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  max-width: ${({ theme }) => theme.container.max};
  margin: 0 auto;
  padding: 24px ${({ theme }) => theme.container.pad};
  flex: 1;
  width: 100%;
`;

export default function Layout() {
  return (
    <Shell>
      <Navbar />
      <Main>
        <Outlet />
      </Main>

      <Footer />
      <CartDrawer />
    </Shell>
  );
}
