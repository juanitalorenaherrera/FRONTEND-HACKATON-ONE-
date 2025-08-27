import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Si no hay usuario, redirige a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si hay un usuario, renderiza el componente de la ruta (ej. OwnerDashboard)
  return <Outlet />;
};

export default ProtectedRoute;