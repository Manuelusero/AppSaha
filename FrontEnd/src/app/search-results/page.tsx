'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Footer } from '@/components/layout';
import { apiGet, getProfileImageUrl } from '@/utils';

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

function ProviderStars({ rating }: { rating: number }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={star <= rating ? '#FFC107' : 'none'}
          stroke={star <= rating ? '#FFC107' : '#D1D5DB'}
          strokeWidth="2"
          className="inline"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </>
  );
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
        const data = await apiGet<any[]>('/providers');
        
        // Transformar datos del backend al formato esperado
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedData: Provider[] = data.map((provider: any) => {
          const profileImageUrl = getProfileImageUrl(provider.providerProfile?.profilePhoto);

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
        // En caso de error, mostrar array vacío en lugar de fallar
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

  const servicio = searchParams.get('servicio') || '';
  const ubicacion = searchParams.get('ubicacion') || '';
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFCF9' }}>
      {/* Header con degradado y título */}
      <header 
        className="w-full px-6 flex items-center justify-center relative"
        style={{ 
          background: 'linear-gradient(180deg, #3A5FA0 0%, #FFFCF9 100%)',
          height: '124px'
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

        {/* Título dinámico */}
        <div className="text-center rounded-full" style={{ 
          border: '1px solid #000000',
          width: '311px',
          height: '47px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: 1,
          marginTop: '58px',
          marginBottom: '55px'
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
            {servicio} en {ubicacion || 'tu zona'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="w-full max-w-6xl mx-auto px-6">
          {/* Texto de instrucción */}
          <p className="text-center mb-8" style={{ 
            fontFamily: 'Maitree, serif',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#6B7280'
          }}>
            Selecciona uno o más profesionales para recibir sus presupuestos y tiempos de ejecución
          </p>

          {/* Grid de profesionales: 1 col mobile → 2 col tablet → 3 col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                  className="bg-white overflow-hidden transition-all duration-300 relative w-full"
                  style={{ 
                    borderRadius: '24px',
                    boxShadow: '0px 4px 90px 0px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  {/* Imagen del profesional */}
                  <div className="w-full relative" style={{ height: '260px', borderRadius: '24px 24px 0 0', overflow: 'hidden', backgroundColor: '#E5E7EB' }}>
                    {prof.foto ? (
                      <Image
                        src={prof.foto}
                        alt={prof.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        style={{ borderRadius: '24px 24px 0 0' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#D1D5DB' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="#9CA3AF">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Información del profesional */}
                  <div className="p-6" style={{ backgroundColor: '#FFFCF9' }}>
                    <div className="mb-4">
                      <h2 style={{ 
                        fontFamily: 'Maitree, serif', 
                        fontSize: '32px', 
                        fontWeight: 400, 
                        lineHeight: '100%', 
                        letterSpacing: '0%', 
                        color: '#000000', 
                        marginBottom: '8px'
                      }}>
                        {prof.nombre}
                      </h2>
                      <p style={{ 
                        fontFamily: 'Maitree, serif', 
                        fontSize: '16px', 
                        fontWeight: 400, 
                        lineHeight: '100%', 
                        letterSpacing: '0%', 
                        color: '#000000', 
                        marginBottom: '12px' 
                      }}>
                        {prof.profesion} - {prof.ubicacion}
                      </p>
                      
                      {/* Rating de estrellas */}
                      <div className="flex items-center gap-1 mb-6">
                        <ProviderStars rating={prof.rating} />
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4">
                      <button 
                        className="flex-1 py-3 rounded-full border transition-all duration-300"
                        style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '16px',
                          fontWeight: 500,
                          backgroundColor: '#FFFCF9',
                          color: '#244C87',
                          borderColor: '#244C87'
                        }}
                        onClick={() => router.push(`/providers/${prof.id}`)}
                      >
                        Ver Perfil
                      </button>
                      <button 
                        className="flex-1 py-3 rounded-full border transition-all duration-300"
                        style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '16px',
                          fontWeight: 500,
                          backgroundColor: selectedProviders.includes(prof.id) ? '#244C87' : '#FFFCF9',
                          color: selectedProviders.includes(prof.id) ? '#FFFFFF' : '#244C87',
                          borderColor: '#244C87'
                        }}
                        onClick={() => {
                          toggleProviderSelection(prof.id);
                          setError('');
                        }}
                      >
                        Seleccionar
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

          {/* Botón de continuar y mensaje de error */}
          <div className="flex flex-col items-center mt-16 gap-4">
            <button
              onClick={() => {
                if (selectedProviders.length === 0) {
                  setError('*Seleccioná al menos un profesional para avanzar');
                  return;
                }
                handleContinuar();
              }}
              className="px-12 py-3 rounded-full transition-all duration-300"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px',
                fontWeight: 500,
                backgroundColor: '#E8EAF6',
                color: '#244C87',
                border: 'none'
              }}
            >
              Solicitar Presupuesto
            </button>
            {error && (
              <p style={{
                fontFamily: 'Maitree, serif',
                fontSize: '14px',
                color: '#DC2626',
                textAlign: 'center'
              }}>
                {error}
              </p>
            )}
          </div>
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
