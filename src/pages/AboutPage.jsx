import { Link } from "react-router-dom";
import InfoPage from "../components/layout/InfoPage";
export default function AboutPage() {
  return <InfoPage title="About this demo">
    <p>Hiking Store is a portfolio project by Przemysław Pietkun. You can explore the catalogue, use the cart and place demonstration orders.</p>
    <h2>What to expect</h2><p>No payments are taken and no goods are shipped. Product images, names, descriptions and prices are illustrative. Product sizes and stock availability are not modelled.</p>
    <h2>Try an order</h2><p>Use test account and delivery details. The checkout accepts UK address formats; for example, SW1A 1AA is a valid postcode format. Guest orders can be reopened in the same browser for up to seven days, or saved to a signed-in account from the confirmation page.</p>
    <h2>Your data</h2><p>Accounts and orders are stored to demonstrate the shopping flow. Read the <Link to="/privacy">privacy policy</Link> and <Link to="/data-deletion">data deletion instructions</Link> before entering information.</p>
    <p><Link to="/products">Browse the shop</Link></p>
  </InfoPage>;
}
