'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProviderReference {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  client: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface ProviderProfile {
  id: string;
  serviceCategory: string;
  serviceDescription?: string;
  bio?: string;
  specialties?: string;
  experience?: number;
  pricePerHour?: number;
  location?: string;
  serviceRadius?: number;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  profilePhoto?: string;
  workPhotos?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
}

interface Provider {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  createdAt: string;
  providerProfile: ProviderProfile;
}

const serviceCategoryLabels: { [key: string]: string } = {
  PLOMERIA: 'Plomero',
  ELECTRICIDAD: 'Electricista',
  CARPINTERIA: 'Carpintero',
  PINTURA: 'Pintor',
  LIMPIEZA: 'Limpiador',
  JARDINERIA: 'Jardinero',
  MECANICA: 'Mecánico',
  CONSTRUCCION: 'Constructor',
  REPARACIONES: 'Reparador',
  MUDANZAS: 'Servicio de mudanzas',
  TECNOLOGIA: 'Técnico',
  OTRO: 'Profesional',
};

export default function ProviderProfile() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [references, setReferences] = useState<ProviderReference[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProviderData(params.id as string);
      fetchReviews(params.id as string);
    }
  }, [params.id]);

  const fetchProviderData = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/providers/${id}`);
      
      if (!response.ok) {
        throw new Error('Proveedor no encontrado');
      }

      const data = await response.json();
      setProvider(data);
      
      // Las referencias vienen en providerProfile.references
      if (data.providerProfile?.references) {
        setReferences(data.providerProfile.references);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar proveedor:', err);
      setLoading(false);
    }
  };

  const fetchReviews = async (providerId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/reviews/provider/${providerId}?limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    }
  };

  const parseSpecialties = (specialties?: string): string[] => {
    if (!specialties) return [];
    try {
      return JSON.parse(specialties);
    } catch {
      return [];
    }
  };

  const parseWorkPhotos = (workPhotos?: string): string[] => {
    if (!workPhotos) return [];
    try {
      const photos = JSON.parse(workPhotos);
      return photos.slice(0, 10); // Máximo 10 fotos
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#244C87] mx-auto mb-4"></div>
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#244C87' }}>
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#DC2626', marginBottom: '20px' }}>
            Profesional no encontrado
          </p>
          <button
            onClick={() => router.push('/search-results')}
            className="px-6 py-2 rounded-full"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '16px',
              backgroundColor: '#244C87',
              color: '#FFFFFF'
            }}
          >
            Volver a la búsqueda
          </button>
        </div>
      </div>
    );
  }

  const specialties = parseSpecialties(provider.providerProfile.specialties);
  const workPhotos = parseWorkPhotos(provider.providerProfile.workPhotos);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header 
        className="px-6 py-4 flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          height: '150px'
        }}
      >
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()}
            className="p-2"
            style={{ cursor: 'pointer' }}
          >
            <svg width="24" height="24" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <Image 
            src="/Logo.png" 
            alt="SaHa Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <a 
          href="/provider-signup"
          className="px-6 py-2 rounded-full border-2 transition-colors"
          style={{ 
            fontFamily: 'Maitree, serif',
            fontSize: '16px',
            borderColor: '#244C87',
            color: '#244C87',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          Espacio del trabajador
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1" style={{ paddingTop: '29px' }}>
        <div className="w-full px-0 md:max-w-4xl md:mx-auto md:px-6">
          {/* Card Principal del Perfil */}
          <div className="bg-white md:rounded-3xl overflow-hidden md:border md:shadow-lg mb-8">
            {/* Imagen Principal */}
            <div className="relative overflow-hidden" style={{ width: '100%', height: '269px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', lineHeight: 0 }}>
              <Image
                src={provider.providerProfile.profilePhoto || '/Frame16.png'}
                alt={provider.name}
                fill
                className="object-cover"
                style={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'block', verticalAlign: 'top' }}
              />
            </div>

            {/* Información del Profesional */}
            <div className="p-4 md:p-8" style={{ paddingTop: '32px', marginTop: '0' }}>
              {/* Nombre */}
              <h1 
                className="text-center"
                style={{ 
                  fontFamily: 'Maitree',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '40px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#244C87',
                  marginBottom: '32px',
                  textTransform: 'capitalize'
                }}
              >
                {provider.name}
              </h1>

              {/* Categoría y Ubicación */}
              <div style={{ paddingLeft: '10px', paddingRight: '32px' }}>
                <p style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '16px', 
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#000000',
                  textAlign: 'left',
                  marginBottom: '16px'
                }}>
                  {serviceCategoryLabels[provider.providerProfile.serviceCategory]} profesional - {provider.providerProfile.location || 'Ubicación no especificada'}
                </p>
              </div>

              {/* Rating de estrellas */}
              <div className="flex items-center gap-1" style={{ paddingLeft: '10px', paddingRight: '32px', marginBottom: '24px' }}>
                {[...Array(5)].map((_, idx) => (
                  <span
                    key={idx}
                    style={{ 
                      color: idx < Math.floor(provider.providerProfile.rating) ? '#DC5F00' : '#D1D5DB',
                      fontSize: '24px'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Botón Pedir Presupuesto */}
              <div className="flex justify-end" style={{ paddingLeft: '32px', marginBottom: '24px' }}>
                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.append('servicio', serviceCategoryLabels[provider.providerProfile.serviceCategory]);
                    params.append('ubicacion', provider.providerProfile.location || 'Ubicación no especificada');
                    params.append('professionals', provider.id);
                    router.push(`/job-request?${params.toString()}`);
                  }}
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '14px',
                    fontWeight: 400,
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '1px solid #D1D5DB',
                    width: 'auto',
                    minWidth: '160px',
                    height: '46px',
                    gap: '10px',
                    opacity: 1,
                    paddingTop: '10px',
                    paddingRight: '16px',
                    paddingBottom: '10px',
                    paddingLeft: '16px',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Pedir presupuesto
                </button>
              </div>

              {/* Línea divisora */}
              <div className="border-t border-gray-300 mb-6"></div>

              {/* Sellos/Badges */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <Image
                    src="/ProfesionalTop.png"
                    alt="Profesional Top"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full border-4 border-gray-300 flex items-center justify-center">
                    <span style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#000000',
                      textAlign: 'center'
                    }}>
                      n°243739
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-300 flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}>
                      <div className="text-center">
                        <div style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '8px',
                          fontWeight: 400,
                          color: '#000000',
                          lineHeight: '100%',
                          marginBottom: '2px'
                        }}>
                          Garantía
                        </div>
                        <div style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '8px',
                          fontWeight: 400,
                          color: '#000000',
                          lineHeight: '100%',
                          marginBottom: '2px'
                        }}>
                          Obligatoria
                        </div>
                        <div style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#000000',
                          lineHeight: '100%'
                        }}>
                          30
                        </div>
                        <div style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '10px',
                          fontWeight: 400,
                          color: '#000000',
                          lineHeight: '100%'
                        }}>
                          días
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experiencia Profesional */}
              <div className="mb-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h2 style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  fontWeight: 600,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#000000',
                  marginBottom: '12px'
                }}>
                  Experiencia profesional:
                </h2>
                <p style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: provider.providerProfile.experience ? '#000000' : '#999999'
                }}>
                  {provider.providerProfile.experience 
                    ? `${provider.providerProfile.experience} años` 
                    : 'No agregó información aún'}
                </p>
              </div>

              {/* Servicios */}
              <div className="mb-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h2 style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  fontWeight: 600,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#000000',
                  marginBottom: '12px'
                }}>
                  Servicios ofrecidos:
                </h2>
                {specialties.length > 0 ? (
                  <ul className="space-y-2">
                    {specialties.map((specialty, index) => (
                      <li 
                        key={index}
                        style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '20px', 
                          fontWeight: 400,
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          color: '#000000'
                        }}
                      >
                        • {specialty}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 400,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#999999'
                  }}>
                    No agregó información aún
                  </p>
                )}
              </div>

              {/* Zonas de Trabajo */}
              <div className="mb-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h2 style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  fontWeight: 600,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#000000',
                  marginBottom: '12px'
                }}>
                  Zonas de Trabajo:
                </h2>
                {provider.providerProfile.location ? (
                  <p style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 400,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000'
                  }}>
                    • {provider.providerProfile.location}
                    {provider.providerProfile.serviceRadius && ` (Radio de ${provider.providerProfile.serviceRadius} km)`}
                  </p>
                ) : (
                  <p style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 400,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#999999'
                  }}>
                    No agregó información aún
                  </p>
                )}
              </div>

              {/* Galería */}
              <div className="mb-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h2 style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  fontWeight: 600,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#000000',
                  marginBottom: '16px'
                }}>
                  Galería
                </h2>
                {workPhotos.length > 0 ? (
                  <div 
                    className="flex gap-4 overflow-x-auto pb-4"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#244C87 #E5E7EB'
                    }}
                  >
                    {workPhotos.map((photo, index) => (
                      <div 
                        key={index} 
                        className="relative flex-shrink-0 overflow-hidden"
                        style={{ 
                          width: '342px', 
                          height: '237px',
                          borderRadius: '24px'
                        }}
                      >
                        <Image
                          src={photo}
                          alt={`Trabajo ${index + 1}`}
                          fill
                          className="object-cover"
                          style={{ borderRadius: '24px' }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 400,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#999999'
                  }}>
                    No agregó fotos aún
                  </p>
                )}
              </div>

              {/* Descripción */}
              {(provider.providerProfile.bio || provider.providerProfile.serviceDescription) && (
                <div className="mb-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                  <h2 style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 600,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000',
                    marginBottom: '12px'
                  }}>
                    Descripción
                  </h2>
                  <p style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 400,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000'
                  }}>
                    {provider.providerProfile.bio || provider.providerProfile.serviceDescription}
                  </p>
                </div>
              )}

              {/* Referencias */}
              <div className="mb-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h2 style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  fontWeight: 600,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#000000',
                  marginBottom: '16px'
                }}>
                  Referencias
                </h2>
                {references.length > 0 ? (
                  <div className="space-y-4">
                    {references.map((reference) => (
                      <div 
                        key={reference.id}
                        className="border-l-4 border-[#244C87] pl-4 py-2"
                      >
                        <p style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '20px', 
                          fontWeight: 400,
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          color: '#000000',
                          marginBottom: '4px'
                        }}>
                          <strong>{reference.name}</strong>
                        </p>
                        <p style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '16px', 
                          fontWeight: 400,
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          color: '#666666',
                          marginBottom: '4px'
                        }}>
                          {reference.relationship}
                        </p>
                        <p style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '16px', 
                          fontWeight: 400,
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          color: '#244C87'
                        }}>
                          📞 {reference.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 400,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#999999'
                  }}>
                    No agregó referencias aún
                  </p>
                )}
              </div>

              {/* Comentarios/Feedbacks */}
              <div className="mb-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h2 style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  fontWeight: 600,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#000000',
                  marginBottom: '16px'
                }}>
                 Reputación
                </h2>
                {reviews.length > 0 ? (
                  <div 
                    className="flex gap-4 overflow-x-auto pb-4"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#244C87 #E5E7EB'
                    }}
                  >
                    {reviews.map((review) => (
                      <div 
                        key={review.id}
                        className="flex-shrink-0 bg-gray-50 rounded-2xl p-6 border border-gray-200"
                        style={{ 
                          width: '350px',
                          minHeight: '200px'
                        }}
                      >
                        {/* Header del comentario */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex-shrink-0">
                            {review.client.avatar ? (
                              <Image
                                src={review.client.avatar}
                                alt={review.client.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-lg">
                                  {review.client.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p style={{ 
                              fontFamily: 'Maitree, serif', 
                              fontSize: '16px', 
                              fontWeight: 600,
                              lineHeight: '100%',
                              color: '#000000',
                              marginBottom: '4px'
                            }}>
                              {review.client.name}
                            </p>
                            <p style={{ 
                              fontFamily: 'Maitree, serif', 
                              fontSize: '12px', 
                              fontWeight: 400,
                              lineHeight: '100%',
                              color: '#666666'
                            }}>
                              {new Date(review.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Estrellas */}
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className="text-lg"
                              style={{ color: i < review.rating ? '#FFC107' : '#D1D5DB' }}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        {/* Comentario */}
                        {review.comment && (
                          <p style={{ 
                            fontFamily: 'Maitree, serif', 
                            fontSize: '14px', 
                            fontWeight: 400,
                            lineHeight: '140%',
                            color: '#333333'
                          }}>
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 400,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#999999'
                  }}>
                    No hay comentarios aún
                  </p>
                )}
              </div>

              {/* Redes Sociales */}
              {(provider.providerProfile.instagram || provider.providerProfile.facebook || provider.providerProfile.website) && (
                <div className="border-t pt-6 mt-6">
                  <h3 style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    lineHeight: '100%',
                    color: '#000000',
                    marginBottom: '12px'
                  }}>
                    Contacto y Redes
                  </h3>
                  <div className="flex gap-4 flex-wrap">
                    {provider.providerProfile.instagram && (
                      <a 
                        href={`https://instagram.com/${provider.providerProfile.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#244C87] hover:underline"
                        style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                      >
                        📷 Instagram
                      </a>
                    )}
                    {provider.providerProfile.facebook && (
                      <a 
                        href={`https://facebook.com/${provider.providerProfile.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#244C87] hover:underline"
                        style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                      >
                        👥 Facebook
                      </a>
                    )}
                    {provider.providerProfile.website && (
                      <a 
                        href={`https://${provider.providerProfile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#244C87] hover:underline"
                        style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                      >
                        🌐 Sitio Web
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-white mt-20">
        <div className="w-full bg-[#244C87]" style={{ height: '60px' }}></div>
        
        <div className="w-full bg-white py-8">
          <div className="flex justify-center">
            <Image 
              src="/Logo.png" 
              alt="SaHa Logo" 
              width={484} 
              height={134}
              className="w-auto"
              style={{ maxWidth: '484px', height: 'auto' }}
            />
          </div>
        </div>

        <div className="w-full bg-[#244C87] py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-16" style={{ gap: '86px', paddingLeft: '49.05px', paddingRight: '49.05px' }}>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center">
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Clientes</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Buscar Servidores</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>¿Cómo Funciona?</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Seguridad y Confianza</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Ayuda</a></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Proveedores</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Sumate como proveedor</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Experiencias</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Recursos útiles</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Soporte Proveedores</a></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Empresa</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Sobre nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Trabaja con nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Contacto</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Prensa</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/30 mb-8"></div>

            <div className="text-center">
              <p style={{ fontFamily: 'Maitree, serif', fontStyle: 'italic', fontSize: '16px' }}>Creado por Bren y Manu</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
