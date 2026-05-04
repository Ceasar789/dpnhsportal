// ============================================
// FILE: src/context/AuthContext.jsx
// PURPOSE: Firebase Authentication Context
// Handles user authentication, role management, and state persistence
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  updateEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // LISTEN TO AUTH STATE CHANGES
  // ============================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsAuthenticated(true);
          
          // Get ID token result to access custom claims (role)
          const idTokenResult = await firebaseUser.getIdTokenResult();
          
          // Get user data with role from custom claims or Firestore
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            photoURL: firebaseUser.photoURL || null,
            emailVerified: firebaseUser.emailVerified,
            // Role is determined from custom claims (set by admin SDK)
            role: idTokenResult.claims.role || 'student',
          };
          
          setUserData(userData);
        } else {
          setUser(null);
          setUserData(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ============================================
  // LOGIN WITH EMAIL AND PASSWORD
  // ============================================
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Force refresh to get custom claims with role
      await result.user.getIdTokenResult(true);
      
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // REGISTER NEW USER
  // ============================================
  const register = async (email, password, displayName = '') => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Set display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // Send email verification
      await sendEmailVerification(result.user);
      
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SEND PASSWORD RESET EMAIL
  // ============================================
  const sendPasswordReset = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ============================================
  // SEND EMAIL VERIFICATION
  // ============================================
  const sendVerificationEmail = async () => {
    try {
      setError(null);
      if (user) {
        await sendEmailVerification(user);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ============================================
  // UPDATE USER PROFILE
  // ============================================
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      
      if (user) {
        await updateProfile(user, updates);
        
        if (updates.displayName) {
          setUserData(prev => ({
            ...prev,
            name: updates.displayName
          }));
        }
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ============================================
  // ROLE CHECKING HELPER FUNCTIONS
  // ============================================
  const hasRole = (role) => {
    return userData?.role === role;
  };

  const isStudent = () => userData?.role === 'student';
  const isTeacher = () => userData?.role === 'teacher';
  const isFaculty = () => userData?.role === 'faculty';
  const isRegistrar = () => userData?.role === 'registrar';
  const isAdmin = () => userData?.role === 'main_admin';

  const hasAnyRole = (roles = []) => {
    return roles.includes(userData?.role);
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value = {
    // User data
    user,
    userData,
    loading,
    isAuthenticated,
    error,
    
    // Auth methods
    login,
    register,
    logout,
    sendPasswordReset,
    sendVerificationEmail,
    updateUserProfile,
    
    // Role checking
    hasRole,
    isStudent,
    isTeacher,
    isFaculty,
    isRegistrar,
    isAdmin,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// USE AUTH HOOK
// ============================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};