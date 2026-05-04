// ============================================
// FILE: src/pages/auth/ChangePassword.jsx
// PURPOSE: Change password while logged in
// DESIGN: Clean form, current + new + confirm password
// PROTECTED: Requires authentication
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // ============================================
  // HANDLE PASSWORD CHANGE
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
      await updatePassword(user, newPassword);
      setMessage('Password changed successfully!');
      setIsSuccess(true);
      
      // Clear fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Change password error:', error);
      setMessage('Failed to change password. Please re-login and try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-lg border p-8" style={{ borderColor: '#E2E8F0' }}>
          
          {/* Header */}
          <h2 className="text-lg font-bold mb-6" style={{ color: '#1a2b4a' }}>
            Change Password
          </h2>

          {/* Alert */}
          {message && (
            <div 
              className={`flex items-start gap-2 p-3 rounded-md mb-4 ${
                isSuccess ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              {isSuccess ? (
                <CheckCircle size={18} className="text-green-600 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-red-500 mt-0.5" />
              )}
              <p className={`text-sm flex-1 ${isSuccess ? 'text-green-700' : 'text-red-600'}`}>
                {message}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Current Password */}
            <PasswordField
              label="CURRENT PASSWORD"
              value={oldPassword}
              onChange={setOldPassword}
              show={showOld}
              toggle={() => setShowOld(!showOld)}
              placeholder="••••••••"
            />

            {/* New Password */}
            <PasswordField
              label="NEW PASSWORD"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              toggle={() => setShowNew(!showNew)}
              placeholder="Min. 6 characters"
            />

            {/* Confirm Password */}
            <PasswordField
              label="CONFIRM NEW PASSWORD"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
              placeholder="Re-enter password"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-md text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
              style={{ backgroundColor: '#0d2b5c' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PASSWORD FIELD COMPONENT
// ============================================
const PasswordField = ({ label, value, onChange, show, toggle, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: '#6B7280' }}>
      {label}
    </label>
    <div className="relative">
      <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-12 pr-12 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
        style={{ 
          backgroundColor: '#F8F9FA',
          border: '1px solid #E5E7EB'
        }}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        {show ? (
          <EyeOff size={20} style={{ color: '#9CA3AF' }} />
        ) : (
          <Eye size={20} style={{ color: '#9CA3AF' }} />
        )}
      </button>
    </div>
  </div>
);

export default ChangePassword;