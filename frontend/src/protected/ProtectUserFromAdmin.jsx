import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectUserFromAdmin = ({ children }) => {
  const role = useSelector((state) => state.auth.role);

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectUserFromAdmin;
