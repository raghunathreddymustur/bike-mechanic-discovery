import { useApp } from '../context/AppContext';
import { Mechanic } from '../db/schema';
import { mechanicService } from '../services/MechanicService';
import { geocodingService } from '../services/GeocodingService';
import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Navigation, Wrench } from 'lucide-react';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

export const MechanicList = () => {
    const { filters, mapCenter, setSelectedMechanicId, selectedMechanicId, userLocation } = useApp();
    const navigate = useNavigate();
    const [searchLocationCoords, setSearchLocationCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [, setDbUpdateTrigger] = useState(0);

    // Subscribe to database updates via service layer
    useEffect(() => {
        const unsubscribe = mechanicService.subscribe(() => {
            setDbUpdateTrigger(prev => prev + 1);
        });
        return unsubscribe;
    }, []);

    // Geocode location search query using service layer
    useEffect(() => {
        const query = filters.locationQuery.trim();
        if (query) {
            geocodingService.geocodeAddress(query).then(coords => {
                setSearchLocationCoords(coords);
            });
        } else {
            setSearchLocationCoords(null);
        }
    }, [filters.locationQuery]);

    const referenceLocation = useMemo(() => {
        // Priority 1: User's detected/set location
        if (userLocation) {
            return userLocation;
        }

        // Priority 2: Location search query (geocoded)
        if (searchLocationCoords) {
            return searchLocationCoords;
        }

        // Priority 3: Current map center
        return { lat: mapCenter[0], lng: mapCenter[1] };
    }, [userLocation, searchLocationCoords, mapCenter]);

    const filteredAndSortedMechanics = useMemo(() => {
        // Use service layer for search with distance sorting
        const results = mechanicService.searchMechanics({
            bikeQuery: filters.bikeQuery,
            locationQuery: filters.locationQuery,
            userLocation: referenceLocation,
            sortByDistance: true
        });

        return results;
    }, [filters, referenceLocation]);

    return (
        <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f8fafc'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
            }}>
                <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {filteredAndSortedMechanics.length} Mechanics Found
                </div>
                {userLocation && (
                    <div style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#3b82f6',
                        backgroundColor: '#eff6ff',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #bfdbfe'
                    }}>
                        📍 From Your Location
                    </div>
                )}
            </div>

            {filteredAndSortedMechanics.map(mechanic => {
                const isSelected = selectedMechanicId === mechanic.id;

                return (
                    <div
                        key={mechanic.id}
                        style={{
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '12px',
                            border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                        onClick={() => {
                            setSelectedMechanicId(mechanic.id);
                        }}
                        onMouseEnter={(e) => {
                            if (!isSelected) {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSelected) {
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    color: isSelected ? '#1e40af' : '#0f172a',
                                    marginBottom: '4px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {mechanic.shopName}
                                </h3>
                                <p style={{
                                    fontSize: '13px',
                                    color: '#64748b',
                                    fontWeight: '500',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {mechanic.name}
                                </p>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#fef3c7',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700',
                                color: '#92400e',
                                flexShrink: 0,
                                marginLeft: '8px'
                            }}>
                                <Star size={12} fill="currentColor" />
                                {mechanic.rating}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            color: '#64748b',
                            marginBottom: '12px'
                        }}>
                            <MapPin size={14} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {mechanic.area}
                            </span>
                            {mechanic.distance !== undefined && (
                                <>
                                    <span style={{ color: '#cbd5e1' }}>•</span>
                                    <span style={{ fontWeight: '600', color: '#3b82f6' }}>{mechanic.distance.toFixed(1)} km</span>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                style={{
                                    flex: 1,
                                    fontSize: '13px',
                                    height: '36px',
                                    backgroundColor: '#0f172a',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/mechanic/${mechanic.id}`);
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                            >
                                View Profile
                            </button>
                            <button
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMechanicId(mechanic.id);
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.color = '#3b82f6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.color = '#64748b';
                                }}
                            >
                                <Navigation size={16} />
                            </button>
                        </div>
                    </div>
                );
            })}

            {filteredAndSortedMechanics.length === 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 24px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#f1f5f9',
                        padding: '16px',
                        borderRadius: '50%',
                        marginBottom: '16px'
                    }}>
                        <Wrench size={32} color="#94a3b8" />
                    </div>
                    <p style={{
                        color: '#0f172a',
                        fontWeight: '700',
                        fontSize: '14px',
                        marginBottom: '4px'
                    }}>
                        No mechanics found
                    </p>
                    <p style={{
                        color: '#64748b',
                        fontSize: '12px'
                    }}>
                        Try changing your search filters
                    </p>
                </div>
            )}
        </div>
    );
};
