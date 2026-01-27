'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';
import { colors, typography, spacing } from '@/styles/tokens';
import { useLocationSearch } from '@/hooks';
import { Modal } from '@/components/ui';

// Array de profesiones para la animación
const profesiones = [
  'plomeros',
  'pintores', 
  'herreros',
  'modistas',
  'jardineros',
  'pintoras',
  'limpiadores',
  'profesores',
  'trabajadores',
  'jardineras',
  'electricistas',
  'masajistas',
  'plomeras',
  'albañiles',
  'carpinteros',
  'carpinteras'
];

// Array de servicios para el selector
const servicios = [
  'Plomeros',
  'Pintores',
  'Herreros',
  'Modistas',
  'Jardineros',
  'Limpiadores',
  'Profesores',
  'Electricistas',
  'Masajistas',
  'Albañiles',
  'Carpinteros'
];

export default function Home() {
  const router = useRouter();
  const [profesionActual, setProfesionActual] = useState(0);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

  // Hook personalizado para búsqueda de ubicaciones
  const {
    ubicacion,
    setUbicacion,
    sugerencias: ubicacionesSugeridas,
    loading: cargandoUbicaciones,
    mostrarDropdown: mostrarUbicaciones,
    setMostrarDropdown: setMostrarUbicaciones,
    seleccionarUbicacion
  } = useLocationSearch({ minChars: 3, debounceMs: 300 });

  // Animación automática de desplazamiento de profesiones con pausa en el centro
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const nextProfesion = () => {
      setProfesionActual((prev) => (prev + 1) % profesiones.length);
      // Esperar más tiempo en la siguiente iteración (pausa en el centro)
      timeout = setTimeout(nextProfesion, 2000);
    };
    
    timeout = setTimeout(nextProfesion, 2000);
    
    return () => clearTimeout(timeout);
  }, []);

  const handleBuscar = () => {
    // Navegar a la página de selección de especialidades
    const params = new URLSearchParams();
    if (servicioSeleccionado) params.append('servicio', servicioSeleccionado);
    if (ubicacion) params.append('ubicacion', ubicacion);
    
    router.push(`/select-specialty?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
      <Header onLoginClick={() => setMostrarModalLogin(true)} />

      {/* Hero Section */}
      <main id="buscar-servicios" className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-12">
        {/* Título principal con palabra animada */}
        <div className="text-center mb-6 sm:mb-10 w-full max-w-lg">
          <h1 className="font-normal text-[32px] sm:text-[48px] leading-tight text-center mb-4 sm:mb-6" style={{ fontFamily: typography.fontFamily.primary, color: colors.primary.main }}>
            Encontrá
          </h1>
          
          {/* Carrusel horizontal de profesiones */}
          <div className="relative h-12 sm:h-20 overflow-hidden mb-3 sm:mb-4 flex items-center justify-center w-full">
            <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
              {/* Mostrar 3 palabras: anterior, actual (centro), siguiente */}
              {[-1, 0, 1].map((offset) => {
                const index = (profesionActual + offset + profesiones.length) % profesiones.length;
                const profesion = profesiones[index];
                const isCenter = offset === 0;
                
                return (
                  <div
                    key={`${index}-${offset}`}
                    className="transition-all duration-700 ease-in-out flex-shrink-0"
                    style={{ 
                      opacity: isCenter ? 1 : 0.4,
                      maxWidth: isCenter ? '200px' : '120px'
                    }}
                  >
                    <span 
                      className={`block text-center transition-all duration-700 whitespace-nowrap overflow-hidden text-ellipsis ${
                        isCenter 
                          ? 'text-[32px] sm:text-[48px] font-bold' 
                          : 'text-[24px] sm:text-[36px] font-normal text-gray-400'
                      }`}
                      style={{ 
                        fontFamily: typography.fontFamily.primary,
                        color: isCenter ? colors.primary.main : undefined
                      }}
                    >
                      {profesion}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <h1 className="font-normal text-[32px] sm:text-[48px] leading-tight text-center" style={{ fontFamily: typography.fontFamily.primary, color: colors.primary.main }}>
            confiables en tu zona
          </h1>
        </div>

        {/* Formulario de búsqueda */}
        <div className="w-full max-w-md space-y-3 sm:space-y-4 px-4">
          {/* Selector de servicio */}
          <div className="relative">
            <input
              type="text"
              value={servicioSeleccionado}
              onChange={(e) => {
                setServicioSeleccionado(e.target.value);
                // Mostrar dropdown solo si hay al menos 2 caracteres
                setMostrarServicios(e.target.value.length >= 2);
              }}
              onFocus={() => {
                // Solo mostrar si ya hay texto escrito
                if (servicioSeleccionado.length >= 2) {
                  setMostrarServicios(true);
                }
              }}
              onBlur={() => {
                // Delay para permitir hacer click en una opción
                setTimeout(() => setMostrarServicios(false), 200);
              }}
              placeholder="¿Qué necesitas?"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base transition-all"
            />
            
            {/* Dropdown de servicios - solo se muestra si hay al menos 2 caracteres */}
            {mostrarServicios && servicioSeleccionado.length >= 2 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                {servicios
                  .filter(s => s.toLowerCase().includes(servicioSeleccionado.toLowerCase()))
                  .map((servicio, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setServicioSeleccionado(servicio);
                        setMostrarServicios(false);
                      }}
                      className="px-4 sm:px-5 py-2 sm:py-3 hover:bg-indigo-50 cursor-pointer text-gray-700 text-sm sm:text-base transition-colors"
                    >
                      {servicio}
                    </div>
                  ))}
                {servicios.filter(s => s.toLowerCase().includes(servicioSeleccionado.toLowerCase())).length === 0 && (
                  <div className="px-4 sm:px-5 py-2 sm:py-3 text-gray-500 text-sm sm:text-base text-center">
                    No se encontraron servicios
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selector de ubicación */}
          <div className="relative">
            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => {
                const value = e.target.value;
                setUbicacion(value);
                // Mostrar dropdown si hay al menos 3 caracteres
                if (value.length >= 3) {
                  setMostrarUbicaciones(true);
                } else {
                  setMostrarUbicaciones(false);
                }
              }}
              onFocus={() => {
                // Solo mostrar si ya hay texto escrito y hay sugerencias
                if (ubicacion.length >= 3 && ubicacionesSugeridas.length > 0) {
                  setMostrarUbicaciones(true);
                }
              }}
              onBlur={() => {
                // Delay más largo para permitir hacer click en una opción
                setTimeout(() => setMostrarUbicaciones(false), 300);
              }}
              placeholder="Ciudad, pueblo o localidad"
              className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base transition-all"
            />
            
            {/* Dropdown de ubicaciones - Muestra resultados de la API */}
            {mostrarUbicaciones && ubicacion.length >= 3 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                {cargandoUbicaciones ? (
                  <div className="px-4 sm:px-5 py-3 text-gray-500 text-sm sm:text-base text-center">
                    Buscando ubicaciones...
                  </div>
                ) : ubicacionesSugeridas.length > 0 ? (
                  ubicacionesSugeridas.map((sugerencia, idx) => (
                    <div
                      key={idx}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevenir que el input pierda el foco
                        seleccionarUbicacion(sugerencia.name);
                      }}
                      className="px-4 sm:px-5 py-2 sm:py-3 hover:bg-indigo-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="text-gray-900 text-sm sm:text-base font-medium">
                        {sugerencia.name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm truncate">
                        {sugerencia.display_name}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 sm:px-5 py-3 text-gray-500 text-sm sm:text-base text-center">
                    No se encontraron ubicaciones
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón de búsqueda */}
          <button
            onClick={handleBuscar}
            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center bg-white border-2 border-gray-200 rounded-full hover:bg-indigo-50 hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </main>

      {/* Sección: ¿Cómo funciona? - Componente de Figma */}
      <section id="como-funciona" className="w-full bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6" style={{ marginTop: '13px' }}>
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          <Image 
            src="/StepByStep.svg" 
            alt="Cómo funciona SAHA - Proceso paso a paso"
            width={480}
            height={768}
            priority
            className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] h-auto"
            style={{ margin: '0 auto' }}
          />
        </div>
      </section>

      {/* Click outside handlers */}
      {(mostrarServicios || mostrarUbicaciones) && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => {
            setMostrarServicios(false);
            setMostrarUbicaciones(false);
          }}
        />
      )}

      <Footer />

      {/* Modal: ¿Ya tienes una cuenta? */}
      <Modal
        isOpen={mostrarModalLogin}
        onClose={() => setMostrarModalLogin(false)}
        variant="brown"
        maxWidth="sm"
      >
        <div className="text-center">
          <h2 
            style={{ 
              fontFamily: typography.fontFamily.primary, 
              fontSize: typography.fontSize['32'], 
              fontWeight: typography.fontWeight.normal,
              color: colors.neutral.white,
              lineHeight: '100%',
              textAlign: 'center',
              marginBottom: spacing[6]
            }}
          >
            ¿Ya tenes una cuenta?
          </h2>
          
          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center w-full px-2">
            <button
              onClick={() => router.push('/login')}
              className="px-4 sm:px-6 py-3 rounded-full transition-colors flex-1 sm:flex-initial"
              style={{ 
                fontFamily: typography.fontFamily.primary, 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.normal,
                color: colors.neutral.black,
                backgroundColor: 'rgba(217, 165, 137, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                minWidth: 'auto'
              }}
            >
              Si, Iniciar sesión
            </button>
            
            <button
              onClick={() => router.push('/provider-signup')}
              className="px-4 sm:px-6 py-3 rounded-full transition-colors flex-1 sm:flex-initial"
              style={{ 
                fontFamily: typography.fontFamily.primary, 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.normal,
                color: colors.neutral.black,
                backgroundColor: 'rgba(217, 165, 137, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                minWidth: 'auto'
              }}
            >
              No, registrarme
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
