import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

interface ProtectedRouteProps {
    element: React.ReactNode;
    path: string;
    roles?: string[]; // Optionnel : Pour des rôles spécifiques
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roles, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Chargement...</div>; // Vous pouvez mettre un spinner de chargement ici
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />; // Ou une autre page, par exemple une page de "Non autorisé"
    }

    return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
