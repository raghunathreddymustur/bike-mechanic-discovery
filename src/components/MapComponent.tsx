import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { Mechanic } from '../db/schema';
import { mechanicService } from '../services/MechanicService';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Green marker for user location
const UserIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
            <path fill="#22c55e" stroke="#ffffff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.4 12.5 28.5 12.5 28.5S25 20.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
            <circle cx="12.5" cy="12.5" r="6" fill="#ffffff"/>
        </svg>
    `),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

const MapEvents = () => {
    const { setMapState } = useApp();
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            setMapState([center.lat, center.lng], zoom);
        },
        zoomend: () => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            setMapState([center.lat, center.lng], zoom);
        }
    });
    return null;
};

const Markers = ({ mechanics }: { mechanics: Mechanic[] }) => {
    const navigate = useNavigate();
    const map = useMap();
    const { selectedMechanicId } = useApp();
    const markerRefs = useRef<Record<string, L.Marker>>({});

    useEffect(() => {
        if (selectedMechanicId && markerRefs.current[selectedMechanicId]) {
            const marker = markerRefs.current[selectedMechanicId];
            map.flyTo(marker.getLatLng(), 15, { duration: 1 });
            marker.openPopup();
        }
    }, [selectedMechanicId, map]);

    return (
        <>
            {mechanics.map((mechanic) => (
                <Marker
                    key={mechanic.id}
                    position={[mechanic.coords.lat, mechanic.coords.lng]}
                    ref={(ref) => {
                        if (ref) markerRefs.current[mechanic.id] = ref;
                    }}
                >
                    <Popup>
                        <div style={{ minWidth: '180px' }} className="font-sans">
                            <h3 className="font-bold text-base text-slate-800 m-0">{mechanic.shopName}</h3>
                            <p className="text-xs text-slate-500 m-0 mt-1">{mechanic.address}</p>
                            <div className="flex gap-1 mt-2">
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 font-bold">
                                    {mechanic.rating} ★
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                    {mechanic.brands[0]}
                                </span>
                            </div>
                            <button
                                className="btn mt-3 w-full text-xs py-1.5 bg-slate-900 text-white hover:bg-slate-700 border-none rounded-md cursor-pointer"
                                onClick={() => navigate(`/mechanic/${mechanic.id}`)}
                            >
                                View Profile
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

// User Location Marker Component with auto-pan
const UserLocationMarker = () => {
    const { userLocation } = useApp();
    const map = useMap();
    const prevLocationRef = useRef<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        if (userLocation) {
            const isNewLocation = !prevLocationRef.current ||
                prevLocationRef.current.lat !== userLocation.lat ||
                prevLocationRef.current.lng !== userLocation.lng;

            if (isNewLocation) {
                map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.5 });
                prevLocationRef.current = userLocation;
            }
        }
    }, [userLocation, map]);

    if (!userLocation) return null;

    return (
        <>
            <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={UserIcon}
            >
                <Popup>
                    <div style={{ minWidth: '150px', textAlign: 'center' }}>
                        <p style={{
                            margin: 0,
                            fontWeight: '700',
                            color: '#22c55e',
                            fontSize: '14px'
                        }}>
                            📍 Your Location
                        </p>
                        <p style={{
                            margin: '4px 0 0 0',
                            fontSize: '11px',
                            color: '#64748b'
                        }}>
                            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                        </p>
                    </div>
                </Popup>
            </Marker>
            <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={100}
                pathOptions={{
                    color: '#22c55e',
                    fillColor: '#22c55e',
                    fillOpacity: 0.1,
                    weight: 2
                }}
            />
        </>
    );
};

const MapComponent = () => {
    const { mapCenter, mapZoom, filters } = useApp();
    const [allMechanics, setAllMechanics] = useState<Mechanic[]>(mechanicService.getAllMechanics());

    // Subscribe to database updates via service layer
    useEffect(() => {
        const unsubscribe = mechanicService.subscribe(() => {
            setAllMechanics(mechanicService.getAllMechanics());
        });
        return unsubscribe;
    }, []);

    // Filter mechanics using service layer
    const filteredMechanics = useMemo(() => {
        return mechanicService.searchMechanics({
            bikeQuery: filters.bikeQuery,
            locationQuery: filters.locationQuery
        });
    }, [filters, allMechanics]);

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents />
                <Markers mechanics={filteredMechanics} />
                <UserLocationMarker />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
