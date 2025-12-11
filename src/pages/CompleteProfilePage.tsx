import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

export default function CompleteProfilePage() {
    const [shopName, setShopName] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [services, setServices] = useState('');
    const [brands, setBrands] = useState('');
    const [experience, setExperience] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        // Validate required fields
        if (!shopName || !name || !address || !lat || !lng) {
            setError('Please fill in all required fields');
            return;
        }

        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        if (isNaN(latitude) || isNaN(longitude)) {
            setError('Invalid coordinates');
            return;
        }

        setLoading(true);

        try {
            const user = getCurrentUser();
            if (!user) {
                setError('You must be logged in');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:3001/api/mechanics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    shopName,
                    name,
                    description,
                    address,
                    coords: {
                        lat: latitude,
                        lng: longitude
                    },
                    services: services.split(',').map(s => s.trim()).filter(s => s),
                    brands: brands.split(',').map(b => b.trim()).filter(b => b),
                    experience: experience ? parseInt(experience) : 0
                }),
            });

            const data = await response.json();

            if (data.success) {
                navigate('/');
            } else {
                setError(data.message || 'Failed to create profile');
            }
        } catch (err: any) {
            console.error('Profile creation error:', err);
            setError('Failed to create profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            padding: '40px 20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '600px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔧</div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: '8px'
                    }}>
                        Complete Your Profile
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                        Tell us about your workshop
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Shop Name */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Shop Name *
                            </label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                placeholder="e.g. Best Bikes Workshop"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Mechanic Name */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Your Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Rajesh Kumar"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Address */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Address *
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="123 MG Road, Bangalore"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Latitude */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Latitude *
                            </label>
                            <input
                                type="text"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                placeholder="12.9716"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Longitude */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Longitude *
                            </label>
                            <input
                                type="text"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                placeholder="77.5946"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Services */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Services (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={services}
                                onChange={(e) => setServices(e.target.value)}
                                placeholder="Oil Change, Brake Repair, Engine Tune-up"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Brands */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Bike Brands (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={brands}
                                onChange={(e) => setBrands(e.target.value)}
                                placeholder="Honda, Yamaha, Bajaj, Royal Enfield"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Experience */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Experience (years)
                            </label>
                            <input
                                type="number"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="5"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Description */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                marginBottom: '6px'
                            }}>
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of your services"
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(255,68,68,0.2)',
                            border: '1px solid rgba(255,68,68,0.4)',
                            borderRadius: '8px',
                            color: '#ff4444',
                            fontSize: '13px',
                            marginTop: '16px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#fff',
                            background: loading
                                ? 'rgba(255,255,255,0.1)'
                                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '24px'
                        }}
                    >
                        {loading ? 'Creating Profile...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
