import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getIdentityErrorMessage } from '../utils/validators';

export default function LoginPage() {
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // If already authenticated, redirect to home
    React.useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        // Client-side validation
        const identityError = getIdentityErrorMessage(identity);
        if (identityError) {
            setError(identityError);
            return;
        }

        if (!password) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);

        try {
            const result = await login(identity, password);
            if (result.success) {
                const from = (location.state as any)?.from?.pathname || '/';
                navigate(from, { replace: true });
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(66,153,225,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)'
            }}></div>

            <div style={{
                width: '100%',
                maxWidth: '450px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '50px 40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Logo/Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 20px',
                        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '40px',
                        boxShadow: '0 10px 30px rgba(255,107,53,0.3)'
                    }}>
                        🔐
                    </div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#1a1a2e',
                        marginBottom: '8px'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        color: '#666',
                        fontSize: '15px'
                    }}>
                        Sign in to access your account
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Identity Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Email or Phone Number
                        </label>
                        <input
                            type="text"
                            value={identity}
                            onChange={(e) => setIdentity(e.target.value)}
                            placeholder="example@gmail.com or 9876543210"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                fontSize: '15px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '12px',
                                outline: 'none',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                style={{
                                    width: '100%',
                                    padding: '14px 50px 14px 16px',
                                    fontSize: '15px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    padding: '5px'
                                }}
                            >
                                {showPassword ? '👁️' : '🔒'}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '8px',
                            color: '#c33',
                            fontSize: '14px',
                            marginBottom: '24px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#fff',
                            background: loading
                                ? 'linear-gradient(135deg, #999 0%, #777 100%)'
                                : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 15px rgba(255,107,53,0.4)',
                            marginBottom: '20px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,53,0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,107,53,0.4)';
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* Signup Link */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Don't have an account? <strong style={{ color: '#ff6b35' }}>Sign Up</strong>
                        </button>
                    </div>

                    {/* Helper Text */}
                    <div style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        color: '#666'
                    }}>
                        <p>
                            <strong>Test Credentials:</strong>
                            <br />
                            Admin: admin@gmail.com / admin123
                        </p>
                    </div>
                </form>
            </div>

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
}
