import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedCheckoutRoute = ({ children }) => {
  const cartItems = useSelector((state) => state.checkout.cart);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/user/home" replace />;
  }

  return children;
};

export default ProtectedCheckoutRoute;
