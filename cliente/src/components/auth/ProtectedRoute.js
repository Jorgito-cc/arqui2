import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';






const ProtectedRoute = ({ children, allowedRoleIds }) => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const location = useLocation();

  if (!token) {
    // Redirigir al login si no hay token
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificación por rol_id
  if (allowedRoleIds && user && !allowedRoleIds.includes(user.rol_id)) {
    // Si el rol_id no está permitido, redirigir a una página segura según su rol_id
    if (user.rol_id === 1) return <Navigate to="/admin" replace />;
    if (user.rol_id === 2) return <Navigate to="/tecnico" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;