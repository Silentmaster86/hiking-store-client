import { test } from "node:test";
import assert from "node:assert/strict";
import { catalogueQuery, catalogueResults, catalogueParams } from "../src/utils/catalogue.js";
const products = [{ id: 1, name: "Trail Boots", category_slug: "boots", price_cents: 9000 }, { id: 2, name: "Daypack", category_slug: "backpacks", price_cents: 4000 }, { id: 3, name: "Low Trail Shoes", category_slug: "boots", price_cents: 7000 }];
test("catalogue combines category, case-insensitive name search and price ordering", () => {
  const filters = catalogueQuery(new URLSearchParams("category=boots&q=TRAIL&sort=price-asc"));
  assert.deepEqual(catalogueResults(products, filters).map(item => item.id), [3, 1]);
  assert.deepEqual(products.map(item => item.id), [1, 2, 3], "Filtering must not reorder the source catalogue");
  assert.equal(catalogueResults(products, { ...filters, query: "missing" }).length, 0);
});
test("catalogue query links preserve other filters and use safe defaults", () => {
  const params = new URLSearchParams("category=boots&q=trail&sort=price-desc&highlight=7");
  const next = catalogueParams(params, { category: "backpacks" });
  assert.equal(next.get("q"), "trail"); assert.equal(next.get("sort"), "price-desc"); assert.equal(next.has("highlight"), false);
  assert.equal(catalogueParams(params, { sort: "featured" }).has("sort"), false);
  assert.equal(catalogueQuery(new URLSearchParams("sort=unknown")).sort, "featured");
  assert.equal(catalogueQuery(new URLSearchParams({ q: "x".repeat(1000) })).query.length, 100);
});
