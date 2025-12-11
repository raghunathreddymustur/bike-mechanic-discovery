export interface User {
    id: string;
    identity: string; // Email or phone number
    passwordHash: string;
    roles: string[]; // Array of roles: ["ADMIN"] or ["customer"]
    createdAt?: string; // ISO date string (optional for compatibility)
    updatedAt?: string; // ISO date string (optional for compatibility)
}

export interface UserResponse {
    id: string;
    identity: string;
    roles: string[];
}

export interface LoginRequest {
    identity: string;
    password: string;
}

export interface RegisterRequest {
    identity: string;
    password: string;
    role?: string; // Optional, defaults to "customer"
}

export interface LoginResponse {
    token: string;
    user: UserResponse;
}

export interface VerifyResponse {
    valid: boolean;
    user?: UserResponse;
}
