export const sortOptions = [
  ["featured", "Featured"], ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"], ["name", "Name: A to Z"],
];
export function catalogueQuery(params) {
  return { category: params.get("category") || "", query: (params.get("q") || "").slice(0, 100),
    sort: sortOptions.some(([key]) => key === params.get("sort")) ? params.get("sort") : "featured" };
}
export function catalogueResults(items, { category, query, sort }) {
  const needle = query.trim().toLocaleLowerCase("en-GB");
  const result = items.filter(item => (!category || item.category_slug === category)
    && (!needle || item.name.toLocaleLowerCase("en-GB").includes(needle)));
  const name = (a, b) => a.name.localeCompare(b.name, "en-GB", { numeric: true }) || a.id - b.id;
  if (sort === "price-asc") result.sort((a, b) => a.price_cents - b.price_cents || name(a, b));
  if (sort === "price-desc") result.sort((a, b) => b.price_cents - a.price_cents || name(a, b));
  if (sort === "name") result.sort(name);
  return result;
}
export function catalogueParams(params, changes) {
  const result = new URLSearchParams(params);
  for (const [key, value] of Object.entries(changes)) {
    if (!value || (key === "sort" && value === "featured")) result.delete(key);
    else result.set(key, value);
  }
  result.delete("highlight");
  return result;
}
