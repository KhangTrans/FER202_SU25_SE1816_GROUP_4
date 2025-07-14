import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    // Chưa đăng nhập → về trang Login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
