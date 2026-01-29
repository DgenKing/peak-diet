import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authClient } from '../auth';

const DEVICE_ID_KEY = 'peak_diet_device_id';
const USER_KEY = 'peak_diet_user';

interface User {
  id: string;
  device_id?: string;
  username: string;
  email: string | null;
  is_anonymous: boolean;
  emailVerified: boolean;
}

interface UserContextType {
  user: User | null;
  userId: string | null;
  username: string | null;
  isAnonymous: boolean;
  isEmailVerified: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, username: string) => Promise<any>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initStarted = useRef(false);

  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    const initUser = async () => {
      try {
        // 1. Check Neon Auth Session
        const sessionResult = await authClient.getSession();
        
        if (sessionResult.data?.session && sessionResult.data?.user) {
          const neonUser = sessionResult.data.user;
          const userData: User = {
            id: neonUser.id,
            username: neonUser.name || neonUser.email?.split('@')[0] || 'User',
            email: neonUser.email || null,
            is_anonymous: false,
            emailVerified: !!neonUser.emailVerified
          };
          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
          setLoading(false);
          return;
        }

        // 2. Fallback to Guest/Anonymous User
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);
        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }

        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id: deviceId }),
        });

        if (!response.ok) throw new Error('Failed to initialize user');

        const userData = await response.json();
        const guestUser = { ...userData, emailVerified: false };
        setUser(guestUser);
        localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
      } catch (err) {
        console.error('User init error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Get full session after login
      const sessionResult = await authClient.getSession();
      if (!sessionResult.data?.user) throw new Error('Failed to get user session');

      const neonUser = sessionResult.data.user;
      const userData: User = {
        id: neonUser.id,
        username: neonUser.name || neonUser.email?.split('@')[0] || 'User',
        email: neonUser.email || null,
        is_anonymous: false,
        emailVerified: !!neonUser.emailVerified
      };

      // Sync user to custom users table (for existing users or in case of missed sync)
      try {
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: neonUser.id,
            email: userData.email,
            username: userData.username,
          }),
        });
      } catch (syncErr) {
        console.error('Failed to sync user to database:', syncErr);
        // Don't throw - login was successful
      }

      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return userData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      throw err;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setError(null);
    console.log('Starting registration for:', email);
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name: username,
      });

      console.log('Registration result:', result);

      if (result.error) {
        console.error('Registration error details:', result.error);
        throw new Error(result.error.message);
      }

      // Sync user to custom users table in database
      try {
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: result.data.user.id,
            email: email,
            username: username,
          }),
        });
      } catch (syncErr) {
        console.error('Failed to sync user to database:', syncErr);
        // Don't throw - auth user was created successfully
      }

      // Create unverified user state (similar to login flow)
      const userData: User = {
        id: result.data.user.id,
        username: username,
        email: email,
        is_anonymous: false,
        emailVerified: result.data.user.emailVerified || false, // Should be false until verified
      };

      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      return result.data;
    } catch (err) {
      console.error('Registration catch block:', err);
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      throw err;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    setError(null);
    try {
      const result = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Update user state to verified
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
      throw err;
    }
  };

  const forgetPassword = async (email: string) => {
    setError(null);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'forget-password'
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset code';
      setError(msg);
      throw err;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    setError(null);
    try {
      const result = await authClient.emailOtp.resetPassword({
        email,
        otp,
        password: newPassword
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password';
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }

    // Fallback to anonymous user
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId }),
      });
      if (response.ok) {
        const userData = await response.json();
        const guestUser = { ...userData, emailVerified: false };
        setUser(guestUser);
        localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
        return;
      }
    } catch (e) {
      console.error('Error re-initializing guest:', e);
    }

    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const isAnonymous = user ? (user.is_anonymous === true) : true;
  const isEmailVerified = user ? user.emailVerified : false;

  const value = {
    user,
    userId: user?.id || null,
    username: user?.username || null,
    isAnonymous,
    isEmailVerified,
    loading,
    error,
    login,
    register,
    verifyEmail,
    forgetPassword,
    resetPassword,
    logout,
  };


  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}