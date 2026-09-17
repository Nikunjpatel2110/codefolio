import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem('codefolio_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/profile/me');
      setUser(data);
    } catch (err) {
      localStorage.removeItem('codefolio_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = async (emailOrUsername, password) => {
    const { data } = await api.post('/auth/login', { emailOrUsername, password });
    localStorage.setItem('codefolio_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('codefolio_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('codefolio_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get('/profile/me');
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
