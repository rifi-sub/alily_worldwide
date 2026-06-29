import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

interface UserData {
  id: string;
  email: string;
  username: string;
  name: string | null;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (loginValue: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('worldwide_user_token');
  });
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('worldwide_user_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        setUser(res.data.user);
        setToken(savedToken);
      } catch {
        // Token invalid or expired
        localStorage.removeItem('worldwide_user_token');
        localStorage.removeItem('worldwide_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (loginValue: string, password: string) => {
    const res = await api.post('/auth/login', { login: loginValue, password });
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('worldwide_user_token', newToken);
    localStorage.setItem('worldwide_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  const register = useCallback(async (email: string, username: string, password: string, name?: string) => {
    const res = await api.post('/auth/register', { email, username, password, name });
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('worldwide_user_token', newToken);
    localStorage.setItem('worldwide_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('worldwide_user_token');
    localStorage.removeItem('worldwide_user');
    localStorage.removeItem('alilly_worldwide_user'); // clean up old key
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<UserData>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
