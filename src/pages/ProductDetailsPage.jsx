import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../context/cart-context";
import { categoryBySlug } from "../constants/categories";
import PageMetadata from "../components/layout/PageMetadata";
import { money } from "../utils/orderFormatting";
const Product = styled.section`
  background: ${({ theme }) => theme.colors.surface}; padding: 24px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 18px;
  .columns { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 28px; margin-top: 24px; }
  img { width: 100%; height: auto; max-height: 560px; object-fit: contain; border-radius: 12px; }
  h1 { margin-top: 0; } p { line-height: 1.6; } a { color: inherit; }
  button { border: 0; padding: 12px 18px; border-radius: 10px; background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryText}; font-weight: 800; cursor: pointer; }
  button:disabled { opacity: .55; cursor: not-allowed; }
  dl { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; } dd { margin: 0; overflow-wrap: anywhere; }
  @media(max-width: 700px) { padding: 16px; .columns { grid-template-columns: minmax(0,1fr); } }
`;
export default function ProductDetailsPage() {
  const { id } = useParams();
  const { item, status, retry } = useProduct(id);
  const { addItem, status: cartStatus } = useCart();
  const metadata = <PageMetadata title={`${item?.name || (status === "missing" ? "Product not found" : "Product details")} — Hiking Store`} description={item ? `${item.description} Portfolio demo — no real purchases.` : undefined} />;
  if (status === "loading") return <>{metadata}<p role="status">Loading product…</p></>;
  if (status === "missing") return <Product>{metadata}<h1>Product not found</h1><p>This product is unavailable.</p><Link to="/products">Browse all products</Link></Product>;
  if (status === "error") return <Product>{metadata}<h1>We couldn’t load this product</h1><p role="alert">Please try again.</p><button onClick={retry}>Try again</button></Product>;
  const category = categoryBySlug(item.category_slug);
  const specifications = item.specifications && typeof item.specifications === "object" && !Array.isArray(item.specifications) ? Object.entries(item.specifications).filter(([, value]) => ["string", "number"].includes(typeof value)) : [];
  return <Product>{metadata}
    <nav aria-label="Breadcrumb"><Link to="/products">Shop</Link>{category && <> / <Link to={`/products?category=${category.slug}`}>{category.label}</Link></>}</nav>
    <div className="columns">{item.image_url && <img src={item.image_url} alt={item.name} width="512" height="512" decoding="async" />}
      <div><h1>{item.name}</h1><p><strong>{money(item.price_cents)}</strong></p><p>{item.description}</p>
        <button disabled={["loading", "saving"].includes(cartStatus)} onClick={() => addItem(item, 1)}>Add to cart</button>
        <h2>About this item</h2><p>{item.details || "Illustrative portfolio product. No goods are shipped. Product options and stock are not modelled in this demo."}</p>
        {specifications.length > 0 && <><h2>Demo specifications</h2><dl>{specifications.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></>}
        <p>Portfolio demo — no payments or deliveries. Sizes and variants are not selected in this demonstration.</p>
      </div></div>
  </Product>;
}
