import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

export default function Layout({ children }) {
  return (
    <Shell>
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </Shell>
  );
}
