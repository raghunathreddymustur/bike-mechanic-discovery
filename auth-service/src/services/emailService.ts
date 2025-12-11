import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

/**
 * Send OTP via email
 */
export const sendEmailOTP = async (email: string, otp: string): Promise<void> => {
    // If email not enabled, log to console
    if (!config.emailEnabled || !config.smtpUser || !config.smtpPassword) {
        console.log(`📧 EMAIL OTP (Console Mode) for ${email}: ${otp}`);
        console.log(`
╔════════════════════════════════════════╗
║        OTP VERIFICATION EMAIL          ║
╠════════════════════════════════════════╣
║  To: ${email.padEnd(33)}║
║  OTP Code: ${otp.padEnd(27)}║
║  Valid for: 5 minutes                  ║
╚════════════════════════════════════════╝
    `);
        return;
    }

    try {
        // Create transporter with Brevo SMTP
        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort,
            secure: false, // Use STARTTLS
            auth: {
                user: config.smtpUser,
                pass: config.smtpPassword,
            },
        });

        // HTML email template
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 32px; font-weight: bold; color: #667eea; }
    .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 36px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 30px 0; }
    .message { color: #333; line-height: 1.6; text-align: center; }
    .expiry { color: #666; font-size: 14px; text-align: center; margin-top: 20px; }
    .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🛵 Bike Mechanic Discovery</div>
    </div>
    <div class="message">
      <h2>Your Verification Code</h2>
      <p>Use this code to complete your registration:</p>
    </div>
    <div class="otp-box">${otp}</div>
    <div class="expiry">⏱️ This code will expire in 5 minutes</div>
    <div class="footer">
      <p>If you didn't request this code, please ignore this email.</p>
      <p>&copy; 2024 Bike Mechanic Discovery. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

        // Send email
        await transporter.sendMail({
            from: `"Bike Mechanic Discovery" <${config.emailFrom}>`,
            to: email,
            subject: `Your OTP Code: ${otp}`,
            html: htmlContent,
            text: `Your OTP code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`,
        });

        console.log(`✅ Email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error);
        // Fallback to console
        console.log(`📧 EMAIL OTP (Fallback) for ${email}: ${otp}`);
    }
};
