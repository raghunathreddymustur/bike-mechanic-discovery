// Geocoding Service - Location operations
// Wraps geocoding utility with service layer

import { geocodeAddress as geocode } from '../utils/geocoding';

/**
 * GeocodingService - Business logic for geocoding operations
 */
class GeocodingService {
    /**
     * Geocode an address or pincode
     */
    async geocodeAddress(query: string): Promise<{ lat: number; lng: number } | null> {
        if (!query || query.trim() === '') {
            console.error('[GeocodingService] Empty query provided');
            throw new Error('Address or pincode is required');
        }

        console.log('[GeocodingService] Geocoding query:', query);

        try {
            const result = await geocode(query);
            console.log('[GeocodingService] Geocoding result:', result);
            return result;
        } catch (error) {
            console.error('[GeocodingService] Geocoding failed:', error);
            throw error; // Re-throw instead of returning null
        }
    }

    /**
     * Get location suggestions for autocomplete
     */
    async getSuggestions(query: string): Promise<any[]> {
        if (!query || query.trim().length < 3) {
            return [];
        }

        const normalizedQuery = query.trim();
        console.log('[GeocodingService] Getting suggestions for:', normalizedQuery);

        try {
            // Nominatim API endpoint for autocomplete-like search
            const searchQuery = normalizedQuery.includes('India')
                ? normalizedQuery
                : `${normalizedQuery}, India`;

            const url = new URL('https://nominatim.openstreetmap.org/search');
            url.searchParams.append('q', searchQuery);
            url.searchParams.append('format', 'json');
            url.searchParams.append('addressdetails', '1'); // Include address details
            url.searchParams.append('limit', '5');
            url.searchParams.append('countrycodes', 'in');

            const response = await fetch(url.toString(), {
                headers: {
                    'User-Agent': 'BikeMechanicApp/1.0'
                }
            });

            if (!response.ok) {
                console.error('[GeocodingService] API error:', response.status);
                return [];
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[GeocodingService] Suggestion error:', error);
            return [];
        }
    }

    /**
     * Validate if coordinates are valid
     */
    isValidCoordinates(coords: { lat: number; lng: number } | null): boolean {
        if (!coords) return false;
        const isValid = coords.lat !== 0 && coords.lng !== 0 &&
            coords.lat >= -90 && coords.lat <= 90 &&
            coords.lng >= -180 && coords.lng <= 180;
        console.log('[GeocodingService] Coordinates validation:', coords, 'isValid:', isValid);
        return isValid;
    }
}

// Singleton instance
export const geocodingService = new GeocodingService();
