import { Link } from "react-router-dom";
import InfoPage from "../components/layout/InfoPage";
import { site } from "../config/site";
export default function DataDeletionPage() {
  const subject = encodeURIComponent("Hiking Store data deletion request");
  return <InfoPage title="Delete your data">
    <p>To request deletion of your account or demo orders, email the project owner at <a href={`mailto:${site.contactEmail}?subject=${subject}`}>{site.contactEmail}</a>.</p>
    <h2>What to include</h2><p>Include the email address used for your account or checkout, and any order numbers relevant to your request. Requests are handled manually; the owner may need to confirm that the account or orders belong to you.</p>
    <h2>Cookies and stored orders</h2><p>Clearing browser cookies removes local session access, but does not delete accounts or orders stored by the application. Request deletion by email to remove those records.</p>
    <p><Link to="/privacy">Read the privacy policy</Link></p>
  </InfoPage>;
}
