// BasicInfoStep - Step 1 of registration
// Component Composition Pattern

interface BasicInfoStepProps {
    formData: {
        shopName: string;
        name: string;
        email: string;
        phone: string;
    };
    onChange: (field: string, value: string) => void;
}

export const BasicInfoStep = ({ formData, onChange }: BasicInfoStepProps) => {
    return (
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
                        onChange={(e) => onChange('shopName', e.target.value)}
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
                        onChange={(e) => onChange('name', e.target.value)}
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
                        onChange={(e) => onChange('email', e.target.value)}
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
                        onChange={(e) => onChange('phone', e.target.value)}
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
    );
};
