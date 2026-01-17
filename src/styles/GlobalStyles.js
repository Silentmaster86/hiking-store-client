import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body { height: 100%; }

  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }

  a { color: inherit; text-decoration: none; }
  button, input { font-family: inherit; }

  ::selection {
    background: rgba(45, 212, 191, 0.25);
  }
`;

export default GlobalStyles;
