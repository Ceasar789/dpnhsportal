// ============================================
// FILE: src/pages/auth/RoleLogin.jsx
// PURPOSE: Role-specific login form (Student or Faculty)
// DESIGN: Background image, centered card, email/password form
// PROPS: role - "Student" or "Faculty"
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const RoleLogin = ({ role }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ============================================
  // HANDLE LOGIN SUBMIT
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Login with Firebase
      const user = await login(email, password);
      
      // Force token refresh to get custom claims
      await user.getIdToken(true);
      
      // Get the user's actual role from custom claims
      const idTokenResult = await user.getIdTokenResult(true);
      const userRole = idTokenResult.claims.role || 'student';

      // Navigate based on actual user role
      const roleRoutes = {
        student: '/student-dashboard',
        teacher: '/teacher-dashboard',
        faculty: '/faculty-dashboard',
        registrar: '/registrar-dashboard',
        main_admin: '/admin-dashboard'
      };
      
      const redirectUrl = roleRoutes[userRole] || '/student-dashboard';
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(getErrorMessage(error.code || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // FIREBASE ERROR MESSAGES
  // ============================================
  const getErrorMessage = (code) => {
    const errors = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-email': 'Please enter a valid email',
      'auth/user-disabled': 'This account has been disabled',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/invalid-credential': 'Invalid email or password'
    };
    return errors[code] || 'Login failed. Please try again.';
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/capstonebackground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/capstonelogo.png" 
              alt="DPNHS Logo" 
              style={{ width: '60px', height: '60px' }} 
            />
            <h2 className="text-2xl font-bold mt-4" style={{ color: '#1a2b4a' }}>
              {role} Login
            </h2>
            <div className="w-10 h-1 mt-2" style={{ backgroundColor: '#d4a843' }} />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-md mb-4" style={{ backgroundColor: '#fee2e2' }}>
              <span className="text-red-500 text-lg">⚠</span>
              <p className="text-sm flex-1" style={{ color: '#dc3545' }}>
                {errorMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dpnhs.edu.ph"
                  className="w-full h-12 pl-12 pr-4 rounded-md text-sm outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: '#F8F9FA',
                    border: '1px solid #E5E7EB'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>
                PASSWORD
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-12 rounded-md text-sm outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: '#F8F9FA',
                    border: '1px solid #E5E7EB'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={20} style={{ color: '#9CA3AF' }} />
                  ) : (
                    <Eye size={20} style={{ color: '#9CA3AF' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#0d2b5c' }}
                />
                <span className="text-sm" style={{ color: '#4a5568' }}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm font-semibold"
                style={{ color: '#b7950b' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-md text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#0d2b5c' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link - REMOVED (admin creates accounts) */}
          {/* Back buttons */}
          <div className="flex flex-col items-center gap-2 mt-5">
            <button
              onClick={() => navigate('/login')}
              className="text-sm"
              style={{ color: '#6c757d' }}
            >
              ← Back to role selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;