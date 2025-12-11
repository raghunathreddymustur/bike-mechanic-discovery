import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { UserResponse } from '../models/User.js';

interface TokenPayload {
    userId: string;
    identity: string;
    roles: string[];
}

/**
 * Generates a JWT token for the authenticated user
 * @param user - User data to encode in token
 * @returns JWT token string
 */
export function generateToken(user: UserResponse): string {
    const payload: TokenPayload = {
        userId: user.id,
        identity: user.identity,
        roles: user.roles
    };

    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiry
    } as jwt.SignOptions);
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Extracts token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
}
