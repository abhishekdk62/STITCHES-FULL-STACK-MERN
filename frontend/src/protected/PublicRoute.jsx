import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);

  if (isAuthenticated && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (isAuthenticated && role === "user") {
    return <Navigate to="/user/home" replace />;
  }

  return children;
};

export default PublicRoute;
