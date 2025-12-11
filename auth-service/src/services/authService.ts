import { v4 as uuidv4 } from 'uuid';
import { findUserByIdentity, findUserById, createUser } from '../db/database.js';
import { User, UserResponse, LoginRequest, RegisterRequest } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { isValidIdentity, normalizePhone, getIdentityType } from '../utils/validators.js';

/**
 * Registers a new user in the system
 * @param data - Registration data
 * @returns Created user or error
 */
export async function registerUser(data: RegisterRequest): Promise<{ success: boolean; message: string; user?: UserResponse }> {
    const { identity, password, role = 'customer' } = data;

    // Validate identity format
    if (!isValidIdentity(identity)) {
        return {
            success: false,
            message: 'Invalid identity. Must be a Gmail address or valid Indian phone number.'
        };
    }

    // Normalize phone numbers
    const normalizedIdentity = getIdentityType(identity) === 'phone'
        ? normalizePhone(identity)
        : identity.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await findUserByIdentity(normalizedIdentity);
    if (existingUser) {
        return {
            success: false,
            message: 'User with this identity already exists.'
        };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = uuidv4();
    const now = new Date().toISOString();
    const roles = JSON.stringify([role]);

    const newUser: User = {
        id: userId,
        identity: normalizedIdentity,
        passwordHash,
        roles: [role],
        createdAt: now,
        updatedAt: now
    };

    await createUser(newUser);

    return {
        success: true,
        message: 'User registered successfully',
        user: {
            id: userId,
            identity: normalizedIdentity,
            roles: [role]
        }
    };
}

/**
 * Authenticates a user with identity and password
 * @param data - Login credentials
 * @returns User data if successful, error otherwise
 */
export async function loginUser(data: LoginRequest): Promise<{ success: boolean; message: string; user?: UserResponse }> {
    const { identity, password } = data;

    // Validate identity format
    if (!isValidIdentity(identity)) {
        return {
            success: false,
            message: 'Invalid identity format. Must be a Gmail address or valid Indian phone number.'
        };
    }

    // Normalize phone numbers
    const normalizedIdentity = getIdentityType(identity) === 'phone'
        ? normalizePhone(identity)
        : identity.trim().toLowerCase();

    // Find user
    const user = await findUserByIdentity(normalizedIdentity);

    if (!user) {
        return {
            success: false,
            message: 'Invalid credentials.'
        };
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
        return {
            success: false,
            message: 'Invalid credentials.'
        };
    }



    return {
        success: true,
        message: 'Login successful',
        user: {
            id: user.id,
            identity: user.identity,
            roles: user.roles
        }
    };
}

/**
 * Gets user by ID
 * @param userId - User ID
 * @returns User data or null
 */
export async function getUserById(userId: string): Promise<UserResponse | null> {
    const user = await findUserById(userId);

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        identity: user.identity,
        roles: user.roles
    };
}

/**
 * Checks if a user has a specific role
 * @param userId - User ID
 * @param role - Role to check
 * @returns true if user has the role
 */
export async function userHasRole(userId: string, role: string): Promise<boolean> {
    const user = await getUserById(userId);
    if (!user) return false;

    return user.roles.includes(role);
}
