import axios from 'axios';
import { config } from '../config/config.js';

/**
 * Send OTP via SMS
 */
export const sendSMSOTP = async (phone: string, otp: string): Promise<void> => {
    // If SMS not enabled, log to console
    if (!config.smsEnabled || !config.textbeeUrl || !config.textbeeApiKey) {
        console.log(`📱 SMS OTP (Console Mode) for ${phone}: ${otp}`);
        console.log(`
╔════════════════════════════════════════╗
║          OTP VERIFICATION SMS          ║
╠════════════════════════════════════════╣
║  To: ${phone.padEnd(33)}║
║  Message:                              ║
║                                        ║
║  Your Bike Mechanic Discovery          ║
║  verification code is: ${otp}          ║
║                                        ║
║  Valid for 5 minutes.                  ║
║  Do not share this code.               ║
╚════════════════════════════════════════╝
    `);
        return;
    }

    try {
        // TextBee API integration
        const message = `Your Bike Mechanic Discovery verification code is: ${otp}. Valid for 5 minutes.`;

        const response = await axios.post(
            `${config.textbeeUrl}/api/send`,
            {
                recipient: phone,
                message: message,
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.textbeeApiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log(`✅ SMS sent to ${phone}:`, response.data);
    } catch (error) {
        console.error(`❌ Failed to send SMS to ${phone}:`, error);
        // Fallback to console
        console.log(`📱 SMS OTP (Fallback) for ${phone}: ${otp}`);
    }
};

/**
 * Normalize phone number to standard format
 * Removes +91, 0 prefix, spaces, and hyphens
 */
export const normalizePhoneNumber = (phone: string): string => {
    let normalized = phone.replace(/[\s-]/g, ''); // Remove spaces and hyphens

    // Remove country code if present
    if (normalized.startsWith('+91')) {
        normalized = normalized.substring(3);
    } else if (normalized.startsWith('91') && normalized.length === 12) {
        normalized = normalized.substring(2);
    } else if (normalized.startsWith('0') && normalized.length === 11) {
        normalized = normalized.substring(1);
    }

    return normalized;
};
