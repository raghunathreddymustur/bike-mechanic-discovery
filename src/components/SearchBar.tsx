import { Search, MapPin, Crosshair, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { geocodeAddress } from '../utils/geocoding';

export const SearchBar = () => {
    const { filters, updateFilter, setUserLocation, setMapState } = useApp();
    const [myPincode, setMyPincode] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [locationStatus, setLocationStatus] = useState<string>('');

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('✗ Geolocation not supported');
            setTimeout(() => setLocationStatus(''), 3000);
            return;
        }

        setIsDetecting(true);
        setLocationStatus('Detecting...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(location);
                setMapState([location.lat, location.lng], 14);
                setLocationStatus('✓ Location detected');
                setIsDetecting(false);

                setTimeout(() => setLocationStatus(''), 3000);
            },
            (error) => {
                setIsDetecting(false);
                let errorMsg = 'Detection failed';
                if (error.code === 1) errorMsg = 'Permission denied';
                else if (error.code === 2) errorMsg = 'Position unavailable';
                else if (error.code === 3) errorMsg = 'Timeout';

                setLocationStatus('✗ ' + errorMsg);
                setTimeout(() => setLocationStatus(''), 3000);
            }
        );
    };

    const handleSetPincode = async () => {
        const pincode = myPincode.trim();

        if (!pincode) {
            setLocationStatus('✗ Please enter a pincode or address');
            setTimeout(() => setLocationStatus(''), 3000);
            return;
        }

        setIsGeocoding(true);
        setLocationStatus('Finding location...');

        try {
            const location = await geocodeAddress(pincode);

            if (location) {
                setUserLocation(location);
                setMapState([location.lat, location.lng], 14);
                setLocationStatus('✓ Location set to ' + pincode);
                setIsGeocoding(false);
                setTimeout(() => setLocationStatus(''), 3000);
            } else {
                setIsGeocoding(false);
                setLocationStatus('✗ Location not found. Try: 560038, Delhi, Mumbai, etc.');
                setTimeout(() => setLocationStatus(''), 4000);
            }
        } catch (error) {
            setIsGeocoding(false);
            setLocationStatus('✗ Failed to find location');
            setTimeout(() => setLocationStatus(''), 3000);
        }
    };

    return (
        <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                Find Your Mechanic
            </h2>

            {/* Location Status */}
            {locationStatus && (
                <div style={{
                    backgroundColor: locationStatus.startsWith('✓') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    {locationStatus}
                </div>
            )}

            {/* Register Button */}
            <button
                onClick={() => window.location.href = '/register'}
                style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(34,197,94,0.9)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(34,197,94,1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(34,197,94,0.9)'}
            >
                🔧 Register as Mechanic
            </button>

            {/* My Location Controls */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px'
            }}>
                <button
                    onClick={handleDetectLocation}
                    disabled={isDetecting}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: isDetecting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: isDetecting ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => !isDetecting && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)')}
                    onMouseLeave={(e) => !isDetecting && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
                >
                    {isDetecting ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Crosshair size={16} />}
                    {isDetecting ? 'Detecting...' : 'Detect My Location'}
                </button>
            </div>

            {/* Set My Pincode */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px'
            }}>
                <input
                    type="text"
                    value={myPincode}
                    onChange={(e) => setMyPincode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isGeocoding && handleSetPincode()}
                    placeholder="Pincode or Address (560038, Delhi, Mumbai...)"
                    disabled={isGeocoding}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '2px solid transparent',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#0f172a',
                        outline: 'none',
                        opacity: isGeocoding ? 0.6 : 1
                    }}
                />
                <button
                    onClick={handleSetPincode}
                    disabled={isGeocoding}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        color: '#667eea',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: isGeocoding ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: isGeocoding ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                    onMouseEnter={(e) => !isGeocoding && (e.currentTarget.style.backgroundColor = '#ffffff')}
                    onMouseLeave={(e) => !isGeocoding && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)')}
                >
                    {isGeocoding && <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                    {isGeocoding ? 'Finding...' : 'Set'}
                </button>
            </div>

            {/* Bike Search Input */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid transparent',
                transition: 'all 0.2s'
            }}>
                <Search style={{ width: '20px', height: '20px', color: '#667eea', flexShrink: 0 }} />
                <input
                    type="text"
                    value={filters.bikeQuery}
                    onChange={(e) => updateFilter('bikeQuery', e.target.value)}
                    placeholder="Bike Model (Apache, Duke, Splendor...)"
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#0f172a',
                        backgroundColor: 'transparent'
                    }}
                />
            </div>

            {/* Location Search Input */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid transparent',
                transition: 'all 0.2s'
            }}>
                <MapPin style={{ width: '20px', height: '20px', color: '#667eea', flexShrink: 0 }} />
                <input
                    type="text"
                    value={filters.locationQuery}
                    onChange={(e) => updateFilter('locationQuery', e.target.value)}
                    placeholder="Search Area (Indiranagar, Koramangala...)"
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#0f172a',
                        backgroundColor: 'transparent'
                    }}
                />
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
