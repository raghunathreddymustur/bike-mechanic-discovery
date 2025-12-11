import MapComponent from '../components/MapComponent';
import { Sidebar } from '../components/Sidebar';

const HomePage = () => {
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
                position: 'relative'
            }}>
                <Sidebar />
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
