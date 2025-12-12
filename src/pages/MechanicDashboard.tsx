import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MechanicDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#1e293b',
                                margin: '0 0 8px 0'
                            }}>
                                🔧 Mechanic Dashboard
                            </h1>
                            <p style={{ color: '#64748b', margin: 0 }}>
                                Welcome back, {user?.identity}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                View as Customer
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    <StatCard
                        icon="📊"
                        title="Total Services"
                        value="0"
                        subtitle="Services completed"
                    />
                    <StatCard
                        icon="⭐"
                        title="Rating"
                        value="0.0"
                        subtitle="Average rating"
                    />
                    <StatCard
                        icon="👥"
                        title="Customers"
                        value="0"
                        subtitle="Total customers"
                    />
                    <StatCard
                        icon="💰"
                        title="Revenue"
                        value="₹0"
                        subtitle="Total earnings"
                    />
                </div>

                {/* Profile Section */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1e293b',
                        margin: '0 0 24px 0'
                    }}>
                        Your Profile
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '16px'
                    }}>
                        <InfoRow label="User ID" value={user?.id || 'N/A'} />
                        <InfoRow label="Email/Phone" value={user?.identity || 'N/A'} />
                        <InfoRow label="Role" value={user?.roles.join(', ') || 'N/A'} />
                    </div>
                    <div style={{ marginTop: '24px' }}>
                        <button
                            onClick={() => navigate('/complete-profile')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#f093fb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                marginRight: '12px'
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Recent Services */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1e293b',
                        margin: '0 0 24px 0'
                    }}>
                        Recent Services
                    </h2>
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#94a3b8'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                        <p style={{ fontSize: '16px', margin: 0 }}>
                            No services yet. Start accepting bookings to see them here!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, subtitle }: {
    icon: string;
    title: string;
    value: string;
    subtitle: string;
}) {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
            <div style={{
                fontSize: '14px',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: '600'
            }}>
                {title}
            </div>
            <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '4px'
            }}>
                {value}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                {subtitle}
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ marginBottom: '12px' }}>
            <div style={{
                fontSize: '12px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {label}
            </div>
            <div style={{
                fontSize: '15px',
                color: '#1e293b',
                fontWeight: '500'
            }}>
                {value}
            </div>
        </div>
    );
}
