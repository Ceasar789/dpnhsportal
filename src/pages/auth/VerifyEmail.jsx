// ============================================
// FILE: src/pages/auth/VerifyEmail.jsx
// PURPOSE: Email verification page (6-digit PIN)
// DESIGN: Background image, centered card, 6 input boxes
// NOTE: Admin-created users may need to verify email
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get email from navigation state or user
  const [email] = useState(location.state?.email || user?.email || '');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const inputRefs = useRef([]);

  // ============================================
  // HANDLE PIN INPUT
  // ============================================
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Only keep last digit
    setPin(newPin);
    setErrorMessage('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace on empty field → focus previous
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newPin = [...pin];
    
    pasted.split('').forEach((digit, i) => {
      if (i < 6) newPin[i] = digit;
    });
    
    setPin(newPin);
    
    // Focus next empty or last
    const nextEmpty = newPin.findIndex(d => !d);
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  // ============================================
  // HANDLE VERIFY
  // ============================================
  const handleVerify = async () => {
    const pinString = pin.join('');
    
    if (pinString.length !== 6) {
      setErrorMessage('Please enter complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      // In real implementation, verify PIN with backend
      // For Firebase, we check if email is verified
      await user?.reload();
      
      if (user?.emailVerified) {
        setIsVerified(true);
      } else {
        // Simulate verification for demo
        setTimeout(() => {
          setIsVerified(true);
          setIsVerifying(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Verify error:', error);
      setErrorMessage('Invalid verification code');
      setIsVerifying(false);
    }
  };

  // ============================================
  // RESEND EMAIL
  // ============================================
  const handleResend = async () => {
    try {
      if (user) {
        await sendEmailVerification(user);
        setErrorMessage('');
        alert('Verification email sent!');
      }
    } catch (error) {
      console.error('Resend error:', error);
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
              style={{ width: '60px', height: '60px' }} 
            />
            <h2 className="text-xl font-bold mt-4" style={{ color: '#1a2b4a' }}>
              Account Verification
            </h2>
          </div>

          {!isVerified ? (
            <>
              {/* Description */}
              <p className="text-sm text-center mb-2" style={{ color: '#6B7280' }}>
                Enter the 6-digit verification code for:
              </p>
              <p className="text-base font-bold text-center mb-6" style={{ color: '#0d2b5c' }}>
                {email}
              </p>

              {/* Error */}
              {errorMessage && (
                <div className="flex items-start gap-2 p-3 rounded-md mb-4 bg-red-50">
                  <span className="text-red-500">⚠</span>
                  <p className="text-sm text-red-600 flex-1">{errorMessage}</p>
                </div>
              )}

              {/* PIN Inputs */}
              <div className="flex justify-center gap-2 mb-6">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    style={{
                      backgroundColor: '#F8F9FA',
                      border: '1px solid #E5E7EB',
                      color: '#1a2b4a'
                    }}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full h-12 rounded-md text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#0d2b5c' }}
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  'Verify Account'
                )}
              </button>

              {/* Resend */}
              <div className="text-center mt-4">
                <button
                  onClick={handleResend}
                  className="text-sm"
                  style={{ color: '#6c757d' }}
                >
                  Didn't receive code? Resend
                </button>
              </div>

              {/* Back to login */}
              <div className="text-center mt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm"
                  style={{ color: '#6c757d' }}
                >
                  Back to login
                </button>
              </div>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-3xl text-green-600">✓</span>
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Account Verified!
              </h3>
              <p className="text-sm text-center mb-6" style={{ color: '#6B7280' }}>
                You can now log in to your account.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-md text-white font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#0d2b5c' }}
              >
                Proceed to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;