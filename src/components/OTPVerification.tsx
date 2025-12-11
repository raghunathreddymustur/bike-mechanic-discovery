import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface OTPVerificationProps {
    identity: string;
    onVerify: (otp: string) => void;
    onResend: () => void;
    loading?: boolean;
    error?: string;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
    identity,
    onVerify,
    onResend,
    loading = false,
    error
}) => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits entered
        if (index === 5 && value) {
            const fullOtp = newOtp.join('');
            if (fullOtp.length === 6) {
                onVerify(fullOtp);
            }
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (/^\d+$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            while (newOtp.length < 6) newOtp.push('');
            setOtp(newOtp);

            if (pastedData.length === 6) {
                onVerify(pastedData);
            }
        }
    };

    const handleResend = () => {
        setOtp(['', '', '', '', '', '']);
        setCountdown(60);
        setCanResend(false);
        onResend();
        inputRefs.current[0]?.focus();
    };

    const otpDigitsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        margin: '30px 0',
    };

    const otpInputStyle: React.CSSProperties = {
        width: '50px',
        height: '60px',
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        border: '2px solid',
        borderColor: error ? '#ff4444' : '#667eea',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.05)',
        color: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        backdropFilter: 'blur(10px)',
    };

    const resendButtonStyle: React.CSSProperties = {
        background: canResend ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: '600',
        cursor: canResend ? 'pointer' : 'not-allowed',
        opacity: canResend ? 1 : 0.5,
        transition: 'all 0.3s ease',
        marginTop: '20px',
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '18px', color: '#ffffff', marginBottom: '10px', fontWeight: '600' }}>
                🔐 Enter Verification Code
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
                We've sent a 6-digit code to:
                <div style={{ color: '#ffa726', fontWeight: '600', marginTop: '5px' }}>{identity}</div>
            </div>

            <div style={otpDigitsStyle}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        disabled={loading}
                        style={{
                            ...otpInputStyle,
                            transform: digit ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#ffa726';
                            e.target.style.boxShadow = '0 0 20px rgba(255,167,38,0.4)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = error ? '#ff4444' : '#667eea';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                ))}
            </div>

            {error && (
                <div style={{
                    color: '#ff4444',
                    fontSize: '14px',
                    marginTop: '-10px',
                    marginBottom: '20px',
                    background: 'rgba(255,68,68,0.1)',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,68,68,0.3)',
                }}>
                    ❌ {error}
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    style={resendButtonStyle}
                    onMouseEnter={(e) => {
                        if (canResend) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 5px 20px rgba(102,126,234,0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {canResend ? '🔄 Resend OTP' : `Resend in ${countdown}s`}
                </button>
            </div>

            {loading && (
                <div style={{
                    marginTop: '20px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                }}>
                    ⏳ Verifying...
                </div>
            )}
        </div>
    );
};
