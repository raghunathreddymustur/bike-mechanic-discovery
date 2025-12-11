import React, { createContext, useContext, useState, ReactNode } from 'react';

// Default Bangalore center
const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946];
const DEFAULT_ZOOM = 12;

interface SearchFilters {
    bikeQuery: string;
    locationQuery: string;
}

interface UserLocation {
    lat: number;
    lng: number;
}

interface AppState {
    mapCenter: [number, number];
    mapZoom: number;
    filters: SearchFilters;
    selectedMechanicId: string | null;
    userLocation: UserLocation | null;

    setMapState: (center: [number, number], zoom: number) => void;
    setFilters: (filters: SearchFilters) => void;
    updateFilter: (key: keyof SearchFilters, value: string) => void;
    setSelectedMechanicId: (id: string | null) => void;
    setUserLocation: (location: UserLocation | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
    const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);
    const [filters, setFilters] = useState<SearchFilters>({ bikeQuery: '', locationQuery: '' });
    const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    const setMapState = (center: [number, number], zoom: number) => {
        setMapCenter(center);
        setMapZoom(zoom);
    };

    const updateFilter = (key: keyof SearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const value = {
        mapCenter,
        mapZoom,
        filters,
        selectedMechanicId,
        userLocation,
        setMapState,
        setFilters,
        updateFilter,
        setSelectedMechanicId,
        setUserLocation
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
