// ============================================
// FILE: src/pages/auth/FacultyLogin.jsx
// PURPOSE: Faculty portal login with role selection
// Roles: admin, teacher, faculty, registrar
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import { Eye, EyeOff, Mail, Lock, ChevronDown } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'main_admin', label: 'Admin',      color: '#dc3545', route: '/admin-dashboard' },
  { value: 'teacher',    label: 'Teacher',    color: '#0d2b5c', route: '/teacher-dashboard' },
  { value: 'faculty',    label: 'Faculty',    color: '#6f42c1', route: '/faculty-dashboard' },
  { value: 'registrar',  label: 'Registrar',  color: '#198754', route: '/registrar-dashboard' },
];

const FacultyLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentRole = ROLE_OPTIONS.find(r => r.value === selectedRole);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole)          { setErrorMessage('Please select your role'); return; }
    if (!email.trim() || !password) { setErrorMessage('Please fill in all fields'); return; }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const user = await login(email, password);

      // Fetch role from Supabase profiles
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileErr) throw profileErr;

      // Make sure role matches what they selected
      if (profile.role !== selectedRole) {
        await supabase.auth.signOut();
        setErrorMessage(`Access denied. Your account is not registered as ${currentRole?.label}.`);
        setIsLoading(false);
        return;
      }

      // Redirect to correct dashboard
      const route = ROLE_OPTIONS.find(r => r.value === profile.role)?.route || '/faculty-dashboard';
      navigate(route, { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(getErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (message) => {
    if (message?.includes('Invalid login credentials')) return 'Invalid email or password';
    if (message?.includes('Email not confirmed'))       return 'Please verify your email first';
    if (message?.includes('Too many requests'))         return 'Too many attempts. Please try again later';
    return 'Login failed. Please try again.';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundImage: 'url(/capstonebackground.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg p-10">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img src="/capstonelogo.png" alt="DPNHS Logo" style={{ width: '60px', height: '60px' }} />
            <h2 className="text-2xl font-bold mt-4" style={{ color: '#1a2b4a' }}>Faculty Portal</h2>
            <div className="w-10 h-1 mt-2" style={{ backgroundColor: '#d4a843' }} />
            <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Select your role to continue</p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-md mb-4" style={{ backgroundColor: '#fee2e2' }}>
              <span className="text-red-500 text-lg">⚠</span>
              <p className="text-sm flex-1" style={{ color: '#dc3545' }}>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>LOGIN AS</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full h-12 pl-4 pr-4 rounded-md text-sm text-left flex items-center justify-between outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#F8F9FA',
                    border: `1px solid ${currentRole ? currentRole.color : '#E5E7EB'}`,
                  }}
                >
                  {currentRole ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentRole.color }} />
                      <span className="font-semibold" style={{ color: currentRole.color }}>{currentRole.label}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#9CA3AF' }}>Select your role...</span>
                  )}
                  <ChevronDown size={18} style={{ color: '#9CA3AF', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-md shadow-lg overflow-hidden"
                    style={{ border: '1px solid #E5E7EB' }}>
                    {ROLE_OPTIONS.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => { setSelectedRole(role.value); setShowDropdown(false); setErrorMessage(''); }}
                        className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                        <span className="font-semibold" style={{ color: role.color }}>{role.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>EMAIL ADDRESS</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dpnhs.edu.ph"
                  className="w-full h-12 pl-12 pr-4 rounded-md text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>PASSWORD</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-12 rounded-md text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff size={20} style={{ color: '#9CA3AF' }} /> : <Eye size={20} style={{ color: '#9CA3AF' }} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button type="button" onClick={() => navigate('/forgot-password')}
                className="text-sm font-semibold" style={{ color: '#b7950b' }}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full h-12 rounded-md text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: currentRole?.color || '#0d2b5c' }}>
              {isLoading
                ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>
                : `Sign In${currentRole ? ` as ${currentRole.label}` : ''}`}
            </button>
          </form>

          {/* Back */}
          <div className="flex justify-center mt-5">
            <button onClick={() => navigate('/login')} className="text-sm" style={{ color: '#6c757d' }}>
              ← Back to role selection
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;