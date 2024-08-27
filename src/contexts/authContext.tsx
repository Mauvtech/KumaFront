import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getCurrentUser, isTokenExpired, logout as authLogout} from '../services/auth/authService';
import {AuthenticatedUser} from '../services/auth/userModel';


export interface AuthContextType {
    setUser: (user: AuthenticatedUser | null) => void;
    user: AuthenticatedUser | null;
    loading: boolean;
    login: (userData: AuthenticatedUser) => void;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [loading, setLoading] = useState(true);

    const login = (userData: AuthenticatedUser) => {
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
        <AuthContext.Provider value={{setUser, user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
