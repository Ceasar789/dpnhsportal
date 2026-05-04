// ============================================
// FILE: src/routes/ProtectedRoute.jsx
// PURPOSE: Route guard - checks auth and role
// ============================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userData, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dpnhs-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dpnhs-navy"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(userData?.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    const roleRoutes = {
      student: '/student-dashboard',
      teacher: '/teacher-dashboard',
      faculty: '/faculty-dashboard',
      registrar: '/registrar-dashboard',
      main_admin: '/admin-dashboard'
    };
    
    const redirectTo = roleRoutes[userData?.role] || '/login';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;