import { apiGet } from "./http";
export const fetchProducts = (options = {}) => apiGet("/products", options);
