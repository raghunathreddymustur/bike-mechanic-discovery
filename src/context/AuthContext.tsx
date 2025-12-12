import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';

interface User {
    id: string;
    identity: string;
    roles: string[];
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (identity: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const result = await authService.verifySession();
            if (result.valid && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }

    async function login(identity: string, password: string) {
        try {
            const result = await authService.login(identity, password);
            if (result.success && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error: any) {
            console.error('Login failed:', error);
            return { success: false, message: error.message || 'Login failed' };
        }
    }

    async function logout() {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    }

    function hasRole(role: string): boolean {
        return user?.roles.includes(role) || false;
    }

    const value: AuthContextType = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        hasRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
