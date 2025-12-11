// Repository Pattern - Data Access Layer
// Abstracts data source (in-memory DB, REST API, etc.)

import { getAllMechanics, getMechanicById as getById, registerMechanic as register, subscribeToUpdates } from '../db/store';
import { Mechanic } from '../db/schema';
import { MechanicRegistrationData } from '../db/schema';
import { MECHANICS as STATIC_MECHANICS } from '../data/mechanics';

/**
 * MechanicRepository - Single source of truth for mechanic data
 * Implements Repository Pattern for easy migration to microservices
 */
class MechanicRepository {
    /**
     * Get all mechanics (static + database)
     */
    findAll(): Mechanic[] {
        const dbMechanics = getAllMechanics();
        // Merge static mechanics with database mechanics
        const staticMechanicsConverted = STATIC_MECHANICS.map(m => ({
            ...m,
            profileImage: '/workshop.png',
            reviewCount: 0,
            verified: true
        }));
        return [...staticMechanicsConverted, ...dbMechanics];
    }

    /**
     * Get mechanic by ID
     */
    findById(id: string): Mechanic | null {
        // Try database first
        const dbMechanic = getById(id);
        if (dbMechanic) return dbMechanic;

        // Fallback to static data
        const staticMechanic = STATIC_MECHANICS.find(m => m.id === id);
        if (staticMechanic) {
            return {
                ...staticMechanic,
                profileImage: '/workshop.png',
                reviewCount: 0,
                verified: true
            };
        }

        return null;
    }

    /**
     * Create new mechanic
     */
    async create(data: MechanicRegistrationData): Promise<Mechanic> {
        return await register(data);
    }

    /**
     * Subscribe to data changes
     */
    subscribe(callback: () => void): () => void {
        return subscribeToUpdates(callback);
    }
}

// Singleton instance
export const mechanicRepository = new MechanicRepository();
