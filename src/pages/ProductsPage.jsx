import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { useProducts } from "../hooks/useProducts";
import { categories, categoryBySlug } from "../constants/categories";
import { catalogueQuery, catalogueResults, catalogueParams, sortOptions } from "../utils/catalogue";
import { money } from "../utils/orderFormatting";
import { ProductCardSkeletonContent } from "../components/ui/Skeletons";
const Wrap = styled.section`
  h1 { margin: 0 0 8px; font-size: 28px; }
  .lead { color: ${({ theme }) => theme.colors.muted}; line-height: 1.5; }
  .categories { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0; }
  .categories a { padding: 9px 12px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 20px; text-decoration: none; color: inherit; font-size: 14px; }
  button { padding: 11px 14px; border: 0; border-radius: 10px; font-weight: 800; cursor: pointer; color: ${({ theme }) => theme.colors.primaryText}; background: ${({ theme }) => theme.colors.primary}; }
  button:disabled { opacity: .55; cursor: not-allowed; }
  .filters { display: flex; flex-wrap: wrap; gap: 16px; align-items: end; margin: 20px 0; }
  label { display: grid; gap: 8px; }
  input, select { padding: 10px; border-radius: 8px; font: inherit; color: inherit; background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border}; max-width: 100%; }
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
  h2 a { color: inherit; }
  h2 { margin: 0 0 10px; font-size: 18px; }
  p { margin: 0 0 18px; color: ${({ theme }) => theme.colors.muted}; line-height: 1.5; flex: 1; }
  .actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
`;
export default function ProductsPage() {
  const { addItem, status: cartStatus } = useCart();
  const { items, status, retry } = useProducts();
  const [params, setParams] = useSearchParams();
  const filters = catalogueQuery(params), { category, query, sort } = filters;
  const highlight = params.get("highlight");
  const metadata = categoryBySlug(category);
  const visible = catalogueResults(items, filters);
  const href = (value) => `/products?${catalogueParams(params, { category: value })}`;
  return <Wrap>
    <h1>{category ? metadata?.label || "Category not found" : "All products"}</h1>
    <p className="lead">{category ? metadata?.description || "Choose one of the categories below to continue browsing." : "Outdoor essentials for UK adventures. All products and prices are part of a portfolio demo."}</p>
    <nav className="categories" aria-label="Product categories">
      {category && <Link to={href("")}>All products</Link>}
      {categories.map((item) => <Link key={item.slug} to={href(item.slug)} aria-current={item.slug === category ? "page" : undefined}><span aria-hidden="true">{item.emoji} </span>{item.label}</Link>)}
    </nav>
    <form className="filters" role="search" onSubmit={event => event.preventDefault()}>
      <label htmlFor="product-search">Search products<input id="product-search" type="search" maxLength={100} value={query} onChange={event => setParams(catalogueParams(params, { q: event.target.value }), { replace: true })} /></label>
      <label htmlFor="product-sort">Sort by<select id="product-sort" value={sort} onChange={event => setParams(catalogueParams(params, { sort: event.target.value }))}>{sortOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      {(category || query || sort !== "featured") && <button type="button" onClick={() => setParams({})}>Clear filters</button>}
    </form>
    {status === "ready" && <p role="status">{visible.length} {visible.length === 1 ? "product" : "products"} found</p>}
    {status === "loading" && <Grid aria-label="Loading products">{Array.from({ length: 6 }, (_, index) => <ProductCardSkeletonContent key={index} />)}</Grid>}
    {status === "error" && <div role="alert"><p className="error">We couldn’t load the products. Please try again.</p><button onClick={retry}>Try again</button></div>}
    {status === "ready" && !visible.length && <p>No products found. <Link to="/products">Browse all products</Link>.</p>}
    {status === "ready" && <Grid>{visible.map((item, index) => <Card key={item.id} $highlight={String(item.id) === highlight}>
      {item.image_url && <img src={item.image_url} alt={item.name} width="512" height="512" loading={index < 3 ? "eager" : "lazy"} decoding="async" />}
      <div className="body"><h2><Link to={`/products/${item.id}`}>{item.name}</Link></h2><p>{item.description}</p><div className="actions"><strong>{money(item.price_cents)}</strong>
        <button disabled={cartStatus === "loading" || cartStatus === "saving"} onClick={() => addItem(item, 1)}>Add to cart</button>
      </div></div>
    </Card>)}</Grid>}
  </Wrap>;
}
