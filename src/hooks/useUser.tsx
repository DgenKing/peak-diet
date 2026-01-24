import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const DEVICE_ID_KEY = 'peak_diet_device_id';
const USER_KEY = 'peak_diet_user';

interface User {
  id: string;
  device_id: string;
  username: string;
  email: string | null;
  is_anonymous: boolean;
}

interface UserContextType {
  user: User | null;
  userId: string | null;
  username: string | null;
  isAnonymous: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, username: string) => Promise<User>;
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
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState<string | null>(null);

  const initStarted = useRef(false);

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }
    if (initStarted.current) return;
    initStarted.current = true;

    const initUser = async () => {
      try {
        const authResponse = await fetch('/api/auth?action=me');
        if (authResponse.ok) {
          const userData = await authResponse.json();
          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
          return;
        }

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
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } catch (err) {
        console.error('User init error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [user]);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      throw err;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setError(null);
    try {
      const deviceId = localStorage.getItem(DEVICE_ID_KEY);
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'register', 
          email, 
          password, 
          username,
          device_id: deviceId 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    localStorage.removeItem(USER_KEY);
    initStarted.current = false;
  };

  const isAnonymous = user ? (user.is_anonymous === true) : true;

  const value = {
    user,
    userId: user?.id || null,
    username: user?.username || null,
    isAnonymous,
    loading,
    error,
    login,
    register,
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