import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import { Sidebar } from '../components/Sidebar';
import MechanicDashboard from './MechanicDashboard';

const HomePage = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Check if user is a mechanic
    const isMechanic = isAuthenticated && user?.roles.includes('mechanic');

    // If user is a mechanic, show dashboard instead of map
    if (isMechanic) {
        return <MechanicDashboard />;
    }

    // Otherwise show the map view (for customers and guests)
    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            backgroundColor: '#fff'
        }}>
            {/* Sidebar - Explicit width and height */}
            <div style={{
                width: '420px',
                height: '100vh',
                flexShrink: 0,
                borderRight: '1px solid #e2e8f0',
                boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                zIndex: 10,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* User Profile Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 20
                }}>
                    {isAuthenticated && user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: '#6366f1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                {user.identity.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                                    {user.identity}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>
                                    {user.roles.join(', ')}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
                            Bike Mechanic Discovery
                        </div>
                    )}

                    <div>
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '13px',
                                    color: '#dc2626',
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fee2e2',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '13px',
                                    color: 'white',
                                    backgroundColor: '#6366f1',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar Content */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Sidebar />
                </div>
            </div>

            {/* Map - Takes remaining space with explicit height */}
            <div style={{
                flex: 1,
                height: '100vh',
                position: 'relative',
                zIndex: 0
            }}>
                <MapComponent />
            </div>
        </div>
    );
};

export default HomePage;
