import { request } from "./client";
export const fetchProducts = () => request("/products");
