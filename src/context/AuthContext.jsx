// ============================================
// FILE: src/context/AuthContext.jsx
// PURPOSE: Supabase Authentication Context
// Replaces: Firebase Auth with Supabase Auth + profiles table
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // FETCH PROFILE FROM SUPABASE profiles TABLE
  // ============================================
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // ============================================
  // LISTEN TO AUTH STATE CHANGES
  // ============================================
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          setUserData({
            uid: session.user.id,
            email: session.user.email,
            name: profile.name || session.user.email,
            photoURL: profile.photo_url || null,
            emailVerified: session.user.email_confirmed_at != null,
            role: profile.role || 'student',
            department: profile.department || null,
            status: profile.status || 'Active',
          });
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          const profile = await fetchProfile(session.user.id);
          if (profile) {
            setUserData({
              uid: session.user.id,
              email: session.user.email,
              name: profile.name || session.user.email,
              photoURL: profile.photo_url || null,
              emailVerified: session.user.email_confirmed_at != null,
              role: profile.role || 'student',
              department: profile.department || null,
              status: profile.status || 'Active',
            });
          }
        } else {
          setUser(null);
          setUserData(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ============================================
  // LOGIN WITH EMAIL AND PASSWORD
  // ============================================
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data.user;
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
  const register = async (email, password, displayName = '', role = 'student') => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName,
            role: role,
          },
        },
      });

      if (error) throw error;
      return data.user;
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ============================================
  // UPDATE PASSWORD (after reset)
  // ============================================
  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
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
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email,
      });
      if (error) throw error;
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
      if (!user) return;

      // Update profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.displayName || userData?.name,
          photo_url: updates.photoURL || userData?.photoURL,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUserData(prev => ({
        ...prev,
        name: updates.displayName || prev.name,
        photoURL: updates.photoURL || prev.photoURL,
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ============================================
  // ROLE CHECKING HELPER FUNCTIONS
  // ============================================
  const hasRole = (role) => userData?.role === role;
  const isStudent = () => userData?.role === 'student';
  const isTeacher = () => userData?.role === 'teacher';
  const isFaculty = () => userData?.role === 'faculty';
  const isRegistrar = () => userData?.role === 'registrar';
  const isAdmin = () => userData?.role === 'main_admin';
  const hasAnyRole = (roles = []) => roles.includes(userData?.role);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value = {
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
    updatePassword,
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

    // Supabase client (for direct queries in components)
    supabase,
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