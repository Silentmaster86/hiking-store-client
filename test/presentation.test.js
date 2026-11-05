import { test } from "node:test";
import assert from "node:assert/strict";
import { categories } from "../src/constants/categories.js";
import { pageMetadata } from "../src/utils/pageMetadata.js";
import theme from "../src/styles/theme.js";
test("category URLs stay compatible and presentation labels are consistent", () => {
  assert.deepEqual(categories.map((item) => item.slug), ["boots", "jackets", "backpacks", "accessories"]);
  for (const item of categories) assert.ok(pageMetadata("/products", `?category=${item.slug}`).title.startsWith(item.label));
});
test("metadata covers account, legal, order and unknown routes", () => {
  for (const pathname of ["/login", "/register", "/cart", "/checkout", "/orders", "/privacy", "/terms", "/about", "/data-deletion", "/orders/7", "/order/7/confirmation"]) assert.notEqual(pageMetadata(pathname).title, "Page not found — Hiking Store");
  assert.equal(pageMetadata("/").title, "Hiking Store UK");
  assert.equal(pageMetadata("/missing").title, "Page not found — Hiking Store");
  assert.equal(pageMetadata("/products", "?category=unknown").title, "Category not found — Hiking Store");
});
function luminance(hex) {
  const values = hex.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a, b) { const values = [luminance(a), luminance(b)].sort((x, y) => y - x); return (values[0] + 0.05) / (values[1] + 0.05); }
test("opaque card and action colour pairs meet normal-text contrast", () => {
  for (const text of [theme.colors.text, theme.colors.muted, theme.colors.danger]) assert.ok(contrast(text, theme.colors.surface) >= 4.5);
  assert.ok(contrast(theme.colors.primaryText, theme.colors.primary) >= 4.5);
});
