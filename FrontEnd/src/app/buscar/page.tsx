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
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ scrollBehavior: 'smooth', backgroundColor: '#FFFCF9' }}>
      {/* Header personalizado para esta página */}
      <header className="w-full px-6 py-4 flex items-center justify-between" style={{
        background: 'linear-gradient(180deg, #3A5FA0 0%, #FFFCF9 100%)',
        paddingTop: '20px',
        paddingBottom: '20px'
      }}>
        {/* Logo placeholder */}
        <div className="text-gray-400 text-sm font-medium" style={{ fontFamily: typography.fontFamily.primary }}>
          LOGO
        </div>
        
        {/* Botón Ofrezco servicios - Glass effect */}
        <button
          onClick={() => router.push('/provider-signup')}
          className="rounded-full backdrop-blur-md border shadow-lg transition-all hover:shadow-xl"
          style={{
            width: '139px',
            height: '39px',
            gap: '10px',
            opacity: 1,
            fontFamily: typography.fontFamily.primary,
            fontSize: '14px',
            color: '#FFFFFF',
            fontWeight: 500,
            backgroundColor: 'rgba(191, 198, 238, 0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          Ofrezco servicios
        </button>
      </header>

      {/* Hero Section */}
      <main id="buscar-servicios" className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-12" style={{ paddingTop: '60px' }}>
        {/* Label SERVICIOS CONFIABLES con línea punteada */}
        <div className="mb-8 flex flex-col items-center">
          <p className="text-center" style={{
            fontFamily: 'Avenir, sans-serif',
            fontSize: '15px',
            fontWeight: 800,
            color: '#5E83AE',
            lineHeight: '100%',
            letterSpacing: '0%',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '0px'
          }}>
            SERVICIOS CONFIABLES
          </p>
          <div style={{ 
            width: '402px',
            maxWidth: '100%',
            height: '36px',
            opacity: 1,
            paddingTop: '8px',
            paddingRight: '16px',
            paddingBottom: '8px',
            paddingLeft: '16px',
            gap: '10px',
            marginTop: '-20px',
            borderBottom: '0.5px dashed',
            borderColor: colors.primary.main,
            borderImageSlice: 1,
            borderImageWidth: 1,
            borderImageOutset: 0,
          }}></div>
        </div>

        {/* Título principal con palabra animada */}
        <div className="text-center mb-6 sm:mb-10 w-full max-w-lg px-4">
          <h1 className="text-[45px] text-center" style={{ 
            fontFamily: typography.fontFamily.primary, 
            color: colors.primary.main,
            fontWeight: 500,
            letterSpacing: '0%',
            lineHeight: '190%'  /* Cambia este valor para ajustar el espacio entre líneas: 120%, 130%, 140%, 150%, etc. */
          }}>
            Encontrá<br />
          
          {/* Carrusel horizontal de profesiones */}
          <div className="relative flex items-center justify-center w-full overflow-hidden" style={{ marginBottom: '0', height: '85px', lineHeight: '85px' }}>
            <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
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
                      opacity: isCenter ? 1 : 0,
                      position: 'absolute',
                      left: isCenter ? '0' : offset < 0 ? '-200px' : '200px',
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <span 
                      className="block text-center transition-all duration-700 whitespace-nowrap text-[45px]"
                      style={{ 
                        fontFamily: typography.fontFamily.primary,
                        color: colors.primary.main,
                        fontWeight: 700,
                        lineHeight: '85px'
                      }}
                    >
                      {profesion}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          confiables en tu<br />zona
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
                setMostrarServicios(true);
              }}
              onFocus={() => {
                // Mostrar dropdown siempre al hacer foco
                setMostrarServicios(true);
              }}
              onBlur={() => {
                // Delay para permitir hacer click en una opción
                setTimeout(() => setMostrarServicios(false), 200);
              }}
              placeholder="¿Qué necesitas?"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base transition-all"
            />
            
            {/* Dropdown de servicios */}
            {mostrarServicios && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                {servicios
                  .filter(s => servicioSeleccionado === '' || s.toLowerCase().includes(servicioSeleccionado.toLowerCase()))
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
                {servicios.filter(s => servicioSeleccionado === '' || s.toLowerCase().includes(servicioSeleccionado.toLowerCase())).length === 0 && (
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
            className="w-full mx-auto flex items-center justify-center gap-2 rounded-full backdrop-blur-md border shadow-lg transition-all hover:shadow-xl"
            style={{
              width: '396px',
              maxWidth: '100%',
              height: '46px',
              borderRadius: '24px',
              paddingTop: '10px',
              paddingRight: '12px',
              paddingBottom: '10px',
              paddingLeft: '12px',
              gap: '10px',
              backgroundColor: 'rgba(191, 198, 238, 0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              fontFamily: typography.fontFamily.primary,
              fontSize: '16px',
              fontWeight: 500,
              color: colors.primary.main
            }}
          >
            <span>Buscar</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </main>

      {/* Sección: ¿Cómo funciona? */}
      <section id="como-funciona" className="w-full py-12 sm:py-16 px-6" style={{ marginTop: '13px', backgroundColor: '#FFFCF9' }}>
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <h2 className="font-normal text-[64px] text-center mb-16" style={{ fontFamily: typography.fontFamily.primary, color: colors.primary.main, fontStyle: 'normal', lineHeight: '1.5', fontSize: typography.fontSize['6xl'] }}>
            ¿Cómo<br />funciona?
          </h2>

          {/* Flujo de pasos */}
          <div className="relative w-full py-8" style={{ paddingLeft: '24px', paddingRight: '24px', top: '30px' }}>
            {/* Contenedor principal con la imagen Line4 y elementos posicionados */}
            <div className="relative" style={{ width: '432px', maxWidth: '100%', opacity: 1 }}>
              {/* Imagen de la línea (Line4.png) */}
              <div className="relative">
                <Image 
                  src="/Line4.png" 
                  alt="Flow line" 
                  width={432} 
                  height={849}
                  style={{ width: '432px', height: '849px', right: '37px', objectFit: 'contain' }}
                  priority
                />
                
                {/* Círculo 1 - Naranja/Terracota (superior izquierda) */}
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '49.23px', 
                    height: '49px', 
                    backgroundColor: colors.accent.brown,
                    left: '-17px',
                    top: '33px'
                  }}
                />

                {/* Círculo 2 - Naranja/Terracota (derecha) */}
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '49.23px', 
                    height: '49px', 
                    backgroundColor: colors.accent.brown,
                    right: '25px',
                    top: '260px'
                  }}
                />

                {/* Círculo 3 - Azul (izquierda medio) */}
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '49.23px', 
                    height: '49px', 
                    backgroundColor: colors.primary.main,
                    left: '103px',
                    top: '587px'
                  }}
                />

                {/* Círculo 4 - Azul (derecha inferior) */}
                <div 
                  className="absolute rounded-full"
                  style={{ 
                    width: '49.23px', 
                    height: '49px', 
                    backgroundColor: colors.primary.main,
                    right: '90px',
                    top: '813px'
                  }}
                />

                {/* Texto 1 - Paso 1 (a la derecha del círculo 1) - 3 renglones */}
                <div className="absolute" style={{ left: '62px', top: '15px', maxWidth: '250px' }}>
                  <p className="font-normal text-[20px] leading-[120%] text-gray-800" style={{ fontFamily: typography.fontFamily.primary }}>
                    Seleccioná el tipo de profesional que necesitas y tu ubicación.
                  </p>
                </div>

                {/* Texto 2 - Paso 2 (a la izquierda del círculo 2) - 4 renglones */}
                <div className="absolute" style={{ left: '110px', top: '290px', maxWidth: '255px' }}>
                  <p className="font-normal text-[20px] leading-[120%] text-gray-800" style={{ fontFamily: typography.fontFamily.primary }}>
                    Describe en detalle el trabajo que necesitas hacer y agrega una foto para mayor referencia.
                  </p>
                </div>

                {/* Texto 3 - Paso 3 (a la derecha del círculo 3) - 4 renglones */}
                <div className="absolute" style={{ left: '170px', top: '595px', maxWidth: '260px' }}>
                  <p className="font-normal text-[20px] leading-[120%] text-gray-800" style={{ fontFamily: typography.fontFamily.primary }}>
                    Selecciona un profesional de la lista para enviar tu solicitud y datos de contacto.
                  </p>
                </div>

                {/* Texto 4 - Paso 4 (a la izquierda del círculo 4) - 3 renglones */}
                <div className="absolute" style={{ left: '55px', top: '855px', maxWidth: '290px' }}>
                  <p className="font-normal text-[20px] leading-[120%] text-gray-800" style={{ fontFamily: typography.fontFamily.primary }}>
                    Listo! El profesional se contactará con vos en un rango de 24 a 48hs
                  </p>
                </div>
              </div>
            </div>
          </div>
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
