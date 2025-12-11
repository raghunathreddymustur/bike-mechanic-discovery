// Database Schema for Bike Mechanic App

export interface User {
    id: string;
    email: string;
    phone: string;
    password: string; // For future auth
    role: 'mechanic' | 'customer';
    createdAt: Date;
    updatedAt: Date;
}

export interface MechanicProfile {
    id: string;
    userId: string; // FK to User
    shopName: string;
    name: string; // Mechanic name
    profileImage: string; // URL or base64
    address: string;
    area: string;
    city: string;
    pincode: string;
    coords: {
        lat: number;
        lng: number;
    };
    phone: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    brands: string[]; // Supported brands
    services: string[]; // Services offered
    workingHours?: {
        open: string;
        close: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// Combined view for display
export interface Mechanic {
    id: string;
    shopName: string;
    name: string;
    profileImage: string;
    address: string;
    area: string;
    city: string;
    pincode: string;
    coords: {
        lat: number;
        lng: number;
    };
    phone: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    brands: string[];
    services: string[];
    workingHours?: {
        open: string;
        close: string;
    };
}

// Form data for registration
export interface MechanicRegistrationData {
    shopName: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    area: string;
    city: string;
    pincode: string;
    coords: {
        lat: number;
        lng: number;
    };
    brands: string[];
    services: string[];
    profileImage?: string;
}
