import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return <section><h1>Page not found</h1><p>We couldn’t find the page you requested.</p><Link to="/">Go home</Link>{" · "}<Link to="/products">Browse the shop</Link></section>;
}
