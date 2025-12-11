import { Request, Response } from 'express';
import { MechanicProfileModel } from '../models/MechanicProfile';
import { findUserById } from '../db/database';

/**
 * Create mechanic profile
 * POST /api/mechanics
 */
export async function createProfile(req: Request, res: Response): Promise<void> {
    try {
        const { userId, shopName, name, address, coords, services, brands, experience, description } = req.body;

        // Validate required fields
        if (!userId || !shopName || !name || !address || !coords) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, shopName, name, address, coords'
            });
            return;
        }

        // Validate coordinates
        if (!coords.lat || !coords.lng) {
            res.status(400).json({
                success: false,
                message: 'Coordinates must include lat and lng'
            });
            return;
        }

        // Check if user exists
        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Check if mechanic profile already exists
        const existing = await MechanicProfileModel.findOne({ userId });
        if (existing) {
            res.status(400).json({
                success: false,
                message: 'Mechanic profile already exists for this user'
            });
            return;
        }

        // Create profile
        const profile = new MechanicProfileModel({
            userId,
            shopName,
            name,
            description: description || '',
            address,
            coords,
            services: services || [],
            brands: brands || [],
            experience: experience || 0,
            rating: 0,
            verified: false
        });

        await profile.save();

        res.status(201).json({
            success: true,
            message: 'Mechanic profile created successfully',
            profile: {
                id: profile._id,
                userId: profile.userId,
                shopName: profile.shopName,
                name: profile.name,
                address: profile.address,
                coords: profile.coords
            }
        });
    } catch (error: any) {
        console.error('Error creating mechanic profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

/**
 * Get all mechanic profiles
 * GET /api/mechanics
 */
export async function getAllMechanics(req: Request, res: Response): Promise<void> {
    try {
        const profiles = await MechanicProfileModel.find({});

        const mechanics = profiles.map(profile => ({
            id: profile._id.toString(),
            userId: profile.userId,
            shopName: profile.shopName,
            name: profile.name,
            description: profile.description,
            address: profile.address,
            coords: profile.coords,
            services: profile.services,
            brands: profile.brands,
            experience: profile.experience,
            rating: profile.rating,
            profileImage: profile.profileImage,
            verified: profile.verified,
            reviewCount: 0 // TODO: Implement reviews
        }));

        res.status(200).json({
            success: true,
            mechanics
        });
    } catch (error: any) {
        console.error('Error fetching mechanics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

/**
 * Get single mechanic profile
 * GET /api/mechanics/:id
 */
export async function getMechanicProfile(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const profile = await MechanicProfileModel.findById(id);

        if (!profile) {
            res.status(404).json({
                success: false,
                message: 'Mechanic profile not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            mechanic: {
                id: profile._id.toString(),
                userId: profile.userId,
                shopName: profile.shopName,
                name: profile.name,
                description: profile.description,
                address: profile.address,
                coords: profile.coords,
                services: profile.services,
                brands: profile.brands,
                experience: profile.experience,
                rating: profile.rating,
                profileImage: profile.profileImage,
                verified: profile.verified,
                reviewCount: 0
            }
        });
    } catch (error: any) {
        console.error('Error fetching mechanic:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
