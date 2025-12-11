// Service Layer - Business Logic
// Separates business rules from UI and data access

import { mechanicRepository } from '../repositories/MechanicRepository';
import { Mechanic, MechanicRegistrationData } from '../db/schema';

/**
 * MechanicService - Business logic for mechanic operations
 * Implements Service Layer Pattern
 */
class MechanicService {
    /**
     * Get all mechanics
     */
    getAllMechanics(): Mechanic[] {
        return mechanicRepository.findAll();
    }

    /**
     * Get mechanic by ID with validation
     */
    getMechanicById(id: string): Mechanic | null {
        if (!id || id.trim() === '') {
            throw new Error('Mechanic ID is required');
        }
        return mechanicRepository.findById(id);
    }

    /**
     * Calculate distance between two coordinates (Haversine formula)
     */
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Search mechanics with filters and optional distance sorting
     */
    searchMechanics(filters: {
        bikeQuery?: string;
        locationQuery?: string;
        userLocation?: { lat: number; lng: number } | null;
        sortByDistance?: boolean;
    }): Mechanic[] {
        const allMechanics = this.getAllMechanics();
        const bikeQuery = filters.bikeQuery?.toLowerCase().trim() || '';
        const locQuery = filters.locationQuery?.toLowerCase().trim() || '';

        // Filter mechanics
        let results = allMechanics.filter(m => {
            let bikeMatch = true;
            if (bikeQuery) {
                bikeMatch = m.brands.some(b => b.toLowerCase().includes(bikeQuery));
            }

            let locMatch = true;
            if (locQuery) {
                const textTargets = [m.pincode, m.area, m.city];
                locMatch = textTargets.some(t => t.toLowerCase().includes(locQuery));
            }

            return bikeMatch && locMatch;
        });

        // Sort by distance if user location is provided
        if (filters.sortByDistance && filters.userLocation) {
            const mechanicsWithDistance = results.map(m => ({
                ...m,
                distance: this.calculateDistance(
                    filters.userLocation!.lat,
                    filters.userLocation!.lng,
                    m.coords.lat,
                    m.coords.lng
                )
            }));

            mechanicsWithDistance.sort((a, b) => a.distance - b.distance);
            return mechanicsWithDistance;
        }

        return results;
    }

    /**
     * Register new mechanic with validation
     */
    async registerMechanic(data: MechanicRegistrationData): Promise<Mechanic> {
        // Business validation
        this.validateRegistrationData(data);

        // Create mechanic
        return await mechanicRepository.create(data);
    }

    /**
     * Validate registration data
     */
    private validateRegistrationData(data: MechanicRegistrationData): void {
        if (!data.shopName || data.shopName.trim() === '') {
            throw new Error('Shop name is required');
        }
        if (!data.name || data.name.trim() === '') {
            throw new Error('Mechanic name is required');
        }
        if (!data.email || !this.isValidEmail(data.email)) {
            throw new Error('Valid email is required');
        }
        if (!data.phone || data.phone.trim() === '') {
            throw new Error('Phone number is required');
        }
        if (!data.address || data.address.trim() === '') {
            throw new Error('Address is required');
        }
        if (!data.pincode || data.pincode.trim() === '') {
            throw new Error('Pincode is required');
        }
        if (data.brands.length === 0) {
            throw new Error('At least one brand must be selected');
        }
        if (data.services.length === 0) {
            throw new Error('At least one service must be selected');
        }
        if (!data.coords || data.coords.lat === 0 || data.coords.lng === 0) {
            throw new Error('Location coordinates are required');
        }
    }

    /**
     * Email validation
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Subscribe to mechanic updates
     */
    subscribe(callback: () => void): () => void {
        return mechanicRepository.subscribe(callback);
    }
}

// Singleton instance
export const mechanicService = new MechanicService();
