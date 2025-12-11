// ServicesStep - Step 3 of registration
// Brand and service selection

const COMMON_BRANDS = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Suzuki', 'Royal Enfield', 'KTM', 'Kawasaki', 'Harley-Davidson'];
const COMMON_SERVICES = ['General Service', 'Oil Change', 'Engine Repair', 'Brake Service', 'Tire Replacement', 'Battery Service', 'Chain Replacement', 'Electrical Repair', 'Suspension Service', 'Performance Tuning'];

interface ServicesStepProps {
    formData: {
        brands: string[];
        services: string[];
    };
    onToggleBrand: (brand: string) => void;
    onToggleService: (service: string) => void;
}

export const ServicesStep = ({ formData, onToggleBrand, onToggleService }: ServicesStepProps) => {
    return (
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
                                onClick={() => onToggleBrand(brand)}
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
                                onClick={() => onToggleService(service)}
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
    );
};
