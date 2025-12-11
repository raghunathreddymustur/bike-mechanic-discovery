import { OTPModel } from '../models/OTPModel.js';

/**
 * Generate a 6-digit OTP code
 */
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create and store OTP for an identity (email or phone)
 */
export const createOTP = async (identity: string): Promise<string> => {
    // Delete any existing OTPs for this identity
    await OTPModel.deleteMany({ identity: identity.toLowerCase() });

    // Generate new OTP
    const code = generateOTP();

    // Store in database with TTL
    await OTPModel.create({
        identity: identity.toLowerCase(),
        code,
        attempts: 0,
    });

    console.log(`🔐 OTP created for ${identity}: ${code}`);
    return code;
};

/**
 * Verify OTP code for an identity
 */
export const verifyOTP = async (
    identity: string,
    code: string
): Promise<{ valid: boolean; error?: string }> => {
    const otp = await OTPModel.findOne({
        identity: identity.toLowerCase()
    });

    if (!otp) {
        return { valid: false, error: 'OTP not found or expired' };
    }

    // Check if too many attempts
    if (otp.attempts >= 3) {
        await OTPModel.deleteOne({ _id: otp._id });
        return { valid: false, error: 'Too many attempts. Please request a new OTP' };
    }

    // Check if OTP matches
    if (otp.code !== code) {
        // Increment attempts
        otp.attempts += 1;
        await otp.save();
        return { valid: false, error: 'Invalid OTP code' };
    }

    // OTP is valid - delete it
    await OTPModel.deleteOne({ _id: otp._id });
    return { valid: true };
};

/**
 * Check rate limiting for OTP requests
 * Returns true if rate limit exceeded
 */
export const checkOTPRateLimit = async (identity: string): Promise<boolean> => {
    // Count OTPs created in last 15 minutes for this identity
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const count = await OTPModel.countDocuments({
        identity: identity.toLowerCase(),
        createdAt: { $gte: fifteenMinutesAgo },
    });

    // Allow max 3 OTPs per 15 minutes
    return count >= 3;
};
