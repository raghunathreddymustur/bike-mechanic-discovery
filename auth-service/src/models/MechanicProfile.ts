import mongoose, { Schema, Document } from 'mongoose';

export interface IMechanicProfile extends Document {
    userId: string;
    shopName: string;
    name: string;
    description?: string;
    address: string;
    coords: {
        lat: number;
        lng: number;
    };
    services: string[];
    brands: string[];
    experience?: number;
    rating: number;
    profileImage?: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}

const MechanicProfileSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    shopName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: true
    },
    coords: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    services: {
        type: [String],
        default: []
    },
    brands: {
        type: [String],
        default: []
    },
    experience: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    profileImage: {
        type: String,
        default: '/workshop.png'
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: () => new Date().toISOString()
    },
    updatedAt: {
        type: String,
        default: () => new Date().toISOString()
    }
});

export const MechanicProfileModel = mongoose.model<IMechanicProfile>('MechanicProfile', MechanicProfileSchema);
