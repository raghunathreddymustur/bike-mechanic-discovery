import { Router } from 'express';
import { register, login, verify, logout, health, sendOTP, verifyOTPAndRegister } from '../controllers/authController.js';

const router = Router();

// Health check
router.get('/health', health);

// Authentication endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify);
router.post('/logout', logout);

// OTP endpoints
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPAndRegister);

export default router;
