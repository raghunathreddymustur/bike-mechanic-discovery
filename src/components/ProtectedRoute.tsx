import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
    redirectTo?: string;
}

export default function ProtectedRoute({
    children,
    requiredRole,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: '#fff'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(255,255,255,0.3)',
                        borderTop: '4px solid #ff6b35',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p>Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role if required
    if (requiredRole && user && !user.roles.includes(requiredRole)) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: '#fff'
            }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🚫</h1>
                    <h2 style={{ marginBottom: '10px' }}>Access Denied</h2>
                    <p style={{ color: '#aaa', marginBottom: '30px' }}>
                        You don't have permission to access this page.
                    </p>
                    <a href="/" style={{
                        display: 'inline-block',
                        padding: '12px 30px',
                        background: '#ff6b35',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '600'
                    }}>
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    // Authenticated and authorized - render children
    return <>{children}</>;
}
