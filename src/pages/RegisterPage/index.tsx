// RegisterPage - Main orchestrator for registration flow
// Implements Facade Pattern to coordinate step components

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { StepIndicator } from './components/StepIndicator';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { LocationStep } from './steps/LocationStep';
import { ServicesStep } from './steps/ServicesStep';
import { mechanicService } from '../../services/MechanicService';
import { geocodingService } from '../../services/GeocodingService';
import { MechanicRegistrationData } from '../../db/schema';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<MechanicRegistrationData>({
        shopName: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        area: '',
        city: '',
        pincode: '',
        coords: { lat: 0, lng: 0 },
        brands: [],
        services: []
    });

    const handleFieldChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleToggleBrand = (brand: string) => {
        setFormData(prev => ({
            ...prev,
            brands: prev.brands.includes(brand)
                ? prev.brands.filter(b => b !== brand)
                : [...prev.brands, brand]
        }));
    };

    const handleToggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleGeocode = async () => {
        console.log('[RegisterPage] handleGeocode called');
        console.log('[RegisterPage] Form data:', formData);

        if (!formData.pincode) {
            setError('Please enter a pincode');
            return;
        }

        setIsGeocoding(true);
        setError('');

        try {
            const query = `${formData.address}, ${formData.area}, ${formData.city}, ${formData.pincode}`.trim();
            console.log('[RegisterPage] Geocoding query:', query);

            const coords = await geocodingService.geocodeAddress(query);
            console.log('[RegisterPage] Received coords:', coords);

            if (coords && geocodingService.isValidCoordinates(coords)) {
                console.log('[RegisterPage] Valid coordinates, updating form');
                setFormData(prev => ({ ...prev, coords }));
            } else {
                console.error('[RegisterPage] Invalid coordinates received');
                setError('Could not find location. Please check your address.');
            }
        } catch (err: any) {
            console.error('[RegisterPage] Geocoding error:', err);
            setError(err.message || 'Geocoding failed. Please try again.');
        } finally {
            setIsGeocoding(false);
        }
    };

    const validateStep = (step: number): boolean => {
        setError('');

        if (step === 1) {
            if (!formData.shopName.trim()) {
                setError('Shop name is required');
                return false;
            }
            if (!formData.name.trim()) {
                setError('Your name is required');
                return false;
            }
            if (!formData.email.trim()) {
                setError('Email is required');
                return false;
            }
            if (!formData.phone.trim()) {
                setError('Phone is required');
                return false;
            }
        } else if (step === 2) {
            if (!formData.address.trim()) {
                setError('Address is required');
                return false;
            }
            if (!formData.area.trim()) {
                setError('Area is required');
                return false;
            }
            if (!formData.city.trim()) {
                setError('City is required');
                return false;
            }
            if (!formData.pincode.trim()) {
                setError('Pincode is required');
                return false;
            }
            if (formData.coords.lat === 0 || formData.coords.lng === 0) {
                setError('Please click "Find Location" to geocode your address');
                return false;
            }
        } else if (step === 3) {
            if (formData.brands.length === 0) {
                setError('Please select at least one brand');
                return false;
            }
            if (formData.services.length === 0) {
                setError('Please select at least one service');
                return false;
            }
        }

        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        setError('');
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;

        setIsSubmitting(true);
        setError('');

        try {
            await mechanicService.registerMechanic(formData);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '16px'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                            Register as Mechanic
                        </h1>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
                            Step {currentStep} of 3
                        </p>
                    </div>
                </div>

                <StepIndicator currentStep={currentStep} totalSteps={3} />

                {/* Error Message */}
                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        {error}
                    </div>
                )}

                {/* Step Content */}
                {currentStep === 1 && (
                    <BasicInfoStep
                        formData={formData}
                        onChange={handleFieldChange}
                    />
                )}
                {currentStep === 2 && (
                    <LocationStep
                        formData={formData}
                        onChange={handleFieldChange}
                        onGeocode={handleGeocode}
                        isGeocoding={isGeocoding}
                    />
                )}
                {currentStep === 3 && (
                    <ServicesStep
                        formData={formData}
                        onToggleBrand={handleToggleBrand}
                        onToggleService={handleToggleService}
                    />
                )}

                {/* Navigation Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '32px'
                }}>
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#ffffff',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                    )}
                    {currentStep < 3 ? (
                        <button
                            onClick={handleNext}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#667eea',
                                color: '#ffffff',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            Next
                            <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#22c55e',
                                color: '#ffffff',
                                fontWeight: '600',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                opacity: isSubmitting ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Check size={18} />
                            {isSubmitting ? 'Registering...' : 'Complete Registration'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
