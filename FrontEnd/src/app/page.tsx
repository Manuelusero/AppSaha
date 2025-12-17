'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

interface LocationSuggestion {
  display_name: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [profesionActual, setProfesionActual] = useState(0);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [ubicacionesSugeridas, setUbicacionesSugeridas] = useState<LocationSuggestion[]>([]);
  const [cargandoUbicaciones, setCargandoUbicaciones] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [providerData, setProviderData] = useState<{
    id: string;
    nombre: string;
    profileImage?: string;
  } | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // useEffect para hacer debounce en la búsqueda de ubicaciones
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ubicacion.length >= 3) {
        buscarUbicaciones(ubicacion);
      }
    }, 300); // Espera 300ms después de que el usuario deja de escribir

    return () => clearTimeout(timer);
  }, [ubicacion]);

  // Función para buscar ubicaciones en Argentina usando Nominatim
  const buscarUbicaciones = async (query: string) => {
    if (query.length < 3) {
      setUbicacionesSugeridas([]);
      return;
    }

    setCargandoUbicaciones(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)},Argentina` +
        `&format=json` +
        `&addressdetails=1` +
        `&limit=15` +
        `&accept-language=es`
      );
      const data = await response.json();
      
      console.log('Resultados de Nominatim:', data); // Debug
      
      // Filtrar y formatear resultados - más permisivo
      const ubicacionesFiltradas = data
        .filter((item: {type?: string; class?: string; addresstype?: string}) => {
          // Aceptar múltiples tipos de lugares
          const esLugarValido = 
            item.type === 'city' || 
            item.type === 'town' || 
            item.type === 'village' || 
            item.type === 'municipality' ||
            item.type === 'administrative' ||
            item.class === 'place' ||
            item.class === 'boundary' ||
            item.addresstype === 'city' ||
            item.addresstype === 'town' ||
            item.addresstype === 'village';
          
          return esLugarValido;
        })
        .map((item: {display_name: string; name?: string; address?: {city?: string; town?: string; village?: string; municipality?: string}}) => {
          // Obtener el nombre más apropiado
          const nombre = item.name || 
                        item.address?.city || 
                        item.address?.town || 
                        item.address?.village || 
                        item.address?.municipality ||
                        item.display_name.split(',')[0];
          
          return {
            display_name: item.display_name,
            name: nombre
          };
        });
      
      console.log('Ubicaciones filtradas:', ubicacionesFiltradas); // Debug
      setUbicacionesSugeridas(ubicacionesFiltradas);
    } catch (error) {
      console.error('Error al buscar ubicaciones:', error);
      setUbicacionesSugeridas([]);
    } finally {
      setCargandoUbicaciones(false);
    }
  };

  // Verificar si hay un proveedor logueado
  useEffect(() => {
    const providerId = localStorage.getItem('providerId');
    if (providerId) {
      setIsLoggedIn(true);
      // Cargar datos del proveedor
      fetch(`http://localhost:8000/api/providers/${providerId}`)
        .then(res => res.json())
        .then(data => {
          const profile = data.providerProfile;
          let profileImageUrl = '/Frame16.png'; // Imagen por defecto
          if (profile?.profilePhoto) {
            if (!profile.profilePhoto.startsWith('http')) {
              profileImageUrl = `http://localhost:8000/uploads/profile/${profile.profilePhoto}`;
            } else {
              profileImageUrl = profile.profilePhoto;
            }
          }
          setProviderData({
            id: providerId,
            nombre: data.name || 'Proveedor',
            profileImage: profileImageUrl
          });
        })
        .catch(err => console.error('Error al cargar proveedor:', err));
    }
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-menu-container')) {
          setShowProfileMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

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
      {/* Header con degradado */}
      <header 
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          minHeight: '80px',
          height: 'auto'
        }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <div style={{ 
            width: '100px', 
            height: '45px',
            background: 'url(/LOGO.svg) no-repeat center center',
            backgroundSize: 'contain',
            mixBlendMode: 'multiply',
            opacity: 1,
            borderRadius: '25px',
            transform: 'rotate(0deg)'
          }} 
          className="sm:w-[145px] sm:h-[66px]"
          aria-label="Serco Logo"
          />
        </div>
        
        {/* Menú de usuario logueado o botón de login */}
        {isLoggedIn && providerData ? (
          <div className="relative profile-menu-container">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(191, 198, 238, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '24px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Foto de perfil */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/dashboard-provider');
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #244C87',
                  cursor: 'pointer'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={providerData.profileImage}
                  alt={providerData.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              {/* Flecha hacia abajo */}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#244C87" 
                strokeWidth="2"
                style={{
                  transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>

            {/* Menú desplegable */}
            {showProfileMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '60px',
                  right: '0',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden',
                  minWidth: '200px',
                  zIndex: 1000
                }}
              >
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push('/dashboard-provider');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    color: '#244C87',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Mi Perfil
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push('/dashboard-provider?tab=solicitudes');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    color: '#244C87',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  Ver Solicitudes
                </button>

                <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }}></div>

                <button
                  onClick={() => {
                    localStorage.removeItem('providerId');
                    setIsLoggedIn(false);
                    setProviderData(null);
                    setShowProfileMenu(false);
                    router.push('/');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setMostrarModalLogin(true)}
            className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap flex-shrink-0"
            style={{ 
              fontFamily: 'Maitree, serif',
              fontWeight: 400,
              fontStyle: 'normal',
              lineHeight: '100%',
              letterSpacing: '0%',
              height: 'auto',
              gap: '10px',
              opacity: 1,
              borderRadius: '20px',
              backgroundColor: 'rgba(191, 198, 238, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#000000',
              cursor: 'pointer',
              transform: 'rotate(0deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            Espacio del trabajador
          </button>
        )}
      </header>

      {/* Hero Section */}
      <main id="buscar-servicios" className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-12">
        {/* Título principal con palabra animada */}
        <div className="text-center mb-6 sm:mb-10 w-full max-w-lg">
          <h1 className="font-normal text-[32px] sm:text-[48px] leading-tight text-center text-[#244C87] mb-4 sm:mb-6" style={{ fontFamily: 'Maitree, serif' }}>
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
                          ? 'text-[32px] sm:text-[48px] font-bold text-[#244C87]' 
                          : 'text-[24px] sm:text-[36px] font-normal text-gray-400'
                      }`}
                      style={{ fontFamily: 'Maitree, serif' }}
                    >
                      {profesion}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <h1 className="font-normal text-[32px] sm:text-[48px] leading-tight text-center text-[#244C87]" style={{ fontFamily: 'Maitree, serif' }}>
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
                  setUbicacionesSugeridas([]);
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
                        setUbicacion(sugerencia.name);
                        setMostrarUbicaciones(false);
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

      {/* Sección: Explora las categorías */}
      <section className="w-full bg-white py-12 sm:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Título */}
          <h2 className="font-normal text-[48px] leading-[100%] text-center text-[#244C87] mb-6" style={{ fontFamily: 'Maitree, serif' }}>
            Explora las categorías
          </h2>
          
          {/* Párrafo descriptivo */}
          <p className="font-normal text-[20px] leading-[100%] text-center text-gray-700 mb-12 max-w-3xl mx-auto" style={{ fontFamily: 'Maitree, serif' }}>
            Si tienes dudas de qué servicio necesitas podés revisar nuestro listado de categorías con ejemplos y experiencias de usuarios
          </p>

          {/* Grid de categorías */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Categoría: Pintura */}
            <div className="flex flex-col items-center">
              <div 
                className="overflow-hidden bg-white flex items-center justify-center"
                style={{ 
                  width: '180px', 
                  height: '203px', 
                  borderRadius: '80px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E5E7EB',
                  opacity: 1
                }}
              >
                <Image 
                  src="/Frame8.png" 
                  alt="Pintura" 
                  width={180} 
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Categoría: Carpintería */}
            <div className="flex flex-col items-center">
              <div 
                className="overflow-hidden bg-white flex items-center justify-center"
                style={{ 
                  width: '180px', 
                  height: '203px', 
                  borderRadius: '80px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E5E7EB',
                  opacity: 1
                }}
              >
                <Image 
                  src="/Frame9.png" 
                  alt="Carpintería" 
                  width={180} 
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Categoría: Herreros */}
            <div className="flex flex-col items-center">
              <div 
                className="overflow-hidden bg-white flex items-center justify-center"
                style={{ 
                  width: '180px', 
                  height: '203px', 
                  borderRadius: '80px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E5E7EB',
                  opacity: 1
                }}
              >
                <Image 
                  src="/Frame15.png" 
                  alt="Herreros" 
                  width={180} 
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Categoría: Albañiles */}
            <div className="flex flex-col items-center">
              <div 
                className="overflow-hidden bg-white flex items-center justify-center"
                style={{ 
                  width: '180px', 
                  height: '203px', 
                  borderRadius: '80px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E5E7EB',
                  opacity: 1
                }}
              >
                <Image 
                  src="/Frame19.png" 
                  alt="Albañiles" 
                  width={180} 
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Categoría: Pintura (repetida) */}
            <div className="flex flex-col items-center">
              <div 
                className="overflow-hidden bg-white flex items-center justify-center"
                style={{ 
                  width: '180px', 
                  height: '203px', 
                  borderRadius: '80px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E5E7EB',
                  opacity: 1
                }}
              >
                <Image 
                  src="/Frame8.png" 
                  alt="Pintura" 
                  width={180} 
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Categoría: Carpintería (repetida) */}
            <div className="flex flex-col items-center">
              <div 
                className="overflow-hidden bg-white flex items-center justify-center"
                style={{ 
                  width: '180px', 
                  height: '203px', 
                  borderRadius: '80px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E5E7EB',
                  opacity: 1
                }}
              >
                <Image 
                  src="/Frame9.png" 
                  alt="Carpintería" 
                  width={180} 
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Categoría: Herreros (repetida) */}
            <div className="flex flex-col items-center">
              <div 
                className="overflow-hidden bg-white flex items-center justify-center"
                style={{ 
                  width: '180px', 
                  height: '203px', 
                  borderRadius: '80px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E5E7EB',
                  opacity: 1
                }}
              >
                <Image 
                  src="/Frame15.png" 
                  alt="Herreros" 
                  width={180} 
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: ¿Cómo funciona? */}
      <section id="como-funciona" className="w-full bg-white py-12 sm:py-16 px-6" style={{ marginTop: '13px' }}>
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <h2 className="font-normal text-[64px] text-center text-[#244C87] mb-16" style={{ fontFamily: 'Maitree, serif', fontStyle: 'normal', lineHeight: '1.5' }}>
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
                    backgroundColor: '#B45B39',
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
                    backgroundColor: '#B45B39',
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
                    backgroundColor: '#244C87',
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
                    backgroundColor: '#244C87',
                    right: '90px',
                    top: '813px'
                  }}
                />

                {/* Texto 1 - Paso 1 (a la derecha del círculo 1) - 3 renglones */}
                <div className="absolute" style={{ left: '62px', top: '15px', maxWidth: '250px' }}>
                  <p className="font-normal text-[20px] leading-[120%] text-gray-800" style={{ fontFamily: 'Maitree, serif' }}>
                    Seleccioná el tipo de profesional que necesitas y tu ubicación.
                  </p>
                </div>

                {/* Texto 2 - Paso 2 (a la izquierda del círculo 2) - 4 renglones */}
                <div className="absolute" style={{ left: '110px', top: '290px', maxWidth: '255px' }}>
                  <p className="font-normal text-[20px] leading-[120%] text-gray-800" style={{ fontFamily: 'Maitree, serif' }}>
                    Describe en detalle el trabajo que necesitas hacer y agrega una foto para mayor referencia.
                  </p>
                </div>

                {/* Texto 3 - Paso 3 (a la derecha del círculo 3) - 4 renglones */}
                <div className="absolute" style={{ left: '170px', top: '595px', maxWidth: '260px' }}>
                  <p className="font-normal text-[20px] leading-[120%] text-gray-800" style={{ fontFamily: 'Maitree, serif' }}>
                    Selecciona un profesional de la lista para enviar tu solicitud y datos de contacto.
                  </p>
                </div>

                {/* Texto 4 - Paso 4 (a la izquierda del círculo 4) - 3 renglones */}
                <div className="absolute" style={{ left: '55px', top: '855px', maxWidth: '290px' }}>
                  <p className="font-normal text-[20px] leading-[120%] text-gray-800" style={{ fontFamily: 'Maitree, serif' }}>
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

      {/* Footer */}
      <footer className="w-full text-white" style={{ marginTop: '150px' }}>
        {/* Franja azul superior */}
        <div className="w-full bg-[#244C87]" style={{ height: '60px' }}></div>
        
        {/* Contenedor del logo con fondo blanco */}
        <div className="w-full bg-white py-6 sm:py-8 px-4">
          <div className="flex justify-center">
            <Image 
              src="/Logo.png" 
              alt="Serco Logo" 
              width={484} 
              height={134}
              className="w-full sm:w-auto max-w-[300px] sm:max-w-[484px]"
              style={{ height: 'auto' }}
            />
          </div>
        </div>

        {/* Resto del footer con fondo azul */}
        <div className="w-full bg-[#244C87] py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

          {/* Redes Sociales */}
          <div className="flex justify-center items-center mb-8 sm:mb-16 gap-6 sm:gap-12">
            {/* LinkedIn */}
            <a href="#" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a href="#" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          {/* Navegación en 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16 text-center">
            {/* Para Clientes */}
            <div>
              <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Para Clientes</h3>
              <ul className="space-y-3">
                <li><a href="#buscar-servicios" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Buscar Servidores</a></li>
                <li><a href="#como-funciona" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>¿Cómo Funciona?</a></li>
                <li><a href="/seguridad-confianza" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Seguridad y Confianza</a></li>
                <li><a href="/ayuda" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Ayuda</a></li>
              </ul>
            </div>

              {/* Para Proveedores */}
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Para Proveedores</h3>
                <ul className="space-y-3">
                  <li><a href="/provider-signup" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Sumate como proveedor</a></li>
                  <li><a href="/experiencias" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Experiencias</a></li>
                  <li><a href="/recursos" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Recursos útiles</a></li>
                  <li><a href="/soporte-proveedores" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Soporte Proveedores</a></li>
                </ul>
              </div>            {/* Empresa */}
            <div>
              <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Empresa</h3>
              <ul className="space-y-3">
                <li><button onClick={() => router.push('/sobre-nosotros')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Sobre nosotros</button></li>
                <li><button onClick={() => router.push('/trabaja-con-nosotros')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Trabaja con nosotros</button></li>
                <li><button onClick={() => router.push('/contacto')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Contacto</button></li>
                <li><button onClick={() => router.push('/prensa')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Prensa</button></li>
              </ul>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-white/30 mb-8"></div>

          {/* Texto final */}
          <div className="text-center">
            <p style={{ fontFamily: 'Maitree, serif', fontStyle: 'italic', fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Creado por Bren y Manu</p>
          </div>
          </div>
        </div>
      </footer>

      {/* Modal: ¿Ya tienes una cuenta? */}
      {mostrarModalLogin && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setMostrarModalLogin(false)}
        >
          <div 
            className="relative mx-6"
            style={{
              width: '432px',
              height: '223px',
              maxWidth: '90%',
              backgroundColor: '#B45B39',
              borderRadius: '24px',
              padding: '32px 24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              opacity: 1,
              transform: 'rotate(0deg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setMostrarModalLogin(false)}
              className="absolute top-4 right-4"
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: '8px' }}
            >
              <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Contenido del modal */}
            <div className="text-center">
              <h2 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '32px', 
                  fontWeight: 400,
                  fontStyle: 'normal',
                  color: '#FFFFFF',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  marginBottom: '24px'
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
                    fontFamily: 'Maitree, serif', 
                    fontSize: '14px',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000',
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
                    fontFamily: 'Maitree, serif', 
                    fontSize: '14px',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000',
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
          </div>
        </div>
      )}
    </div>
  );
}
