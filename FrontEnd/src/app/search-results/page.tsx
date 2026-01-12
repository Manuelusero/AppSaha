'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Footer } from '@/components/layout';

// Mapeo de categorías del backend a nombres en español
const categoryToSpanish: { [key: string]: string } = {
  'LIMPIEZA': 'Limpieza',
  'PINTURA': 'Pintores',
  'PLOMERIA': 'Plomeros',
  'ELECTRICIDAD': 'Electricistas',
  'CARPINTERIA': 'Carpinteros',
  'JARDINERIA': 'Jardineros',
  'ALBANILERIA': 'Albañiles'
};

interface Provider {
  id: string;
  nombre: string;
  profesion: string;
  descripcion: string;
  categoria: string;
  foto: string;
  rating: number;
  ubicacion: string;
  especialidades: string[];
  reviews: unknown[];
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profesionales, setProfesionales] = useState<Provider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/providers');
        
        if (!response.ok) {
          throw new Error('Error al cargar profesionales');
        }
        
        const data = await response.json();
        
        // Transformar datos del backend al formato esperado
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedData: Provider[] = data.map((provider: any) => {
          // Construir URL de la foto de perfil
          let profileImageUrl = '/Frame16.png'; // Imagen por defecto
          if (provider.providerProfile?.profilePhoto) {
            // Si es un nombre de archivo, construir la URL completa
            if (!provider.providerProfile.profilePhoto.startsWith('http')) {
              profileImageUrl = `http://localhost:8000/uploads/profile/${provider.providerProfile.profilePhoto}`;
            } else {
              profileImageUrl = provider.providerProfile.profilePhoto;
            }
          }

          return {
            id: provider.id,
            nombre: provider.name,
            profesion: categoryToSpanish[provider.providerProfile?.serviceCategory] || provider.providerProfile?.serviceCategory || 'Profesional',
            descripcion: provider.providerProfile?.serviceDescription || provider.providerProfile?.bio || 'Profesional de servicios',
            categoria: provider.providerProfile?.serviceCategory || '',
            foto: profileImageUrl,
            rating: provider.providerProfile?.rating || 0,
            ubicacion: provider.providerProfile?.location || 'Buenos Aires',
            especialidades: provider.providerProfile?.specialties ? 
              (typeof provider.providerProfile.specialties === 'string' ? 
                JSON.parse(provider.providerProfile.specialties) : 
                provider.providerProfile.specialties) : 
              [],
            reviews: []
          };
        });
        
        // Aplicar filtros
        const servicio = searchParams.get('servicio');
        const ubicacion = searchParams.get('ubicacion');
        const especialidadesParam = searchParams.get('especialidades');
        
        let filtrados = transformedData;
        
        if (servicio) {
          filtrados = filtrados.filter(p => p.profesion === servicio);
        }
        
        if (ubicacion) {
          filtrados = filtrados.filter(p => p.ubicacion.toLowerCase().includes(ubicacion.toLowerCase()));
        }

        if (especialidadesParam) {
          const especialidadesBuscadas = especialidadesParam.split(',').map(e => e.trim());
          filtrados = filtrados.filter(p => {
            // Si el proveedor no tiene especialidades definidas, lo incluimos
            if (!p.especialidades || p.especialidades.length === 0) {
              return true;
            }
            // Si tiene especialidades, verificamos coincidencias
            return especialidadesBuscadas.some(espBuscada => 
              p.especialidades.some(e => e.toLowerCase().includes(espBuscada.toLowerCase()))
            );
          });
        }
        
        setProfesionales(filtrados);
      } catch (error) {
        console.error('Error al cargar profesionales:', error);
        setProfesionales([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviders();
  }, [searchParams]);

  const toggleProviderSelection = (id: string) => {
    if (selectedProviders.includes(id)) {
      setSelectedProviders(selectedProviders.filter(pId => pId !== id));
    } else {
      setSelectedProviders([...selectedProviders, id]);
    }
  };

  const handleContinuar = () => {
    if (selectedProviders.length === 0) {
      alert('Por favor seleccioná al menos un profesional');
      return;
    }
    
    // Navegar a job-request con los IDs de los profesionales seleccionados y la ubicación
    const params = new URLSearchParams();
    params.append('professionals', selectedProviders.join(','));
    
    // Pasar la ubicación del searchParams
    const ubicacion = searchParams.get('ubicacion');
    if (ubicacion) {
      params.append('ubicacion', ubicacion);
    }
    
    router.push(`/job-request?${params.toString()}`);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, idx) => (
      <svg
        key={idx}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={idx < rating ? '#FFC107' : 'none'}
        stroke={idx < rating ? '#FFC107' : '#D1D5DB'}
        strokeWidth="2"
        className="inline"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

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
          <Image 
            src="/Logo.png" 
            alt="Serco Logo" 
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
      <main className="flex-1 py-12">
        <div className="w-full" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          {/* Título */}
          <h1 className="text-center mb-4" style={{ fontFamily: 'Maitree, serif', fontSize: '40px', lineHeight: '100%', color: '#244C87', fontWeight: 400 }}>
            Elegí tu profesional
          </h1>

          {/* Filtros aplicados */}
          {(searchParams.get('servicio') || searchParams.get('ubicacion') || searchParams.get('especialidades')) && (
            <div className="max-w-3xl mx-auto mb-12 p-4 bg-blue-50 rounded-2xl">
              <p className="text-center" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#244C87' }}>
                {searchParams.get('servicio') && <span><strong>Servicio:</strong> {searchParams.get('servicio')}</span>}
                {searchParams.get('ubicacion') && <span className="mx-3">•</span>}
                {searchParams.get('ubicacion') && <span><strong>Ubicación:</strong> {searchParams.get('ubicacion')}</span>}
              </p>
              {searchParams.get('especialidades') && (
                <p className="text-center mt-2" style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#244C87' }}>
                  <strong>Especialidades:</strong> {searchParams.get('especialidades')?.split(',').join(', ')}
                </p>
              )}
              <p className="text-center mt-2" style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#6B7280' }}>
                {profesionales.length} profesional{profesionales.length !== 1 ? 'es' : ''} encontrado{profesionales.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Grid de profesionales */}
          <div className="flex flex-col items-center" style={{ gap: '80px'}}>
            {loading ? (
              <div className="text-center py-12">
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#244C87' }}>
                  Cargando profesionales...
                </p>
              </div>
            ) : profesionales.length > 0 ? (
              profesionales.map((prof) => (
                <div 
                  key={prof.id}
                  className="bg-white rounded-3xl overflow-hidden border-2 hover:shadow-2xl transition-all duration-300 relative"
                  style={{ 
                    width: '100%',
                    maxWidth: '432px',
                    height: '514px',
                    borderColor: selectedProviders.includes(prof.id) ? '#244C87' : '#E5E7EB'
                  }}
                >
                  {/* Checkbox de selección */}
                  <div className="absolute top-4 right-4 z-10">
                    <label className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 cursor-pointer transition-all"
                      style={{ 
                        borderColor: selectedProviders.includes(prof.id) ? '#244C87' : '#D1D5DB',
                        backgroundColor: selectedProviders.includes(prof.id) ? '#244C87' : '#FFFFFF'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProviders.includes(prof.id)}
                        onChange={() => toggleProviderSelection(prof.id)}
                        className="hidden"
                      />
                      {selectedProviders.includes(prof.id) && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </label>
                  </div>

                  {/* Imagen del profesional */}
                  <div className="w-full relative" style={{ height: '300px' }}>
                    <Image
                      src={prof.foto}
                      alt={prof.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Información del profesional */}
                  <div className="p-6 flex flex-col justify-between" style={{ height: '214px' }}>
                    <div>
                      <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '24px', fontWeight: 600, lineHeight: '100%', letterSpacing: '0%', color: '#000000', marginBottom: '8px', textTransform: 'capitalize' }}>
                        {prof.nombre}
                      </h2>
                      <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', fontWeight: 400, lineHeight: '100%', letterSpacing: '0%', color: '#000000', marginBottom: '12px' }}>
                        {prof.descripcion}
                      </p>
                      
                      {/* Rating de estrellas */}
                      <div className="flex items-center gap-1 mb-4" style={{ color: '#FFC107' }}>
                        {renderStars(prof.rating)}
                      </div>
                    </div>

                    {/* Botón contactar */}
                    <div className="flex justify-end">
                      <button 
                        className="px-6 py-2 rounded-full border-2 border-gray-300 transition-all duration-300"
                        style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '16px',
                          backgroundColor: 'transparent',
                          color: '#000000'
                        }}
                        onClick={() => router.push(`/providers/${prof.id}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#BFC6EE33';
                          e.currentTarget.style.borderColor = '#244C87';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#D1D5DB';
                        }}
                      >
                        Ver perfil
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#6B7280' }}>
                  No se encontraron profesionales con los criterios seleccionados.
                </p>
              </div>
            )}
          </div>

          {/* Botón de continuar (solo si hay profesionales seleccionados) */}
          {selectedProviders.length > 0 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleContinuar}
                className="px-12 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px',
                  fontWeight: 500,
                  backgroundColor: '#244C87',
                  color: '#FFFFFF'
                }}
              >
                Continuar con {selectedProviders.length} profesional{selectedProviders.length > 1 ? 'es' : ''}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#244C87] mx-auto mb-4"></div>
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#244C87' }}>
            Cargando resultados...
          </p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
