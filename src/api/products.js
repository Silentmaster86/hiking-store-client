import { apiGet } from "./http";
export const fetchProducts = (options = {}) => apiGet("/products", options);
export const fetchProduct = (id, options = {}) => apiGet(`/products/${encodeURIComponent(id)}`, options);
