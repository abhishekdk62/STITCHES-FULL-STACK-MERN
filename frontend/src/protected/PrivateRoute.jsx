import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role); // Get role

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }

  if (!allowedRoles.includes(role)) {
    return role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/user/home" replace />;
  }

  return children;
};

export default PrivateRoute;
