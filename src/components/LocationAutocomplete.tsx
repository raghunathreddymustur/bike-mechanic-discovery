import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader, X } from 'lucide-react';
import { geocodingService } from '../services/GeocodingService';

interface LocationAutocompleteProps {
    onSelect: (location: {
        address: string;
        area: string;
        city: string;
        pincode: string;
        coords: { lat: number; lng: number };
    }) => void;
}

export const LocationAutocomplete = ({ onSelect }: LocationAutocompleteProps) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce search to prevent API rate limiting
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim().length >= 3) {
                setLoading(true);
                try {
                    const results = await geocodingService.getSuggestions(query);
                    setSuggestions(results);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Autocomplete error:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 1000); // 1s debounce for Nominatim policy

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (place: any) => {
        setQuery(place.display_name);
        setIsOpen(false);

        // Extract address components
        const addr = place.address || {};
        const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || '';
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const pincode = addr.postcode || '';
        const address = place.display_name.split(',')[0]; // First part is usually the place name

        onSelect({
            address,
            area,
            city,
            pincode,
            coords: {
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon)
            }
        });
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
                Search for your Shop Location
            </label>
            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type to search (e.g. Lulu Mall, Kochi)"
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#f8fafc',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                    }}
                    onFocus={() => query.length >= 3 && setIsOpen(true)}
                />
                {loading && (
                    <Loader size={16} style={{
                        position: 'absolute',
                        right: '12px',
                        top: '14px',
                        color: '#667eea',
                        animation: 'spin 1s linear infinite'
                    }} />
                )}
                {query && !loading && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setSuggestions([]);
                            setIsOpen(false);
                        }}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '12px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8'
                        }}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    marginTop: '8px',
                    zIndex: 50,
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {suggestions.map((place, index) => (
                        <div
                            key={place.place_id || index}
                            onClick={() => handleSelect(place)}
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                transition: 'background-color 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                            <MapPin size={16} style={{ color: '#667eea', marginTop: '3px', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                                    {place.display_name.split(',')[0]}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                    {place.display_name.split(',').slice(1).join(',')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
