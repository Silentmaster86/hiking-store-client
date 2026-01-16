import { apiGet } from "./http";

export function fetchProducts() {
  return apiGet("/products");
}
