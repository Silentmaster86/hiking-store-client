import { apiGet } from "./http";
export const fetchProducts = () => apiGet("/products");
