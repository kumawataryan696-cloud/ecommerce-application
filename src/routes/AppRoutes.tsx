import { Navigate, Route, Routes } from "react-router-dom";
import CartPage from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Wishlist from "../pages/wishlist";
import Home from "../pages/home/Home";
import React, { Suspense } from "react";
import Spinner from "../component/spinner/spinner";

const ProductDetails = React.lazy(() =>
  import("../pages/productDetails/ProductDetails")
);

export function AppRoutes() {
  return (
    <Suspense
      fallback={<Spinner open={true} message="Loading product details..." />}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Navigate to="/" replace />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Suspense>
  );
}