import { useEffect } from "react";
import styled from "styled-components";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CartDrawer from "../ui/CartDrawer";
import Footer from "./Footer";

import b1 from "../../assets/bg/b1.jpg";
import b2 from "../../assets/bg/b2.jpg";
import b3 from "../../assets/bg/b3.jpg";
import b4 from "../../assets/bg/b4.jpg";

const BGS = [b1, b2, b3, b4];

const Shell = styled.div`
  min-height: 100vh;
`;

const Content = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  max-width: ${({ theme }) => theme.container.max};
  margin: 0 auto;
  padding: 26px ${({ theme }) => theme.container.pad};
  width: 100%;
  flex: 1; /* Keeps footer at the bottom */
`;

export default function Layout() {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");
  
  useEffect(() => {
    // Pick one background per page load
    const pick = BGS[Math.floor(Math.random() * BGS.length)];
    document.documentElement.style.setProperty("--app-bg", `url(${pick})`);
  }, []);

  return (
    <Shell>
      <Content>
        <Navbar />
        <Main>
          <Outlet />
        </Main>

        {/* Show footer everywhere except /login and /register */}
        { !hideFooter && <Footer /> }
        <CartDrawer />
      </Content>
    </Shell>
  );
}
