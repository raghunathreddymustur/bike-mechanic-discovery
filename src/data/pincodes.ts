export const PINCODE_COORDS: Record<string, { lat: number; lng: number }> = {
    '560038': { lat: 12.9784, lng: 77.6408 }, // Indiranagar
    '560095': { lat: 12.9352, lng: 77.6245 }, // Koramangala
    '560011': { lat: 12.9250, lng: 77.5938 }, // Jayanagar
    '560102': { lat: 12.9121, lng: 77.6446 }, // HSR Layout
    '560076': { lat: 12.9166, lng: 77.6101 }, // BTM Layout
    '560003': { lat: 13.0031, lng: 77.5643 }, // Malleshwaram
    '560066': { lat: 12.9698, lng: 77.7500 }, // Whitefield
    '560024': { lat: 13.0358, lng: 77.5970 }, // Hebbal
    '560037': { lat: 12.9592, lng: 77.6974 }, // Marathahalli
    '560004': { lat: 12.9421, lng: 77.5753 }, // Basavanagudi
    '560005': { lat: 12.9975, lng: 77.6111 }, // Frazer Town
    '560070': { lat: 12.9255, lng: 77.5655 }, // Banashankari
    '560100': { lat: 12.9500, lng: 77.6500 }, // Electronic City
    // Alias for areas
    'indiranagar': { lat: 12.9784, lng: 77.6408 },
    'koramangala': { lat: 12.9352, lng: 77.6245 },
    'jayanagar': { lat: 12.9250, lng: 77.5938 },
    'hsr': { lat: 12.9121, lng: 77.6446 },
    'btm': { lat: 12.9166, lng: 77.6101 },
    'malleshwaram': { lat: 13.0031, lng: 77.5643 },
    'whitefield': { lat: 12.9698, lng: 77.7500 },
    'hebbal': { lat: 13.0358, lng: 77.5970 },
    'marathahalli': { lat: 12.9592, lng: 77.6974 },
    'basavanagudi': { lat: 12.9421, lng: 77.5753 },
    'frazer': { lat: 12.9975, lng: 77.6111 },
    'banashankari': { lat: 12.9255, lng: 77.5655 },
};

// Fallback function for unknown pincodes
// Generates approximate coordinates based on pincode pattern
export const getPincodeCoords = (pincode: string): { lat: number; lng: number } | null => {
    // Try exact match first
    if (PINCODE_COORDS[pincode]) {
        return PINCODE_COORDS[pincode];
    }

    // Try lowercase for area names
    const lowerPincode = pincode.toLowerCase();
    if (PINCODE_COORDS[lowerPincode]) {
        return PINCODE_COORDS[lowerPincode];
    }

    // For Bangalore pincodes (560xxx), generate approximate coordinates
    if (/^560\d{3}$/.test(pincode)) {
        const lastThree = parseInt(pincode.slice(3));

        // Bangalore center
        const baseLat = 12.9716;
        const baseLng = 77.5946;

        // Generate offset based on last 3 digits (creates a grid pattern)
        // This spreads pincodes across Bangalore area
        const latOffset = ((lastThree % 100) - 50) * 0.005; // ~0.5 km per unit
        const lngOffset = (Math.floor(lastThree / 100) - 5) * 0.005;

        return {
            lat: baseLat + latOffset,
            lng: baseLng + lngOffset
        };
    }

    // For other Indian pincodes, return null (not supported)
    return null;
};
