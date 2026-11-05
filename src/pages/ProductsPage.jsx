import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { useProducts } from "../hooks/useProducts";
import { categories, categoryBySlug } from "../constants/categories";
import { money } from "../utils/orderFormatting";
import { ProductCardSkeletonContent } from "../components/ui/Skeletons";
const Wrap = styled.section`
  h1 { margin: 0 0 8px; font-size: 28px; }
  .lead { color: ${({ theme }) => theme.colors.muted}; line-height: 1.5; }
  .categories { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0; }
  .categories a { padding: 9px 12px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 20px; text-decoration: none; color: inherit; font-size: 14px; }
  button { padding: 11px 14px; border: 0; border-radius: 10px; font-weight: 800; cursor: pointer; color: ${({ theme }) => theme.colors.primaryText}; background: ${({ theme }) => theme.colors.primary}; }
  button:disabled { opacity: .55; cursor: not-allowed; }
  .error { color: ${({ theme }) => theme.colors.danger}; }
`;
const Grid = styled.div`
  display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr));
  @media(max-width: 979px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media(max-width: 639px) { grid-template-columns: minmax(0, 1fr); }
`;
const Card = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.border}; background: ${({ theme }) => theme.colors.card};
  border-radius: 16px; overflow: hidden; box-shadow: ${({ theme, $highlight }) => $highlight ? `0 0 0 3px ${theme.colors.primary}` : theme.shadows.soft};
  display: flex; flex-direction: column;
  img { width: 100%; height: 220px; object-fit: contain; background: ${({ theme }) => theme.colors.surface2}; }
  .body { padding: 18px; display: flex; flex-direction: column; flex: 1; }
  h2 { margin: 0 0 10px; font-size: 18px; }
  p { margin: 0 0 18px; color: ${({ theme }) => theme.colors.muted}; line-height: 1.5; flex: 1; }
  .actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
`;
export default function ProductsPage() {
  const { addItem, status: cartStatus } = useCart();
  const { items, status, retry } = useProducts();
  const [params] = useSearchParams(), category = params.get("category"), highlight = params.get("highlight");
  const metadata = categoryBySlug(category);
  const visible = category ? items.filter((item) => item.category_slug === category) : items;
  return <Wrap>
    <h1>{category ? metadata?.label || "Category not found" : "All products"}</h1>
    <p className="lead">{category ? metadata?.description || "Choose one of the categories below to continue browsing." : "Outdoor essentials for UK adventures. All products and prices are part of a portfolio demo."}</p>
    <nav className="categories" aria-label="Product categories">
      {category && <Link to="/products">All products</Link>}
      {categories.map((item) => <Link key={item.slug} to={`/products?category=${item.slug}`} aria-current={item.slug === category ? "page" : undefined}><span aria-hidden="true">{item.emoji} </span>{item.label}</Link>)}
    </nav>
    {status === "loading" && <Grid aria-label="Loading products">{Array.from({ length: 6 }, (_, index) => <ProductCardSkeletonContent key={index} />)}</Grid>}
    {status === "error" && <div role="alert"><p className="error">We couldn’t load the products. Please try again.</p><button onClick={retry}>Try again</button></div>}
    {status === "ready" && !visible.length && <p>No products found. <Link to="/products">Browse all products</Link>.</p>}
    {status === "ready" && <Grid>{visible.map((item, index) => <Card key={item.id} $highlight={String(item.id) === highlight}>
      {item.image_url && <img src={item.image_url} alt={item.name} width="512" height="512" loading={index < 3 ? "eager" : "lazy"} decoding="async" />}
      <div className="body"><h2>{item.name}</h2><p>{item.description}</p><div className="actions"><strong>{money(item.price_cents)}</strong>
        <button disabled={cartStatus === "loading" || cartStatus === "saving"} onClick={() => addItem(item, 1)}>Add to cart</button>
      </div></div>
    </Card>)}</Grid>}
  </Wrap>;
}
