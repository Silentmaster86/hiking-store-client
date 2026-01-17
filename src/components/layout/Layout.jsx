import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";

const Shell = styled.div`
  min-height: 100vh;
`;

const Main = styled.main`
  max-width: ${({ theme }) => theme.container.max};
  margin: 0 auto;
  padding: 24px ${({ theme }) => theme.container.pad};
`;

export default function Layout() {
  return (
    <Shell>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
    </Shell>
  );
}
