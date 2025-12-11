import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTPAndRegister } from '../services/authService';
import { OTPVerification } from '../components/OTPVerification';
import { getIdentityType } from '../utils/validators';

export default function OTPTestPage() {
    const [step, setStep] = useState('identity');
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSendOTP(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const identityType = getIdentityType(identity);
        if (identityType === 'unknown') {
            setError('Please enter a valid email or phone number');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        const result = await sendOTP(identity);
        setLoading(false);
        if (result.success) {
            setStep('otp');
        } else {
            setError(result.message || 'Failed to send OTP');
        }
    }

    async function handleVerifyOTP(otp: string) {
        setLoading(true);
        setError('');
        const result = await verifyOTPAndRegister(identity, otp, password);
        setLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Invalid OTP');
        }
    }

    async function handleResendOTP() {
        setError('');
        const result = await sendOTP(identity);
        if (!result.success) {
            setError(result.message || 'Failed to resend OTP');
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '500px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>OTP Registration</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>{step === 'identity' ? 'Enter details to register' : 'Verify your identity'}</p>
                </div>
                {step === 'identity' ? (
                    <form onSubmit={handleSendOTP}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Email or Phone</label>
                            <input type="text" value={identity} onChange={(e) => setIdentity(e.target.value)} placeholder="test@gmail.com or 9876543210" style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.4)', borderRadius: '8px', color: '#a0b3ff', fontSize: '13px', marginBottom: '24px' }}>💡 Check auth service terminal for OTP code</div>
                        {error && <div style={{ padding: '12px', background: 'rgba(255,68,68,0.2)', border: '1px solid rgba(255,68,68,0.4)', borderRadius: '8px', color: '#ff4444', fontSize: '14px', marginBottom: '24px' }}>{error}</div>}
                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', color: '#fff', background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '20px' }}>{loading ? 'Sending...' : 'Send OTP'}</button>
                        <div style={{ textAlign: 'center' }}><button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px' }}>Back to Login</button></div>
                    </form>
                ) : (
                    <OTPVerification identity={identity} onVerify={handleVerifyOTP} onResend={handleResendOTP} loading={loading} error={error} />
                )}
            </div>
        </div>
    );
}
