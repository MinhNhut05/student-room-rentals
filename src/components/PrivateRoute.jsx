// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Make sure this matches your context path

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return children ? children : <Outlet />;
  }
  return <Navigate to="/login" />;
};

export default PrivateRoute;
