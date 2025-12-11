const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001';
const TOKEN_KEY = 'auth_token';

interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string;
        identity: string;
        roles: string[];
    };
    message?: string;
}

interface VerifyResponse {
    valid: boolean;
    user?: {
        id: string;
        identity: string;
        roles: string[];
    };
    message?: string;
}

/**
 * Login with identity (email or phone) and password
 */
export async function login(identity: string, password: string): Promise<LoginResponse> {
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identity, password }),
        });

        const data = await response.json();

        if (data.success && data.token) {
            // Store token in localStorage
            localStorage.setItem(TOKEN_KEY, data.token);
            return data;
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Failed to connect to authentication service',
        };
    }
}

/**
 * Verify current session and get user data
 */
export async function verifySession(): Promise<VerifyResponse> {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return { valid: false };
        }

        const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Verify session error:', error);
        return { valid: false };
    }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            await fetch(`${AUTH_SERVICE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear token locally
        localStorage.removeItem(TOKEN_KEY);
    }
}

/**
 * Get current user from token (without API call)
 */
export function getCurrentUser(): { id: string; identity: string; roles: string[] } | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
        // Decode JWT (basic decode, not verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.userId,
            identity: payload.identity,
            roles: payload.roles || [],
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: string): boolean {
    const user = getCurrentUser();
    return user?.roles.includes(role) || false;
}

/**
 * Send OTP to email or phone for registration
 */
export async function sendOTP(identity: string): Promise<{ success: boolean; message?: string }> {
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identity }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Send OTP error:', error);
        return {
            success: false,
            message: 'Failed to send OTP',
        };
    }
}

/**
 * Verify OTP and complete registration
 */
export async function verifyOTPAndRegister(identity: string, otp: string, password: string, role?: string): Promise<LoginResponse> {
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identity, otp, password, role }),
        });

        const data = await response.json();

        if (data.success && data.token) {
            // Store token in localStorage
            localStorage.setItem(TOKEN_KEY, data.token);
            return data;
        }

        return data;
    } catch (error) {
        console.error('Verify OTP error:', error);
        return {
            success: false,
            message: 'Failed to verify OTP',
        };
    }
}
