import { Link } from "react-router-dom";
import InfoPage from "../components/layout/InfoPage";
import { site } from "../config/site";
export default function PrivacyPage() {
  return <InfoPage title="Privacy policy">
    <p>Last updated: 5 November 2026.</p><p>This portfolio demo is operated by Przemysław Pietkun. No real purchases, payments or deliveries are processed. Please use test details.</p>
    <h2>Information stored</h2><p>The application stores account email addresses, names and password hashes for email accounts. External sign-in may provide a name, email address and provider account identifier. Checkout stores the supplied name, email, delivery address, country, order items and amounts.</p>
    <h2>How the information is used</h2><p>These details support sign-in, carts, demo checkout, order access and order history. They are not used by this application to send marketing newsletters.</p>
    <h2>Cookies and browser storage</h2><p>A session cookie connects your browser to its account, cart and guest-order access. Session cookies can last up to seven days. A temporary checkout reference is stored in sessionStorage to recover interrupted attempts; addresses and passwords are not saved there by the application. Clearing cookies removes guest access.</p>
    <h2>Services involved</h2><p>The frontend is hosted by Netlify. The API and database use the configured hosting infrastructure, including Render. Google or Facebook processes sign-in when you choose that provider. Those services have their own privacy information.</p>
    <h2>Retention and deletion</h2><p>Saved accounts and orders currently have no automatic deletion schedule. Guest access expires after seven days; this does not delete the saved order. You can request access, correction or deletion by contacting the project owner.</p>
    <h2>Contact</h2><p><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p><p><Link to="/data-deletion">How to request deletion of your data</Link></p>
  </InfoPage>;
}
