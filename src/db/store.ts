// In-Memory Database Store
import { User, MechanicProfile, Mechanic, MechanicRegistrationData } from './schema';
import { v4 as uuidv4 } from 'uuid';

// Event system for real-time updates
type UpdateListener = () => void;
const updateListeners: Set<UpdateListener> = new Set();

// In-memory stores
const users = new Map<string, User>();
const mechanicProfiles = new Map<string, MechanicProfile>();

// Subscribe to database updates
export function subscribeToUpdates(listener: UpdateListener) {
    updateListeners.add(listener);
    return () => updateListeners.delete(listener);
}

// Notify all listeners of updates
function notifyUpdates() {
    updateListeners.forEach(listener => listener());
}

// Generate default profile image (SVG with initials)
function generateDefaultProfileImage(name: string): string {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <rect width="200" height="200" fill="${bgColor}"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white">
                ${initials}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Register new mechanic
export async function registerMechanic(data: MechanicRegistrationData): Promise<Mechanic> {
    const userId = uuidv4();
    const profileId = uuidv4();

    // Create user
    const user: User = {
        id: userId,
        email: data.email,
        phone: data.phone,
        password: '', // Not implemented yet
        role: 'mechanic',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // Create mechanic profile
    const profile: MechanicProfile = {
        id: profileId,
        userId: userId,
        shopName: data.shopName,
        name: data.name,
        profileImage: data.profileImage || generateDefaultProfileImage(data.name),
        address: data.address,
        area: data.area,
        city: data.city,
        pincode: data.pincode,
        coords: data.coords,
        phone: data.phone,
        rating: 4.0, // Default rating
        reviewCount: 0,
        verified: false,
        brands: data.brands,
        services: data.services,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    users.set(userId, user);
    mechanicProfiles.set(profileId, profile);

    // Notify listeners
    notifyUpdates();

    return profileToMechanic(profile);
}

// Get all mechanics
export function getAllMechanics(): Mechanic[] {
    return Array.from(mechanicProfiles.values()).map(profileToMechanic);
}

// Get mechanic by ID
export function getMechanicById(id: string): Mechanic | null {
    const profile = mechanicProfiles.get(id);
    return profile ? profileToMechanic(profile) : null;
}

// Helper: Convert profile to mechanic
function profileToMechanic(profile: MechanicProfile): Mechanic {
    return {
        id: profile.id,
        shopName: profile.shopName,
        name: profile.name,
        profileImage: profile.profileImage,
        address: profile.address,
        area: profile.area,
        city: profile.city,
        pincode: profile.pincode,
        coords: profile.coords,
        phone: profile.phone,
        rating: profile.rating,
        reviewCount: profile.reviewCount,
        verified: profile.verified,
        brands: profile.brands,
        services: profile.services,
        workingHours: profile.workingHours
    };
}

// Seed mock data
export function seedMockData() {
    const mockMechanics: MechanicRegistrationData[] = [
        {
            shopName: "Royal Enfield Service Center",
            name: "Vikram Singh",
            email: "vikram@royalservice.com",
            phone: "+91-9876543210",
            address: "123 MG Road",
            area: "MG Road",
            city: "Bangalore",
            pincode: "560001",
            coords: { lat: 12.9750, lng: 77.6069 },
            brands: ["Royal Enfield", "Jawa"],
            services: ["Engine Repair", "Oil Change", "Brake Service", "Customization"]
        },
        {
            shopName: "Speed Bike Care",
            name: "Arjun Reddy",
            email: "arjun@speedbike.com",
            phone: "+91-9876543211",
            address: "45 Brigade Road",
            area: "Brigade Road",
            city: "Bangalore",
            pincode: "560025",
            coords: { lat: 12.9716, lng: 77.6095 },
            brands: ["Yamaha", "Suzuki", "Honda"],
            services: ["General Service", "Tire Replacement", "Battery Service"]
        },
        {
            shopName: "KTM Pro Workshop",
            name: "Rahul Kumar",
            email: "rahul@ktmpro.com",
            phone: "+91-9876543212",
            address: "78 Residency Road",
            area: "Residency Road",
            city: "Bangalore",
            pincode: "560025",
            coords: { lat: 12.9750, lng: 77.6070 },
            brands: ["KTM", "Duke", "RC"],
            services: ["Performance Tuning", "Engine Repair", "Suspension Service"]
        },
        {
            shopName: "Honda Care Point",
            name: "Suresh Patel",
            email: "suresh@hondacare.com",
            phone: "+91-9876543213",
            address: "90 Commercial Street",
            area: "Commercial Street",
            city: "Bangalore",
            pincode: "560001",
            coords: { lat: 12.9810, lng: 77.6080 },
            brands: ["Honda", "Activa", "Shine"],
            services: ["General Maintenance", "Electrical Repair", "Oil Change"]
        },
        {
            shopName: "Bajaj Authorized Service",
            name: "Amit Sharma",
            email: "amit@bajajservice.com",
            phone: "+91-9876543214",
            address: "56 Church Street",
            area: "Church Street",
            city: "Bangalore",
            pincode: "560001",
            coords: { lat: 12.9730, lng: 77.6050 },
            brands: ["Bajaj", "Pulsar", "Dominar", "Avenger"],
            services: ["Engine Overhaul", "Brake Service", "Chain Replacement", "General Service"]
        }
    ];

    mockMechanics.forEach(data => {
        registerMechanic(data);
    });
}

// Initialize database with mock data
seedMockData();
