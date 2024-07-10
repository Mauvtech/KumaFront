import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logout as authLogout, isTokenExpired } from '../services/authService';

interface User {
  token: string;
  username: string;
  role: string;
  _id: string;
}

export interface AuthContextType {
  setUser: (user: User | null) => void;
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: User) => {
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    authLogout();
    setUser(null);
    window.localStorage.removeItem('user');
    setLoading(false);
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user && isTokenExpired(user.token)) {
      logout();
    } else {
      setUser(user);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ setUser, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
