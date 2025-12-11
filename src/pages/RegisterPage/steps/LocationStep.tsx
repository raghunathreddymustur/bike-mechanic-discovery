// LocationStep - Step 2 of registration
// Integrates with GeocodingService & Autocomplete

import { LocationAutocomplete } from '../../../components/LocationAutocomplete';

interface LocationStepProps {
    formData: {
        address: string;
        area: string;
        city: string;
        pincode: string;
        coords: { lat: number; lng: number };
    };
    onChange: (field: string, value: any) => void;
    onGeocode: () => void;
    isGeocoding: boolean;
}

export const LocationStep = ({ formData, onChange }: LocationStepProps) => {

    const handleLocationSelect = (location: any) => {
        onChange('address', location.address);
        onChange('area', location.area);
        onChange('city', location.city);
        onChange('pincode', location.pincode);
        onChange('coords', location.coords);
    };

    return (
        <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                Location Details
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                Search for your shop or enter details manually
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Autocomplete Search */}
                <LocationAutocomplete onSelect={handleLocationSelect} />

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                        Address *
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => onChange('address', e.target.value)}
                        placeholder="e.g., 123 MG Road, Opposite Metro Station"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: '#ffffff'
                        }}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                            Area *
                        </label>
                        <input
                            type="text"
                            value={formData.area}
                            onChange={(e) => onChange('area', e.target.value)}
                            placeholder="e.g., Indiranagar"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                            City *
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => onChange('city', e.target.value)}
                            placeholder="e.g., Bangalore"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                        Pincode *
                    </label>
                    <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => onChange('pincode', e.target.value)}
                        placeholder="e.g., 560038"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                    {/* Coordinates Status */}
                    <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: formData.coords.lat !== 0 ? '#f0fdf4' : '#fff1f2',
                        border: `1px solid ${formData.coords.lat !== 0 ? '#bbf7d0' : '#fecdd3'}`,
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: formData.coords.lat !== 0 ? '#15803d' : '#be123c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        {formData.coords.lat !== 0 ? (
                            <>
                                <span>✓ Exact location found</span>
                                <span style={{ fontSize: '11px', opacity: 0.8 }}>
                                    {formData.coords.lat.toFixed(4)}, {formData.coords.lng.toFixed(4)}
                                </span>
                            </>
                        ) : (
                            <span>⚠️ Location not set yet. Please search above.</span>
                        )}
                    </div>
                </div>
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
