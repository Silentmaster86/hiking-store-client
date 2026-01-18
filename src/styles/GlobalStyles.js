import { createGlobalStyle } from "styled-components";
import bg1 from "../assets/bg/three_peak.JPG";

const GlobalStyles = createGlobalStyle`
  :root{
    color-scheme: dark;
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: ${({ theme }) => theme.colors.text};

    /* ✅ global background image */
    background-image:
      radial-gradient(1200px 700px at 20% 10%, rgba(255,255,255,0.10), transparent 60%),
      radial-gradient(900px 600px at 85% 20%, rgba(255,140,0,0.12), transparent 55%),
      linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.78)),
      url(${bg1});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    /* Opcja: efekt "premium" (na desktop). Na mobile czasem laguje, więc wyłączamy niżej. */
    background-attachment: fixed;
  }

  /* ✅ dodatkowy overlay, żeby czytelność była zawsze OK */
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

  /* Mobile/iOS: fixed background potrafi szarpać */
  @media (max-width: 900px) {
    body { background-attachment: scroll; }
  }

  a { color: inherit; }
`;

export default GlobalStyles;
