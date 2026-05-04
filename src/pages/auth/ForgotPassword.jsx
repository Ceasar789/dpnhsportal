// ============================================
// FILE: src/pages/auth/ForgotPassword.jsx
// PURPOSE: Password reset request page
// DESIGN: Background image, centered card, email input
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // ============================================
  // HANDLE PASSWORD RESET REQUEST
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await sendPasswordReset(email);
      setMessage('Password reset email sent! Check your inbox.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Reset error:', error);
      setMessage(getErrorMessage(error.code || error.message));
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    const errors = {
      'auth/user-not-found': 'No account found with this email',
      'auth/invalid-email': 'Please enter a valid email address'
    };
    return errors[code] || 'Failed to send reset email. Please try again.';
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
              Forgot Password
            </h2>
            <div className="w-10 h-1 mt-2" style={{ backgroundColor: '#d4a843' }} />
          </div>

          {/* Description */}
          <p className="text-sm text-center mb-6" style={{ color: '#6B7280' }}>
            Enter your email to receive a password reset link.
          </p>

          {/* Alert Message */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
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
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm"
              style={{ color: '#6c757d' }}
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;