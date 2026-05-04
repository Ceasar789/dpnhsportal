// ============================================
// FILE: src/pages/auth/ResetPassword.jsx
// PURPOSE: Password reset confirmation page
// DESIGN: Background image, centered card, new password form
// NOTE: Firebase handles reset via email link, this is fallback
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [oobCode, setOobCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // ============================================
  // HANDLE PASSWORD RESET
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      setIsSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // In real Firebase flow, oobCode comes from email link
      // This is a fallback/manual reset page
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password reset successful!');
      setIsSuccess(true);
    } catch (error) {
      console.error('Reset error:', error);
      setMessage('Failed to reset password. The link may have expired.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
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
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/capstonelogo.png" 
              alt="DPNHS Logo" 
              style={{ width: '50px', height: '50px' }} 
            />
            <h2 className="text-2xl font-bold mt-3" style={{ color: '#1a2b4a' }}>
              Reset Password
            </h2>
            <div className="w-10 h-1 mt-2" style={{ backgroundColor: '#d4a843' }} />
          </div>

          {/* Alert */}
          {message && (
            <div 
              className={`flex items-start gap-2 p-3 rounded-md mb-4 ${
                isSuccess ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <span className={isSuccess ? 'text-green-600' : 'text-red-500'}>
                {isSuccess ? '✓' : '⚠'}
              </span>
              <p className={`text-sm flex-1 ${isSuccess ? 'text-green-700' : 'text-red-600'}`}>
                {message}
              </p>
            </div>
          )}

          {/* Success State */}
          {isSuccess ? (
            <button
              onClick={() => navigate('/login')}
              className="w-full h-12 rounded-md text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#28a745' }}
            >
              Back to Login
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Reset Code (oobCode) */}
              <div>
                <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>
                  RESET CODE
                </label>
                <input
                  type="text"
                  value={oobCode}
                  onChange={(e) => setOobCode(e.target.value)}
                  placeholder="Enter code from email"
                  className="w-full h-12 px-4 rounded-md text-sm outline-none focus:ring-2 text-center tracking-widest font-bold"
                  style={{ 
                    backgroundColor: '#F8F9FA',
                    border: '1px solid #E5E7EB'
                  }}
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full h-12 pl-12 pr-4 rounded-md text-sm outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#F8F9FA',
                      border: '1px solid #E5E7EB'
                    }}
                  />
                </div>
              </div>

              {/* Submit */}
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
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {/* Back */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm"
              style={{ color: '#6c757d' }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;