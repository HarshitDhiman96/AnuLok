import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('anulok_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('anulok_token') || null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          localStorage.setItem('anulok_user', JSON.stringify(res.user));
        } catch (err) {
          console.warn('Session expired or invalid token', err);
          logout(false);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (identifier, password) => {
    try {
      const res = await api.login(identifier, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('anulok_token', res.token);
      localStorage.setItem('anulok_user', JSON.stringify(res.user));
      addToast(`Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('anulok_token', res.token);
      localStorage.setItem('anulok_user', JSON.stringify(res.user));
      addToast('Welcome to Anulok! Account created successfully.');
      return res.user;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      addToast('Password updated successfully.');
      return res;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.updateProfile(profileData);
      setUser(res.user);
      localStorage.setItem('anulok_user', JSON.stringify(res.user));
      addToast('Profile updated successfully.');
      return res.user;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const logout = (notify = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('anulok_token');
    localStorage.removeItem('anulok_user');
    if (notify) addToast('You have been logged out.');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        loading,
        login,
        register,
        logout,
        changePassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
