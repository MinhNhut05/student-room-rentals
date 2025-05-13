// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
