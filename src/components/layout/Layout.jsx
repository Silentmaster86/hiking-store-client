import styled from "styled-components";
import bg from "../../assets/bg/green.JPG";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CartDrawer from "../ui/CartDrawer";
import Footer from "./Footer";

const Shell = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  /* background image */
  &::before {
    content: "";
    position: absolute;
    inset: 10px;
    background-image:
      linear-gradient(
        rgba(6, 10, 14, 0.56),
        rgba(6, 10, 14, 0.51)
      ),
      url(${bg});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    transform: scale(1.02);
    z-index: 0;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  max-width: ${({ theme }) => theme.container.max};
  margin: 0 auto;
  padding: 26px ${({ theme }) => theme.container.pad};
  width: 100%;
  flex: 1; /* <- ważne, żeby footer był na dole */
`;

export default function Layout() {
  return (
    <Shell>
      <Content>
        <Navbar />
        <Main>
          <Outlet />
        </Main>
        <Footer />
        <CartDrawer />
      </Content>
    </Shell>
  );
}
