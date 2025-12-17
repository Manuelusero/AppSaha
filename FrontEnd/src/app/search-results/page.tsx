'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

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

export default function SearchResults() {
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
