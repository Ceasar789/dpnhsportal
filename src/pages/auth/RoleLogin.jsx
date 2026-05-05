// ============================================
// FILE: src/pages/auth/RoleLogin.jsx
// PURPOSE: Role-specific login form (Student or Faculty)
// DESIGN: Background image, centered card, email/password form
// PROPS: role - "Student" or "Faculty"
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ChevronDown } from 'lucide-react';

// ============================================
// ROLE CONFIGURATION
// ============================================

const FACULTY_SUB_ROLES = [
  { label: 'Admin',     value: 'main_admin' },
  { label: 'Faculty',   value: 'faculty'    },
  { label: 'Teacher',   value: 'teacher'    },
  { label: 'Registrar', value: 'registrar'  },
];

const ALLOWED_ROLES = {
  Student: ['student'],
  Faculty: ['main_admin', 'faculty', 'teacher', 'registrar'],
};

const ROLE_ROUTES = {
  student:    '/student-dashboard',
  teacher:    '/teacher-dashboard',
  faculty:    '/faculty-dashboard',
  registrar:  '/registrar-dashboard',
  main_admin: '/admin-dashboard',
};

const ROLE_LABELS = {
  student:    'Student',
  teacher:    'Teacher',
  faculty:    'Faculty',
  registrar:  'Registrar',
  main_admin: 'Admin',
};

const MAX_ATTEMPTS   = 5;
const LOCKOUT_MS     = 5 * 60 * 1000; // 5 minutes

const RoleLogin = ({ role }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const isFacultyPage = role === 'Faculty';

  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [rememberMe,      setRememberMe]      = useState(false);
  const [showPassword,    setShowPassword]    = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [errorMessage,    setErrorMessage]    = useState('');
  const [selectedSubRole, setSelectedSubRole] = useState(FACULTY_SUB_ROLES[0].value);
  const [dropdownOpen,    setDropdownOpen]    = useState(false);

  // ── Lockout state ─────────────────────────────────────────────
  const [attempts,        setAttempts]        = useState(0);
  const [lockedUntil,     setLockedUntil]     = useState(null); // timestamp ms
  const [countdown,       setCountdown]       = useState(0);    // seconds remaining
  const timerRef = useRef(null);

  // ============================================
  // COUNTDOWN TIMER
  // ============================================
  useEffect(() => {
    if (lockedUntil) {
      const tick = () => {
        const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          setLockedUntil(null);
          setAttempts(0);
          setCountdown(0);
          setErrorMessage('');
        } else {
          setCountdown(remaining);
        }
      };
      tick();
      timerRef.current = setInterval(tick, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [lockedUntil]);

  const isLockedOut = lockedUntil && Date.now() < lockedUntil;

  // Format mm:ss
  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ============================================
  // HANDLE LOGIN SUBMIT
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLockedOut) return;

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const user = await login(email, password);

      await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult(true);
      const userRole = idTokenResult.claims.role || 'student';

      // ── Portal-level check ────────────────────────────────────────
      const allowedForThisPage = ALLOWED_ROLES[role];

      if (!allowedForThisPage.includes(userRole)) {
        const correctPortal = userRole === 'student' ? 'Student' : 'Faculty';
        // Role mismatch counts as a failed attempt
        handleFailedAttempt(
          `This account belongs to the ${ROLE_LABELS[userRole] || userRole} role. ` +
          `Please use the ${correctPortal} login instead.`
        );
        setIsLoading(false);
        return;
      }

      // ── Faculty sub-role check ────────────────────────────────────
      if (isFacultyPage && userRole !== selectedSubRole) {
        const expectedLabel = FACULTY_SUB_ROLES.find(r => r.value === selectedSubRole)?.label;
        handleFailedAttempt(
          `This account is not a "${expectedLabel}". ` +
          `Please select the correct role from the dropdown.`
        );
        setIsLoading(false);
        return;
      }

      // ── Success — reset attempts ──────────────────────────────────
      setAttempts(0);
      const redirectUrl = ROLE_ROUTES[userRole] || '/student-dashboard';
      navigate(redirectUrl, { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      handleFailedAttempt(getErrorMessage(error.code || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLE FAILED ATTEMPT
  // ============================================
  const handleFailedAttempt = (message) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MS;
      setLockedUntil(until);
      setErrorMessage('');  // lockout banner takes over
    } else {
      const remaining = MAX_ATTEMPTS - newAttempts;
      setErrorMessage(
        `${message} ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
      );
    }
  };

  // ============================================
  // FIREBASE ERROR MESSAGES
  // ============================================
  const getErrorMessage = (code) => {
    const errors = {
      'auth/user-not-found':     'No account found with this email.',
      'auth/wrong-password':     'Incorrect password.',
      'auth/invalid-email':      'Please enter a valid email.',
      'auth/user-disabled':      'This account has been disabled.',
      'auth/too-many-requests':  'Too many failed attempts. Please try again later.',
      'auth/invalid-credential': 'Invalid email or password.',
    };
    return errors[code] || 'Login failed. Please try again.';
  };

  const selectedLabel = FACULTY_SUB_ROLES.find(r => r.value === selectedSubRole)?.label || 'Select Role';

  // ============================================
  // RENDER
  // ============================================
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/capstonebackground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg p-10">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img src="/capstonelogo.png" alt="DPNHS Logo" style={{ width: '60px', height: '60px' }} />
            <h2 className="text-2xl font-bold mt-4" style={{ color: '#1a2b4a' }}>
              {role} Login
            </h2>
            <div className="w-10 h-1 mt-2" style={{ backgroundColor: '#d4a843' }} />
          </div>

          {/* ── Faculty Sub-Role Dropdown ── */}
          {isFacultyPage && (
            <div className="mb-5">
              <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>
                LOGIN AS
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => !isLockedOut && setDropdownOpen(!dropdownOpen)}
                  className="w-full h-12 pl-4 pr-10 rounded-md text-sm text-left outline-none flex items-center justify-between"
                  style={{
                    backgroundColor: '#F8F9FA',
                    border: '1px solid #E5E7EB',
                    color: '#1a2b4a',
                    fontWeight: 600,
                    opacity: isLockedOut ? 0.5 : 1,
                    cursor: isLockedOut ? 'not-allowed' : 'pointer',
                  }}
                >
                  <span>{selectedLabel}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      color: '#9CA3AF',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>

                {dropdownOpen && !isLockedOut && (
                  <div
                    className="absolute left-0 right-0 mt-1 rounded-md shadow-lg z-20 overflow-hidden"
                    style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB' }}
                  >
                    {FACULTY_SUB_ROLES.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setSelectedSubRole(item.value);
                          setDropdownOpen(false);
                          setErrorMessage('');
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                        style={{
                          color: selectedSubRole === item.value ? '#0d2b5c' : '#4a5568',
                          fontWeight: selectedSubRole === item.value ? 700 : 400,
                          backgroundColor: selectedSubRole === item.value ? '#EFF6FF' : 'transparent',
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Lockout Banner ── */}
          {isLockedOut ? (
            <div
              className="flex flex-col items-center gap-2 p-4 rounded-md mb-4 text-center"
              style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}
            >
              <span style={{ fontSize: '28px' }}>🔒</span>
              <p className="text-sm font-semibold" style={{ color: '#856404' }}>
                Too many failed attempts
              </p>
              <p className="text-xs" style={{ color: '#856404' }}>
                Please wait before trying again.
              </p>
              <div
                className="text-3xl font-bold tracking-widest mt-1"
                style={{ color: '#0d2b5c', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatCountdown(countdown)}
              </div>
            </div>
          ) : (
            /* ── Regular Error Message ── */
            errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-md mb-4" style={{ backgroundColor: '#fee2e2' }}>
                <span className="text-red-500 text-lg">⚠</span>
                <p className="text-sm flex-1" style={{ color: '#dc3545' }}>{errorMessage}</p>
              </div>
            )
          )}

          {/* ── Attempt Dots (shown after first failure) ── */}
          {!isLockedOut && attempts > 0 && (
            <div className="flex items-center justify-center gap-2 mb-4">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full transition-colors"
                  style={{
                    backgroundColor: i < attempts ? '#dc3545' : '#D1D5DB',
                  }}
                />
              ))}
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
                  disabled={isLockedOut}
                  className="w-full h-12 pl-12 pr-4 rounded-md text-sm outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
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
                  disabled={isLockedOut}
                  className="w-full h-12 pl-12 pr-12 rounded-md text-sm outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  disabled={isLockedOut}
                >
                  {showPassword
                    ? <EyeOff size={20} style={{ color: '#9CA3AF' }} />
                    : <Eye size={20} style={{ color: '#9CA3AF' }} />
                  }
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
                  disabled={isLockedOut}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#0d2b5c' }}
                />
                <span className="text-sm" style={{ color: '#4a5568' }}>Remember me</span>
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
              disabled={isLoading || isLockedOut}
              className="w-full h-12 rounded-md text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0d2b5c' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : isLockedOut ? (
                'Account Temporarily Locked'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Back button */}
          <div className="flex flex-col items-center gap-2 mt-5">
            <button onClick={() => navigate('/login')} className="text-sm" style={{ color: '#6c757d' }}>
              ← Back to role selection
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleLogin;