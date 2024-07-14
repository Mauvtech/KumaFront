import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

interface ProtectedRouteProps {
    element: ReactNode;
    allowedRoles?: string[]; //todo suppr nullabilité
}

function ProtectedRoute({ element, allowedRoles }: ProtectedRouteProps){
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return <>{element}</>;
};

export default ProtectedRoute;
