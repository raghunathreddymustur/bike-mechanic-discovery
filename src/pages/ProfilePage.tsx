import { useParams, useNavigate } from 'react-router-dom';
import { mechanicService } from '../services/MechanicService';
import { ArrowLeft, MapPin, Phone, Star, Wrench, BadgeCheck, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Mechanic } from '../db/schema';

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mechanic, setMechanic] = useState<Mechanic | null>(null);

    useEffect(() => {
        if (id) {
            try {
                const found = mechanicService.getMechanicById(id);
                setMechanic(found);
                if (!found) {
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error('Error loading mechanic:', error);
                navigate('/', { replace: true });
            }
        }
    }, [id, navigate]);

    if (!mechanic) return null;

    return (
        <div style={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header with smaller image */}
            <div style={{
                position: 'relative',
                height: '200px',
                width: '100%',
                backgroundColor: '#1e293b'
            }}>
                <img
                    src="/workshop.png"
                    alt="Workshop"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.6
                    }}
                />

                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.3) 100%)'
                }}></div>

                {/* Back Button */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    right: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 10
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(34,197,94,0.2)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(34,197,94,0.3)',
                        color: '#86efac',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        ✓ Verified
                    </div>
                </div>

                {/* Shop Info Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: '16px'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#ffffff',
                                marginBottom: '6px',
                                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}>
                                {mechanic.shopName}
                            </h1>
                            <p style={{
                                color: '#cbd5e1',
                                fontSize: '15px',
                                fontWeight: '500'
                            }}>
                                {mechanic.name} • {mechanic.area}
                            </p>
                        </div>
                        <div style={{
                            backgroundColor: '#fbbf24',
                            color: '#78350f',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(251,191,36,0.4)'
                        }}>
                            <Star size={18} fill="currentColor" />
                            {mechanic.rating}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                padding: '24px',
                maxWidth: '800px',
                width: '100%',
                margin: '0 auto'
            }}>

                {/* Contact Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    {/* Location Card */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px'
                        }}>
                            <div style={{
                                backgroundColor: '#dbeafe',
                                padding: '10px',
                                borderRadius: '10px',
                                color: '#1e40af',
                                flexShrink: 0
                            }}>
                                <MapPin size={20} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: '11px',
                                    color: '#94a3b8',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '6px'
                                }}>
                                    Address
                                </p>
                                <p style={{
                                    color: '#0f172a',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    marginBottom: '4px'
                                }}>
                                    {mechanic.address}
                                </p>
                                <p style={{
                                    color: '#64748b',
                                    fontSize: '12px'
                                }}>
                                    {mechanic.city} - {mechanic.pincode}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                backgroundColor: '#dcfce7',
                                padding: '10px',
                                borderRadius: '10px',
                                color: '#15803d',
                                flexShrink: 0
                            }}>
                                <Phone size={20} />
                            </div>
                            <div>
                                <p style={{
                                    fontSize: '11px',
                                    color: '#94a3b8',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '6px'
                                }}>
                                    Contact
                                </p>
                                <p style={{
                                    color: '#0f172a',
                                    fontWeight: '700',
                                    fontSize: '16px'
                                }}>
                                    {mechanic.phone}
                                </p>
                                <p style={{
                                    color: '#22c55e',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    marginTop: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    Available Now
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: '#22c55e',
                                        display: 'inline-block',
                                        animation: 'pulse 2s infinite'
                                    }}></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brands Section */}
                <div style={{
                    backgroundColor: '#ffffff',
                    padding: '24px',
                    borderRadius: '16px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        color: '#0f172a',
                        fontWeight: '700',
                        fontSize: '16px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <BadgeCheck size={20} style={{ color: '#3b82f6' }} />
                        Supported Brands
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        {mechanic.brands.map(brand => (
                            <span
                                key={brand}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Services Section */}
                <div style={{
                    backgroundColor: '#ffffff',
                    padding: '24px',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        color: '#0f172a',
                        fontWeight: '700',
                        fontSize: '16px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Wrench size={20} style={{ color: '#f97316' }} />
                        Services
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '12px'
                    }}>
                        {mechanic.services.map(service => (
                            <div
                                key={service}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    backgroundColor: '#fafafa',
                                    border: '1px solid #f1f5f9'
                                }}
                            >
                                <span style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f97316',
                                    flexShrink: 0
                                }}></span>
                                <span style={{
                                    color: '#0f172a',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}>
                                    {service}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div style={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: '#ffffff',
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                boxShadow: '0 -4px 6px rgba(0,0,0,0.05)',
                zIndex: 50
            }}>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <button style={{
                        flex: 1,
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        fontWeight: '700',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        boxShadow: '0 4px 12px rgba(15,23,42,0.2)',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                    >
                        <Phone size={20} />
                        Call Workshop
                    </button>
                    <button style={{
                        flex: 1,
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        fontWeight: '700',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                        <Navigation size={20} />
                        Get Directions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
