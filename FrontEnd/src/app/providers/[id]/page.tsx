'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Footer } from '@/components/layout';
import { apiGet, getProfileImageUrl, getPortfolioImageUrl, serviceCategoryLabels } from '@/utils';

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

export default function ProviderProfile() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [references, setReferences] = useState<ProviderReference[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProviderData(params.id as string);
      fetchReviews(params.id as string);
    }
  }, [params.id]);

  const fetchProviderData = async (id: string) => {
    try {
      const data = await apiGet<any>(`/providers/${id}`);
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
      const data = await apiGet<any>(`/reviews/provider/${providerId}?limit=10`);
      setReviews(data.reviews || []);
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
      // Construir URLs completas para cada foto
      const urls = photos.slice(0, 10).map((photo: string) => {
        return getPortfolioImageUrl(photo);
      });
      console.log('Work photos URLs:', urls);
      return urls;
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
        className="w-full flex items-center justify-center relative"
        style={{ 
          background: 'linear-gradient(180deg, #3A5FA0 0%, #FFFCF9 100%)',
          height: '124px',
          paddingLeft: '48px',
          paddingRight: '48px'
        }}
      >
        {/* Flecha de regreso */}
        <button
          onClick={() => router.back()}
          className="absolute left-6"
          style={{ cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
        </button>

        {/* Título Perfil Profesional */}
        <div className="rounded-full" style={{ 
          border: '1px solid #000000',
          width: '311px',
          maxWidth: '100%',
          height: '47px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1
        }}>
          <h1 style={{ 
            fontFamily: 'Maitree, serif', 
            fontSize: '20px', 
            lineHeight: '100%', 
            color: '#000000', 
            fontWeight: 400,
            letterSpacing: '0%',
            textAlign: 'center',
            opacity: 0.6
          }}>
            Perfil Profesional
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1" style={{ paddingTop: '29px' }}>
        <div className="w-full px-0 md:max-w-4xl md:mx-auto md:px-6">
          {/* Card Principal del Perfil */}
          <div className="bg-white md:rounded-3xl overflow-hidden md:border md:shadow-lg mb-8">
            {/* Imagen Principal */}
            <div className="relative overflow-hidden" style={{ width: '100%', height: '269px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', lineHeight: 0, backgroundColor: '#E5E7EB' }}>
              {getProfileImageUrl(provider.providerProfile.profilePhoto) ? (
                <Image
                  src={getProfileImageUrl(provider.providerProfile.profilePhoto)}
                  alt={provider.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                  style={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'block', verticalAlign: 'top' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="#9CA3AF">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              )}
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
                    key={`star-${idx}`}
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
                    backgroundColor: '#244C87',
                    color: '#FFFFFF',
                    border: 'none',
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
                    {specialties.map((specialty) => (
                      <li 
                        key={specialty}
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
                    {workPhotos.map((photo) => (
                      <div 
                        key={photo} 
                        className="relative flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ 
                          width: '342px', 
                          height: '237px',
                          borderRadius: '24px'
                        }}
                        onClick={() => {
                          console.log('Opening image:', photo);
                          setSelectedImageIndex(workPhotos.indexOf(photo));
                          setLightboxOpen(true);
                        }}
                      >
                        <Image
                          src={photo}
                          alt={`Trabajo ${workPhotos.indexOf(photo) + 1}`}
                          fill
                          sizes="342px"
                          style={{ 
                            objectFit: 'cover',
                            borderRadius: '24px'
                          }}
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
                    className="flex gap-2 overflow-x-auto pb-4"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#244C87 #E5E7EB'
                    }}
                  >
                    {reviews.map((review) => (
                      <div 
                        key={review.id}
                        className="flex-shrink-0 rounded-lg"
                        style={{ 
                          width: '194px',
                          height: '135px',
                          backgroundColor: '#D1D5DB',
                          borderRadius: '8px',
                          padding: '8px',
                          gap: '8px',
                          opacity: 1,
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Header: Avatar, Nombre y Rating */}
                        <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                          <div className="flex items-center gap-2">
                            {/* Avatar */}
                            {review.client.avatar ? (
                              <Image
                                src={review.client.avatar}
                                alt={review.client.name}
                                width={26}
                                height={26}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="rounded-full bg-white flex items-center justify-center" style={{ width: '26px', height: '26px' }}>
                                <span style={{ 
                                  fontFamily: 'Maitree, serif',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#244C87'
                                }}>
                                  {review.client.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            
                            {/* Nombre */}
                            <p style={{ 
                              fontFamily: 'Maitree, serif',
                              fontSize: '14px',
                              fontWeight: 400,
                              lineHeight: '100%',
                              color: '#000000',
                              width: '41px',
                              height: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {review.client.name}
                            </p>
                          </div>

                          {/* Card de rating */}
                          <div 
                            className="flex items-center gap-1"
                            style={{ 
                              width: '56px',
                              height: '26px',
                              backgroundColor: '#6B7280',
                              borderRadius: '8px',
                              paddingTop: '4px',
                              paddingRight: '8px',
                              paddingBottom: '4px',
                              paddingLeft: '8px',
                              opacity: 1
                            }}
                          >
                            <span style={{ color: '#DC5F00', fontSize: '16px' }}>★</span>
                            <span style={{ 
                              fontFamily: 'Maitree, serif',
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#FFFFFF'
                            }}>
                              {review.rating}
                            </span>
                          </div>
                        </div>

                        {/* Comentario */}
                        {review.comment && (
                          <p style={{ 
                            fontFamily: 'Maitree, serif', 
                            fontSize: '14px', 
                            fontWeight: 400,
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            color: '#000000',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical'
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

      <Footer />

      {/* Lightbox Modal */}
      {lightboxOpen && workPhotos.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
            {/* Botón cerrar */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Botón anterior */}
            {selectedImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(prev => prev - 1);
                }}
                className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Imagen */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={workPhotos[selectedImageIndex]}
                alt={`Trabajo ${selectedImageIndex + 1}`}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Botón siguiente */}
            {selectedImageIndex < workPhotos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(prev => prev + 1);
                }}
                className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Contador */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
              <p className="text-white text-sm">
                {selectedImageIndex + 1} / {workPhotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
