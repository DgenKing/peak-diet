import { useState, useEffect, useRef } from 'react';

const DEVICE_ID_KEY = 'peak_diet_device_id';
const USER_KEY = 'peak_diet_user';

interface User {
  id: string;
  device_id: string;
  username: string;
  email: string | null;
  is_anonymous: boolean;
}

export function useUser() {
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
    // If we already have a user, skip initialization
    if (user) {
      setLoading(false);
      return;
    }
    // Prevent StrictMode double-call
    if (initStarted.current) return;
    initStarted.current = true;

    const initUser = async () => {
      try {
        // Get or create device_id
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);
        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }

        // Register/fetch user from database
        const response = await fetch('/api/users/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id: deviceId }),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize user');
        }

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

  return {
    user,
    userId: user?.id || null,
    username: user?.username || null,
    loading,
    error,
  };
}
