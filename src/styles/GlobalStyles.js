import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root{
    color-scheme: dark;

    /* The app background is controlled via CSS variable (set from Layout). */
    --app-bg: none;
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: ${({ theme }) => theme.colors.text};

    /* Global background (image + overlays). */
    background-image:
      radial-gradient(1200px 700px at 20% 10%, rgba(255,255,255,0.10), transparent 60%),
      radial-gradient(900px 600px at 85% 20%, rgba(255,140,0,0.12), transparent 55%),
      linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.78)),
      var(--app-bg);

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    /* Premium effect (desktop). */
    background-attachment: fixed;
  }

  /* Extra overlay to keep text readable on any photo. */
  body::before{
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    background:
      radial-gradient(900px 600px at 15% 85%, rgba(34,197,94,0.12), transparent 60%),
      radial-gradient(900px 600px at 90% 75%, rgba(59,130,246,0.12), transparent 60%),
      linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55));
  }

  /* Mobile/iOS: fixed background can stutter. */
  @media (max-width: 900px) {
    body { background-attachment: scroll; }
  }

  a { color: inherit; }
`;

export default GlobalStyles;
