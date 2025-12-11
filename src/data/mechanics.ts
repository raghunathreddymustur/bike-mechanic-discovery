import { getAllMechanics } from '../db/store';

export interface Mechanic {
    id: string;
    shopName: string;
    name: string;
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
    brands: string[];
    services: string[];
}

// Static mechanics (original hardcoded data)
const STATIC_MECHANICS: Mechanic[] = [
    {
        id: 'm1',
        shopName: 'Quick Fix Garage',
        name: 'Ramesh Kumar',
        address: '45, 12th Main Road',
        area: 'Indiranagar',
        city: 'Bangalore',
        pincode: '560038',
        coords: { lat: 12.9784, lng: 77.6408 },
        phone: '+91-9876543210',
        rating: 4.5,
        brands: ['Hero', 'Honda', 'Bajaj', 'TVS'],
        services: ['General Service', 'Oil Change', 'Brake Service', 'Engine Repair']
    },
    {
        id: 'm2',
        shopName: 'Speedy Wheels',
        name: 'Suresh Patel',
        address: '23, 5th Cross',
        area: 'Koramangala',
        city: 'Bangalore',
        pincode: '560095',
        coords: { lat: 12.9352, lng: 77.6245 },
        phone: '+91-9876543211',
        rating: 4.2,
        brands: ['Yamaha', 'Suzuki', 'Honda'],
        services: ['General Service', 'Tire Replacement', 'Battery Service']
    },
    {
        id: 'm3',
        shopName: 'Royal Service Center',
        name: 'Vikram Singh',
        address: '78, 4th Block',
        area: 'Jayanagar',
        city: 'Bangalore',
        pincode: '560011',
        coords: { lat: 12.9250, lng: 77.5938 },
        phone: '+91-9876543212',
        rating: 4.8,
        brands: ['Royal Enfield', 'Jawa'],
        services: ['Engine Repair', 'Customization', 'General Service']
    },
    {
        id: 'm4',
        shopName: 'Pro Bike Care',
        name: 'Arjun Reddy',
        address: '12, Outer Ring Road',
        area: 'HSR Layout',
        city: 'Bangalore',
        pincode: '560102',
        coords: { lat: 12.9121, lng: 77.6446 },
        phone: '+91-9876543213',
        rating: 4.3,
        brands: ['KTM', 'Duke', 'RC'],
        services: ['Performance Tuning', 'Suspension Service', 'Engine Repair']
    },
    {
        id: 'm5',
        shopName: 'City Bike Workshop',
        name: 'Manoj Sharma',
        address: '56, 100 Feet Road',
        area: 'BTM Layout',
        city: 'Bangalore',
        pincode: '560076',
        coords: { lat: 12.9166, lng: 77.6101 },
        phone: '+91-9876543214',
        rating: 4.1,
        brands: ['Hero', 'Bajaj', 'TVS'],
        services: ['General Service', 'Chain Replacement', 'Brake Service']
    },
    {
        id: 'm6',
        shopName: 'Elite Motors',
        name: 'Karthik Rao',
        address: '34, Sampige Road',
        area: 'Malleshwaram',
        city: 'Bangalore',
        pincode: '560003',
        coords: { lat: 13.0031, lng: 77.5643 },
        phone: '+91-9876543215',
        rating: 4.6,
        brands: ['Honda', 'Yamaha', 'Suzuki'],
        services: ['Electrical Repair', 'General Service', 'Oil Change']
    },
    {
        id: 'm7',
        shopName: 'Tech Bike Solutions',
        name: 'Rajesh Nair',
        address: '89, ITPL Main Road',
        area: 'Whitefield',
        city: 'Bangalore',
        pincode: '560066',
        coords: { lat: 12.9698, lng: 77.7500 },
        phone: '+91-9876543216',
        rating: 4.4,
        brands: ['KTM', 'Kawasaki', 'Yamaha'],
        services: ['Performance Tuning', 'Engine Repair', 'Suspension Service']
    },
    {
        id: 'm8',
        shopName: 'Highway Garage',
        name: 'Prakash Joshi',
        address: '67, Outer Ring Road',
        area: 'Hebbal',
        city: 'Bangalore',
        pincode: '560024',
        coords: { lat: 13.0358, lng: 77.5970 },
        phone: '+91-9876543217',
        rating: 4.0,
        brands: ['Hero', 'Honda', 'Bajaj'],
        services: ['General Service', 'Tire Replacement', 'Battery Service']
    },
    {
        id: 'm9',
        shopName: 'Premium Bike Care',
        name: 'Anil Kumar',
        address: '45, Sarjapur Road',
        area: 'Marathahalli',
        city: 'Bangalore',
        pincode: '560037',
        coords: { lat: 12.9592, lng: 77.6974 },
        phone: '+91-9876543218',
        rating: 4.7,
        brands: ['Royal Enfield', 'Harley-Davidson'],
        services: ['Customization', 'Engine Repair', 'General Service']
    },
    {
        id: 'm10',
        shopName: 'Smart Service Hub',
        name: 'Deepak Verma',
        address: '23, Bull Temple Road',
        area: 'Basavanagudi',
        city: 'Bangalore',
        pincode: '560004',
        coords: { lat: 12.9421, lng: 77.5753 },
        phone: '+91-9876543219',
        rating: 4.2,
        brands: ['TVS', 'Hero', 'Bajaj'],
        services: ['General Service', 'Chain Replacement', 'Brake Service']
    },
    {
        id: 'm11',
        shopName: 'Express Bike Repair',
        name: 'Santosh Reddy',
        address: '78, Dickenson Road',
        area: 'Frazer Town',
        city: 'Bangalore',
        pincode: '560005',
        coords: { lat: 12.9975, lng: 77.6111 },
        phone: '+91-9876543220',
        rating: 4.3,
        brands: ['Honda', 'Yamaha', 'Suzuki'],
        services: ['Electrical Repair', 'Oil Change', 'General Service']
    },
    {
        id: 'm12',
        shopName: 'Reliable Motors',
        name: 'Ganesh Iyer',
        address: '90, Kanakapura Road',
        area: 'Banashankari',
        city: 'Bangalore',
        pincode: '560070',
        coords: { lat: 12.9255, lng: 77.5655 },
        phone: '+91-9876543221',
        rating: 4.5,
        brands: ['Hero', 'Bajaj', 'TVS', 'Honda'],
        services: ['General Service', 'Engine Repair', 'Tire Replacement', 'Battery Service']
    }
];

// Get all mechanics (static + database)
export function getAllMechanicsData(): Mechanic[] {
    const dbMechanics = getAllMechanics();
    return [...STATIC_MECHANICS, ...dbMechanics];
}

// Export for backward compatibility
export const MECHANICS = getAllMechanicsData();
