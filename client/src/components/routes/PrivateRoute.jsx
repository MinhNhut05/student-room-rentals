// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (user) {
    return children ? children : <Outlet />;
  }
  return <Navigate to="/login" />;
};

export default PrivateRoute;
