import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService.js';
import { generateToken, verifyToken, extractTokenFromHeader } from '../services/tokenService.js';
import { LoginRequest, RegisterRequest } from '../models/User.js';

/**
 * POST /api/auth/register
 * Registers a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
    try {
        const data: RegisterRequest = req.body;

        if (!data.identity || !data.password) {
            res.status(400).json({
                success: false,
                message: 'Identity and password are required.'
            });
            return;
        }

        const result = await registerUser(data);

        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration.'
        });
    }
}

/**
 * POST /api/auth/login
 * Authenticates a user and returns JWT token
 */
export async function login(req: Request, res: Response): Promise<void> {
    try {
        const data: LoginRequest = req.body;

        if (!data.identity || !data.password) {
            res.status(400).json({
                success: false,
                message: 'Identity and password are required.'
            });
            return;
        }

        const result = await loginUser(data);

        if (!result.success || !result.user) {
            res.status(401).json({
                success: false,
                message: result.message
            });
            return;
        }

        // Generate JWT token
        const token = generateToken(result.user);

        res.status(200).json({
            success: true,
            token,
            user: result.user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login.'
        });
    }
}

/**
 * POST /api/auth/verify
 * Verifies a JWT token and returns user data
 */
export function verify(req: Request, res: Response): void {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            res.status(401).json({
                valid: false,
                message: 'No token provided.'
            });
            return;
        }

        const payload = verifyToken(token);

        if (!payload) {
            res.status(401).json({
                valid: false,
                message: 'Invalid or expired token.'
            });
            return;
        }

        res.status(200).json({
            valid: true,
            user: {
                id: payload.userId,
                identity: payload.identity,
                roles: payload.roles
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            valid: false,
            message: 'Internal server error during verification.'
        });
    }
}

/**
 * POST /api/auth/logout
 * Logs out a user (client-side token removal, server just validates)
 */
export function logout(req: Request, res: Response): void {
    try {
        // In JWT stateless approach, logout is primarily client-side
        // We just validate the token exists
        const token = extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            res.status(200).json({
                success: true,
                message: 'Already logged out.'
            });
            return;
        }

        // Optionally verify token is valid before logout
        const payload = verifyToken(token);

        res.status(200).json({
            success: true,
            message: 'Logout successful.'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during logout.'
        });
    }
}

/**
 * GET /api/auth/health
 * Health check endpoint
 */
export function health(req: Request, res: Response): void {
    res.status(200).json({
        status: 'ok',
        service: 'authentication-service',
        timestamp: new Date().toISOString()
    });
}

// Import OTP services
import { createOTP, verifyOTP, checkOTPRateLimit } from '../services/otpService.js';
import { sendEmailOTP } from '../services/emailService.js';
import { sendSMSOTP } from '../services/smsService.js';
import { isValidGmail, isValidIndianPhone } from '../utils/validators.js';

/**
 * POST /api/auth/send-otp
 * Send OTP to email or phone
 */
export async function sendOTP(req: Request, res: Response): Promise<void> {
    try {
        const { identity } = req.body;

        if (!identity) {
            res.status(400).json({
                success: false,
                message: 'Identity (email or phone) is required.'
            });
            return;
        }

        // Validate identity format
        const isEmail = isValidGmail(identity);
        const isPhone = isValidIndianPhone(identity);

        if (!isEmail && !isPhone) {
            res.status(400).json({
                success: false,
                message: 'Invalid email or phone number format.'
            });
            return;
        }

        // Check rate limiting
        const rateLimited = await checkOTPRateLimit(identity);
        if (rateLimited) {
            res.status(429).json({
                success: false,
                message: 'Too many OTP requests. Please try again in 15 minutes.'
            });
            return;
        }

        // Generate and store OTP
        const otp = await createOTP(identity);

        // Send OTP via email or SMS
        if (isEmail) {
            await sendEmailOTP(identity, otp);
        } else {
            await sendSMSOTP(identity, otp);
        }

        res.status(200).json({
            success: true,
            message: `OTP sent to ${isEmail ? 'email' : 'phone'}`,
            identity: identity
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while sending OTP.'
        });
    }
}

/**
 * POST /api/auth/verify-otp
 * Verify OTP and complete registration
 */
export async function verifyOTPAndRegister(req: Request, res: Response): Promise<void> {
    try {
        const { identity, otp, password } = req.body;

        if (!identity || !otp || !password) {
            res.status(400).json({
                success: false,
                message: 'Identity, OTP, and password are required.'
            });
            return;
        }

        // Verify OTP
        const otpResult = await verifyOTP(identity, otp);

        if (!otpResult.valid) {
            res.status(400).json({
                success: false,
                message: otpResult.error || 'Invalid OTP'
            });
            return;
        }

        // OTP is valid, now register the user
        const registerData: RegisterRequest = {
            identity,
            password,
            role: req.body.role || 'customer' // Use role from request or default to customer
        };

        const result = await registerUser(registerData);

        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        // Auto-login after registration
        if (result.user) {
            const token = generateToken(result.user);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                token,
                user: result.user
            });
        } else {
            res.status(201).json(result);
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during OTP verification.'
        });
    }
}
