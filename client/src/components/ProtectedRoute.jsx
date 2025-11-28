import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
    const { user, isLoggedIn } = useAuthContext();
    const location = useLocation();

    if (!isLoggedIn) {
        // Guardamos la ubicación actual en 'state.from'
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;