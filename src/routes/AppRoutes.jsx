// ============================================
// FILE: src/routes/AppRoutes.jsx
// PURPOSE: All application routes definition
// ============================================

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Home     from '../pages/public/Home';
import News     from '../pages/public/News';
import Calendar from '../pages/public/Calendar';
import Login    from '../pages/public/Login';

// Auth Pages
import StudentLogin   from '../pages/auth/StudentLogin';
import FacultyLogin   from '../pages/auth/FacultyLogin';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword  from '../pages/auth/ResetPassword';
import ChangePassword from '../pages/auth/ChangePassword';
import VerifyEmail    from '../pages/auth/VerifyEmail';

// Dashboard Pages
import StudentDashboard   from '../pages/dashboards/StudentDashboard';
import TeacherDashboard   from '../pages/dashboards/TeacherDashboard';
import FacultyDashboard   from '../pages/dashboards/FacultyDashboard';
import RegistrarDashboard from '../pages/dashboards/RegistrarDashboard';
import AdminDashboard     from '../pages/dashboards/AdminDashboard';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>

        {/* ============================================ */}
        {/* PUBLIC ROUTES - No auth required             */}
        {/* ============================================ */}
        <Route path="/"         element={<Home />} />
        <Route path="/news"     element={<News />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login"    element={<Login />} />

        {/* ============================================ */}
        {/* AUTH ROUTES                                  */}
        {/* ============================================ */}
        <Route path="/student-login"   element={<StudentLogin />} />
        <Route path="/faculty-login"   element={<FacultyLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/verify-email"    element={<VerifyEmail />} />

        {/* ============================================ */}
        {/* PROTECTED ROUTES - Auth required             */}
        {/* ============================================ */}
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />

        {/* ============================================ */}
        {/* STUDENT DASHBOARD                            */}
        {/* ============================================ */}
        <Route path="/student-dashboard/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        {/* ============================================ */}
        {/* TEACHER DASHBOARD                            */}
        {/* ============================================ */}
        <Route path="/teacher-dashboard/*" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        {/* ============================================ */}
        {/* FACULTY DASHBOARD                            */}
        {/* ============================================ */}
        <Route path="/faculty-dashboard/*" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        } />

        {/* ============================================ */}
        {/* REGISTRAR DASHBOARD                          */}
        {/* ============================================ */}
        <Route path="/registrar-dashboard/*" element={
          <ProtectedRoute allowedRoles={['registrar']}>
            <RegistrarDashboard />
          </ProtectedRoute>
        } />

        {/* ============================================ */}
        {/* MAIN ADMIN DASHBOARD                         */}
        {/* ============================================ */}
        <Route path="/admin-dashboard/*" element={
          <ProtectedRoute allowedRoles={['main_admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* ============================================ */}
        {/* FALLBACK - 404                               */}
        {/* ============================================ */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-dpnhs-bg">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-dpnhs-navy mb-4">404</h1>
              <p className="text-dpnhs-gray mb-6">Page not found</p>
              <a href="/" className="text-dpnhs-gold font-semibold hover:underline">
                Return to Home
              </a>
            </div>
          </div>
        } />

      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;