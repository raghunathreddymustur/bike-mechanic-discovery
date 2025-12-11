import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
    identity: string; // Email or phone number
    code: string; // 6-digit OTP
    attempts: number; // Track verification attempts
    createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
    {
        identity: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            length: 6,
        },
        attempts: {
            type: Number,
            default: 0,
            max: 3, // Maximum 3 attempts
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300, // TTL: Expires after 5 minutes (300 seconds)
        },
    }
);

// Create compound index on identity and code for fast verification
otpSchema.index({ identity: 1, code: 1 });

// Create index on identity for cleanup and resend operations
otpSchema.index({ identity: 1 });

export const OTPModel = mongoose.model<IOTP>('OTP', otpSchema);
