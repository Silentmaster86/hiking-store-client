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

  /* Background Image */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(
        rgba(6, 10, 14, 0.78),
        rgba(6, 10, 14, 0.92)
        ),
        url(${bg});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    transform: scale(1.02);
    z-index: 0;
   }
`;

const Main = styled.main`
  max-width: ${({ theme }) => theme.container.max};
  margin: 0 auto;
  padding: 26px ${({ theme }) => theme.container.pad};
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
