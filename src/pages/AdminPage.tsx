import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px 30px',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: '5px'
                    }}>
                        🛠️ Admin Dashboard
                    </h1>
                    <p style={{ color: '#aaa', fontSize: '14px' }}>
                        Logged in as: <strong style={{ color: '#ff6b35' }}>{user?.identity}</strong>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            background: 'rgba(102, 126, 234, 0.2)',
                            border: '2px solid #667eea',
                            color: '#667eea',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#667eea';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                            e.currentTarget.style.color = '#667eea';
                        }}
                    >
                        🏠 Back to Home
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '12px 24px',
                            background: 'rgba(255,107,53,0.2)',
                            border: '2px solid #ff6b35',
                            color: '#ff6b35',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ff6b35';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,107,53,0.2)';
                            e.currentTarget.style.color = '#ff6b35';
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {[
                    { icon: '👨‍🔧', label: 'Total Mechanics', value: '24' },
                    { icon: '✅', label: 'Verified', value: '18' },
                    { icon: '⏳', label: 'Pending', value: '6' },
                    { icon: '⭐', label: 'Avg Rating', value: '4.5' }
                ].map((stat, index) => (
                    <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '25px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'transform 0.3s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>{stat.icon}</div>
                        <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '5px' }}>{stat.label}</div>
                        <div style={{ color: '#fff', fontSize: '28px', fontWeight: '700' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '2px solid rgba(255,107,53,0.5)'
                }}>
                    Admin Controls
                </h2>

                <div style={{
                    display: 'grid',
                    gap: '15px'
                }}>
                    {[
                        { icon: '👥', title: 'Manage Users', desc: 'View and manage all registered users' },
                        { icon: '🔍', title: 'Review Applications', desc: 'Approve or reject mechanic applications' },
                        { icon: '📊', title: 'View Analytics', desc: 'Check platform statistics and reports' },
                        { icon: '⚙️', title: 'System Settings', desc: 'Configure application settings' }
                    ].map((item, index) => (
                        <div key={index} style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '20px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,107,53,0.1)';
                                e.currentTarget.style.borderColor = '#ff6b35';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }}
                        >
                            <div style={{ fontSize: '32px' }}>{item.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
                                    {item.title}
                                </div>
                                <div style={{ color: '#aaa', fontSize: '13px' }}>
                                    {item.desc}
                                </div>
                            </div>
                            <div style={{ color: '#ff6b35', fontSize: '20px' }}>→</div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: 'rgba(255,107,53,0.1)',
                    border: '1px solid rgba(255,107,53,0.3)',
                    borderRadius: '12px',
                    color: '#fff'
                }}>
                    <strong style={{ color: '#ff6b35' }}>🎉 Admin Access Granted!</strong>
                    <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#ccc' }}>
                        You have full administrative privileges. This page is only accessible to users with the ADMIN role.
                    </p>
                </div>
            </div>
        </div>
    );
}
