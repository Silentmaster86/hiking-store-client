import { Link } from "react-router-dom";
import InfoPage from "../components/layout/InfoPage";
export default function TermsPage() {
  return <InfoPage title="Terms of use">
    <p>Last updated: 5 November 2026.</p><p>Hiking Store is a portfolio and educational demonstration.</p>
    <h2>Demo products and orders</h2><p>Products, prices, images and descriptions are illustrative. Placing an order does not create a real purchase. No payment is taken and no goods are delivered. Demo payment and shipment statuses are simulations.</p>
    <h2>Accounts and access</h2><p>Use test details to explore the application. Guest access is tied to the browser session and is available for up to seven days from checkout. You can save an eligible guest order to an account from its confirmation page. Access may be lost when cookies are cleared.</p>
    <h2>Availability</h2><p>The demo may be updated, unavailable or reset during maintenance. It is not intended for placing real purchases or storing information you need to retain.</p>
    <h2>Personal information</h2><p>Read the <Link to="/privacy">privacy policy</Link> for details about stored information and the <Link to="/data-deletion">data deletion instructions</Link> to contact the owner.</p>
  </InfoPage>;
}
