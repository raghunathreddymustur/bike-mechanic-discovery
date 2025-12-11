// Geocoding utility using Nominatim (OpenStreetMap) API
// Free, no API key required

interface GeocodingResult {
    lat: number;
    lng: number;
}

// Cache to avoid duplicate API calls
const geocodingCache = new Map<string, GeocodingResult | null>();

/**
 * Geocode an address or pincode to coordinates using Nominatim API
 * @param query - Address, pincode, or location name
 * @returns Coordinates {lat, lng} or null if not found
 */
export async function geocodeAddress(query: string): Promise<GeocodingResult | null> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
        return null;
    }

    // Check cache first
    if (geocodingCache.has(normalizedQuery)) {
        return geocodingCache.get(normalizedQuery) || null;
    }

    try {
        // Nominatim API endpoint
        // Add "India" to query for better results
        const searchQuery = normalizedQuery.includes('India')
            ? normalizedQuery
            : `${normalizedQuery}, India`;

        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.append('q', searchQuery);
        url.searchParams.append('format', 'json');
        url.searchParams.append('limit', '1');
        url.searchParams.append('countrycodes', 'in'); // Restrict to India

        const response = await fetch(url.toString(), {
            headers: {
                'User-Agent': 'BikeMechanicApp/1.0' // Nominatim requires User-Agent
            }
        });

        if (!response.ok) {
            console.error('Geocoding API error:', response.status);
            geocodingCache.set(normalizedQuery, null);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const result: GeocodingResult = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };

            // Cache the result
            geocodingCache.set(normalizedQuery, result);
            return result;
        } else {
            // No results found
            geocodingCache.set(normalizedQuery, null);
            return null;
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        geocodingCache.set(normalizedQuery, null);
        return null;
    }
}

/**
 * Clear the geocoding cache
 */
export function clearGeocodingCache() {
    geocodingCache.clear();
}
