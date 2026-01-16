import { Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}
