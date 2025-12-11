import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader } from 'lucide-react';
import { registerMechanic } from '../db/store';
import { MechanicRegistrationData } from '../db/schema';
import { geocodeAddress } from '../utils/geocoding';

const COMMON_BRANDS = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Suzuki', 'Royal Enfield', 'KTM', 'Kawasaki', 'Harley-Davidson'];
const COMMON_SERVICES = ['General Service', 'Oil Change', 'Engine Repair', 'Brake Service', 'Tire Replacement', 'Battery Service', 'Chain Replacement', 'Electrical Repair', 'Suspension Service', 'Performance Tuning'];

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        shopName: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        area: '',
        city: '',
        pincode: '',
        coords: { lat: 0, lng: 0 },
        brands: [] as string[],
        services: [] as string[]
    });

    const handleInputChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const toggleBrand = (brand: string) => {
        setFormData(prev => ({
            ...prev,
            brands: prev.brands.includes(brand)
                ? prev.brands.filter(b => b !== brand)
                : [...prev.brands, brand]
        }));
    };

    const toggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleGeocode = async () => {
        if (!formData.pincode) {
            setError('Please enter a pincode');
            return;
        }

        setIsGeocoding(true);
        setError('');

        try {
            const coords = await geocodeAddress(formData.pincode);
            if (coords) {
                setFormData(prev => ({ ...prev, coords }));
                setError('');
            } else {
                setError('Could not find location. Please check pincode.');
            }
        } catch (err) {
            setError('Failed to geocode location');
        } finally {
            setIsGeocoding(false);
        }
    };

    const validateStep1 = () => {
        if (!formData.shopName.trim()) return 'Shop name is required';
        if (!formData.name.trim()) return 'Your name is required';
        if (!formData.email.trim()) return 'Email is required';
        if (!formData.phone.trim()) return 'Phone is required';
        return '';
    };

    const validateStep2 = () => {
        if (!formData.address.trim()) return 'Address is required';
        if (!formData.area.trim()) return 'Area is required';
        if (!formData.city.trim()) return 'City is required';
        if (!formData.pincode.trim()) return 'Pincode is required';
        if (formData.coords.lat === 0 && formData.coords.lng === 0) {
            return 'Please geocode your location';
        }
        return '';
    };

    const validateStep3 = () => {
        if (formData.brands.length === 0) return 'Select at least one brand';
        if (formData.services.length === 0) return 'Select at least one service';
        return '';
    };

    const handleNext = () => {
        let validationError = '';
        if (step === 1) validationError = validateStep1();
        if (step === 2) validationError = validateStep2();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        const validationError = validateStep3();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const data: MechanicRegistrationData = {
                ...formData
            };

            await registerMechanic(data);

            // Success - navigate to home
            navigate('/', { replace: true });
        } catch (err) {
            setError('Registration failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            padding: '24px'
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    <button
                        onClick={() => step === 1 ? navigate('/') : setStep(step - 1)}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#0f172a',
                            margin: 0
                        }}>
                            Register as Mechanic
                        </h1>
                        <p style={{
                            color: '#64748b',
                            fontSize: '14px',
                            margin: '4px 0 0 0'
                        }}>
                            Step {step} of 3
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                    height: '4px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '4px',
                    marginBottom: '32px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        backgroundColor: '#667eea',
                        width: `${(step / 3) * 100}%`,
                        transition: 'width 0.3s'
                    }}></div>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        {error}
                    </div>
                )}

                {/* Form Content */}
                <div style={{
                    backgroundColor: '#ffffff',
                    padding: '32px',
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    {step === 1 && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
                                Basic Information
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        Shop Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.shopName}
                                        onChange={(e) => handleInputChange('shopName', e.target.value)}
                                        placeholder="e.g., Speed Bike Care"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="e.g., Rajesh Kumar"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="e.g., rajesh@speedbike.com"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="e.g., +91-9876543210"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
                                Location Details
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="e.g., 123 MG Road"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                            Area *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.area}
                                            onChange={(e) => handleInputChange('area', e.target.value)}
                                            placeholder="e.g., Indiranagar"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            placeholder="e.g., Bangalore"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        Pincode *
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => handleInputChange('pincode', e.target.value)}
                                            placeholder="e.g., 560038"
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                        />
                                        <button
                                            onClick={handleGeocode}
                                            disabled={isGeocoding}
                                            style={{
                                                padding: '12px 24px',
                                                borderRadius: '8px',
                                                backgroundColor: '#667eea',
                                                color: '#ffffff',
                                                border: 'none',
                                                fontWeight: '600',
                                                cursor: isGeocoding ? 'not-allowed' : 'pointer',
                                                opacity: isGeocoding ? 0.6 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            {isGeocoding && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                                            {isGeocoding ? 'Finding...' : 'Find Location'}
                                        </button>
                                    </div>
                                    {formData.coords.lat !== 0 && (
                                        <p style={{
                                            marginTop: '8px',
                                            fontSize: '12px',
                                            color: '#22c55e',
                                            fontWeight: '600'
                                        }}>
                                            ✓ Location found: {formData.coords.lat.toFixed(4)}, {formData.coords.lng.toFixed(4)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
                                Services & Brands
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                                        Supported Brands * (Select at least one)
                                    </label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {COMMON_BRANDS.map(brand => (
                                            <button
                                                key={brand}
                                                onClick={() => toggleBrand(brand)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: formData.brands.includes(brand) ? '2px solid #667eea' : '1px solid #e2e8f0',
                                                    backgroundColor: formData.brands.includes(brand) ? '#eff6ff' : '#ffffff',
                                                    color: formData.brands.includes(brand) ? '#667eea' : '#64748b',
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {formData.brands.includes(brand) && '✓ '}{brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                                        Services Offered * (Select at least one)
                                    </label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {COMMON_SERVICES.map(service => (
                                            <button
                                                key={service}
                                                onClick={() => toggleService(service)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: formData.services.includes(service) ? '2px solid #667eea' : '1px solid #e2e8f0',
                                                    backgroundColor: formData.services.includes(service) ? '#eff6ff' : '#ffffff',
                                                    color: formData.services.includes(service) ? '#667eea' : '#64748b',
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {formData.services.includes(service) && '✓ '}{service}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid #e2e8f0'
                    }}>
                        {step < 3 && (
                            <button
                                onClick={handleNext}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    backgroundColor: '#667eea',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        )}
                        {step === 3 && (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    backgroundColor: '#22c55e',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    opacity: isSubmitting ? 0.6 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Complete Registration
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;
