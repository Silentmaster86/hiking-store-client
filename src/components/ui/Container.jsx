import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.container.max};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.container.pad};
`;

export default Container;
