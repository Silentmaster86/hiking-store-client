import { categoryBySlug } from "../constants/categories.js";
export function pageMetadata(pathname, search = "") {
  const category = new URLSearchParams(search).get("category");
  const names = {
    "/": "Hiking Store UK", "/products": category ? categoryBySlug(category)?.label || "Category not found" : "All products",
    "/cart": "Your cart", "/checkout": "Checkout", "/login": "Sign in", "/register": "Create account",
    "/orders": "Your orders", "/privacy": "Privacy policy", "/terms": "Terms of use", "/data-deletion": "Delete your data", "/about": "About this demo",
  };
  const name = names[pathname] || (/^\/order\/[^/]+\/confirmation$/.test(pathname) ? "Order confirmation" : /^\/orders\/[^/]+$/.test(pathname) ? "Order details" : "Page not found");
  return { title: pathname === "/" ? name : `${name} — Hiking Store`, description: "Explore hiking footwear, jackets, backpacks and outdoor accessories in this portfolio demo. No real payments or deliveries." };
}
