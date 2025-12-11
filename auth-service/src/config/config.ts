import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    databasePath: process.env.DATABASE_PATH || './auth.db',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',

    // MongoDB configuration
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/bike-mechanic-auth',

    // OTP configuration
    otpExpiry: parseInt(process.env.OTP_EXPIRY || '300'), // 5 minutes in seconds

    // Email configuration (Brevo)
    emailEnabled: process.env.EMAIL_ENABLED === 'true',
    smtpHost: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASSWORD || '',
    emailFrom: process.env.EMAIL_FROM || 'noreply@bikemechanic.com',

    // SMS configuration (TextBee)
    smsEnabled: process.env.SMS_ENABLED === 'true',
    textbeeUrl: process.env.TEXTBEE_URL || '',
    textbeeApiKey: process.env.TEXTBEE_API_KEY || '',
};
