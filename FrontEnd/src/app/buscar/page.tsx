'use client';
          <button
            onClick={() => router.push('/provider-signup')}
            className="rounded-full backdrop-blur-md border shadow-lg transition-all hover:shadow-xl"
            style={{
              padding: '8px 12px',
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
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Ofrezco servicios
          </button>
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
        {/* Logo */}
        <div>
          <Link href="/" aria-label="Ir a inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Logo.png" alt="Logo" className="w-[80px] h-auto" />
          </Link>
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
            color: '#000000',
            fontWeight: 500,
            backgroundColor: 'rgba(191, 198, 238, 0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
          }}
        >
          Ofrezco servicios
        </button>
      </header>

      {/* Hero Section */}
      <main id="buscar-servicios" className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-12" style={{ paddingTop: '60px' }}>
        {/* Encabezado: Servicios Confiables + línea punteada */}
        <div className="w-full flex flex-col items-center mb-4">
          <div
            className="text-center"
            style={{
              fontFamily: `Avenir, ${typography.fontFamily.primary}`,
              fontWeight: 800,
              fontStyle: 'normal',
              fontSize: '15px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: colors.primary.main,
            }}
          >
            SERVICIOS CONFIABLES
          </div>
          <div style={{ width: '220px', maxWidth: '80%', borderTop: '1px dotted rgba(0,0,0,0.12)', marginTop: '8px' }} />
        </div>

        {/* Título principal con palabra animada */}
        <div className="text-center mb-6 sm:mb-10 w-full max-w-lg md:max-w-5xl px-4">

          {/* ── MOBILE: apilado vertical (sin cambios) ── */}
          <h1 className="md:hidden text-[45px] text-center buscar-mobile-title" style={{ 
            fontFamily: typography.fontFamily.primary, 
            color: colors.primary.main,
            fontWeight: 500,
            letterSpacing: '0%',
            lineHeight: '190%'
          }}>
            Encontrá<br />
            <div className="relative flex items-center justify-center w-full overflow-hidden buscar-profession-wrap" style={{ marginBottom: '0', height: '85px', lineHeight: '85px' }}>
              <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2 buscar-profession-inner">
                {[-1, 0, 1].map((offset) => {
                  const index = (profesionActual + offset + profesiones.length) % profesiones.length;
                  const profesion = profesiones[index];
                  const isCenter = offset === 0;
                  return (
                      <div
                      key={`mobile-${index}-${offset}`}
                      className="transition-all duration-700 ease-in-out flex-shrink-0"
                      style={{ 
                        opacity: isCenter ? 1 : 0,
                        position: 'absolute',
                        left: isCenter ? '0' : offset < 0 ? '-200px' : '200px',
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none'
                      }}
                    >
                      <span className="block text-center transition-all duration-700 whitespace-nowrap buscar-profession-text" style={{ fontFamily: typography.fontFamily.primary, color: colors.primary.main, fontWeight: 700, lineHeight: '85px' }}>
                        {profesion}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <span className="buscar-confiables">confiables en tu</span><br /><span className="buscar-zona">zona</span>
          </h1>

          {/* ── DESKTOP: todo en una línea horizontal ── */}
          <h1 className="hidden md:flex items-center justify-center gap-2 lg:gap-4 text-[32px] lg:text-[45px]" style={{ 
            fontFamily: typography.fontFamily.primary, 
            color: colors.primary.main,
            fontWeight: 500,
            lineHeight: '1.2',
            whiteSpace: 'nowrap'
          }}>
            <span>Encontrá</span>

            {/* Carrusel inline */}
            <span className="relative inline-flex items-center justify-center overflow-hidden flex-shrink-0" style={{ width: 'clamp(190px, 25vw, 280px)', height: 'clamp(44px, 6vw, 60px)' }}>
              {[-1, 0, 1].map((offset) => {
                const index = (profesionActual + offset + profesiones.length) % profesiones.length;
                const profesion = profesiones[index];
                const isCenter = offset === 0;
                return (
                  <span
                    key={`desktop-${index}-${offset}`}
                    className="transition-all duration-700 ease-in-out"
                    style={{ 
                      opacity: isCenter ? 1 : 0,
                      position: 'absolute',
                      left: isCenter ? '50%' : offset < 0 ? '-50%' : '150%',
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      fontWeight: 700,
                    }}
                  >
                    {profesion}
                  </span>
                );
              })}
            </span>

            <span>confiables en tu zona</span>
          </h1>

          <style jsx>{`
            /* Ajustes para pantallas muy pequeñas (<400px) */
            @media (max-width: 400px) {
              .buscar-mobile-title {
                font-size: 34px !important;
                line-height: 1.05 !important;
              }
              .buscar-profession-wrap { height: 60px !important; }
              .buscar-profession-text { font-size: 34px !important; line-height: 60px !important; }
              .buscar-confiables, .buscar-zona { display: inline-block; margin-top: 2px; margin-bottom: 2px; }
              /* Reducir espacio vertical entre elementos del título */
              .buscar-mobile-title br { content: ""; line-height: 1; }
              .buscar-mobile-title { margin-bottom: 6px; }
            }
            /* Reducir espacio vertical entre palabras/lineas en general */
            .buscar-mobile-title .buscar-profession-text { padding-top: 0; padding-bottom: 0; }
          `}</style>
        </div>

        {/* Formulario de búsqueda */}
        <div className="w-full max-w-md md:max-w-3xl px-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-3">
          {/* Selector de servicio */}
          <div className="relative md:flex-1 mb-3 md:mb-0">
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
                  .sort((a,b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
                  .map((servicio) => (
                    <div
                      key={servicio}
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
          <div className="relative md:flex-1 mb-3 md:mb-0">
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
                  ubicacionesSugeridas.map((sugerencia) => (
                    <div
                      key={sugerencia.display_name}
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
            className="w-full md:w-auto mx-auto flex items-center justify-center gap-2 rounded-full shadow-lg transition-all hover:shadow-xl hover:opacity-90"
            style={{
              minWidth: '130px',
              height: '46px',
              borderRadius: '24px',
              paddingTop: '10px',
              paddingRight: '20px',
              paddingBottom: '10px',
              paddingLeft: '20px',
              gap: '10px',
              backgroundColor: '#B45B39',
              border: 'none',
              fontFamily: typography.fontFamily.primary,
              fontSize: '16px',
              fontWeight: 500,
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <span>Buscar</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          </div>
        </div>
      </main>

      {/* Sección: ¿Cómo funciona? */}
      <section id="como-funciona" className="w-full py-12 sm:py-16 px-6" style={{ marginTop: '60px', backgroundColor: '#FFFCF9' }}>
        <div className="max-w-2xl md:max-w-5xl mx-auto">
          {/* Título */}
          <h2 className="font-normal text-4xl sm:text-5xl text-center mb-12 md:mb-16" style={{ 
            fontFamily: 'Maitree, serif', 
            color: colors.primary.main,
            lineHeight: '1.2',
            fontWeight: 600
          }}>
            ¿Cómo funciona?
          </h2>

          {/* Flujo de pasos con línea punteada vertical */}
          <div className="md:hidden">
          <div className="relative" style={{ height: '480px' }}>
            {/* Líneas punteadas verticales con degradado de colores - 480px total */}
            {/* Línea 1: Naranja (#B45B39) */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                width: '4px',
                height: '96px',
                background: `repeating-linear-gradient(
                  to bottom,
                  #B45B39 0px,
                  #B45B39 4px,
                  transparent 4px,
                  transparent 8px
                )`,
                opacity: 0.6,
                top: 0
              }}
            />
            {/* Línea 2: Marrón (#9C5946) */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                width: '4px',
                height: '96px',
                background: `repeating-linear-gradient(
                  to bottom,
                  #9C5946 0px,
                  #9C5946 4px,
                  transparent 4px,
                  transparent 8px
                )`,
                opacity: 0.6,
                top: '96px'
              }}
            />
            {/* Línea 3: Marrón oscuro (#805655) */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                width: '4px',
                height: '96px',
                background: `repeating-linear-gradient(
                  to bottom,
                  #805655 0px,
                  #805655 4px,
                  transparent 4px,
                  transparent 8px
                )`,
                opacity: 0.6,
                top: '192px'
              }}
            />
            {/* Línea 4: Gris azulado (#625366) */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                width: '4px',
                height: '96px',
                background: `repeating-linear-gradient(
                  to bottom,
                  #625366 0px,
                  #625366 4px,
                  transparent 4px,
                  transparent 8px
                )`,
                opacity: 0.6,
                top: '288px'
              }}
            />
            {/* Línea 5: Azul (#425078) */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                width: '4px',
                height: '96px',
                background: `repeating-linear-gradient(
                  to bottom,
                  #425078 0px,
                  #425078 4px,
                  transparent 4px,
                  transparent 8px
                )`,
                opacity: 0.6,
                top: '384px'
              }}
            />

            {/* Paso 1 - Círculo naranja - Al inicio de la línea */}
            <div className="absolute w-full flex items-center" style={{ top: '0', height: '33.03px' }}>
              {/* Círculo */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  width: '33.03px',
                  height: '33.03px',
                  borderRadius: '50%',
                  background: '#B45B39',
                  zIndex: 2
                }}
              />
              {/* Texto a la derecha - 20px del círculo */}
              <div style={{ 
                position: 'absolute',
                left: 'calc(50% + 16.5px + 20px)',
                width: 'calc(50% - 16.5px - 20px - 24px)'
              }}>
                <p style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: colors.neutral.black
                }}>
                  Indicá el servicio que buscas y tu ubicación
                </p>
              </div>
            </div>

            {/* Paso 2 - Círculo marrón */}
            <div className="absolute w-full flex items-center" style={{ top: '96px', height: '33.03px' }}>
              {/* Círculo */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  width: '33.03px',
                  height: '33.03px',
                  borderRadius: '50%',
                  background: '#9C5946',
                  zIndex: 2
                }}
              />
              {/* Texto a la izquierda - 20px del círculo */}
              <div style={{ 
                position: 'absolute',
                right: 'calc(50% + 16.5px + 20px)',
                width: 'calc(50% - 16.5px - 20px - 24px)',
                textAlign: 'right'
              }}>
                <p style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: colors.neutral.black
                }}>
                  Elegí la especialidad que más se adapte a tu necesidad
                </p>
              </div>
            </div>

            {/* Paso 3 - Círculo marrón oscuro */}
            <div className="absolute w-full flex items-center" style={{ top: '192px', height: '33.03px' }}>
              {/* Círculo */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  width: '33.03px',
                  height: '33.03px',
                  borderRadius: '50%',
                  background: '#805655',
                  zIndex: 2
                }}
              />
              {/* Texto a la derecha - 20px del círculo */}
              <div style={{ 
                position: 'absolute',
                left: 'calc(50% + 16.5px + 20px)',
                width: 'calc(50% - 16.5px - 20px - 24px)'
              }}>
                <p style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: colors.neutral.black
                }}>
                  Seleccioná uno o varios prestadores para que te envíen un presupuesto.
                </p>
              </div>
            </div>

            {/* Paso 4 - Círculo gris azulado */}
            <div className="absolute w-full flex items-center" style={{ top: '288px', height: '33.03px' }}>
              {/* Círculo */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  width: '33.03px',
                  height: '33.03px',
                  borderRadius: '50%',
                  background: '#625366',
                  zIndex: 2
                }}
              />
              {/* Texto a la izquierda - 20px del círculo */}
              <div style={{ 
                position: 'absolute',
                right: 'calc(50% + 16.5px + 20px)',
                width: 'calc(50% - 16.5px - 20px - 24px)',
                textAlign: 'right'
              }}>
                <p style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: colors.neutral.black
                }}>
                  Detallá tu necesidad incluso podes agregar fotos para ilustrar.
                </p>
              </div>
            </div>

            {/* Paso 5 - Círculo azul */}
            <div className="absolute w-full flex items-center" style={{ top: '384px', height: '33.03px' }}>
              {/* Círculo */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  width: '33.03px',
                  height: '33.03px',
                  borderRadius: '50%',
                  background: '#425078',
                  zIndex: 2
                }}
              />
              {/* Texto a la derecha - 20px del círculo */}
              <div style={{ 
                position: 'absolute',
                left: 'calc(50% + 16.5px + 20px)',
                width: 'calc(50% - 16.5px - 20px - 24px)'
              }}>
                <p style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: colors.neutral.black
                }}>
                  Indicá donde quieres recibir los presupuestos.
                </p>
              </div>
            </div>
          </div>
          </div> {/* end md:hidden */}

          {/* DESKTOP: timeline horizontal */}
          <div className="hidden md:flex items-start justify-between px-4 relative mt-4 mb-10">
            {/* Línea con degradado que conecta los círculos */}
            <div
              className="absolute"
              style={{
                top: '22px',
                left: '10%',
                right: '10%',
                height: '3px',
                background: 'linear-gradient(to right, #B45B39, #9C5946, #805655, #625366, #425078)',
                opacity: 0.6,
              }}
            />
            {[
              { color: '#B45B39', text: 'Indicá el servicio que buscás y tu ubicación' },
              { color: '#9C5946', text: 'Elegí la especialidad que más se adapte a tu necesidad' },
              { color: '#805655', text: 'Seleccioná uno o varios prestadores para que te envíen un presupuesto' },
              { color: '#625366', text: 'Detallá tu necesidad, podés agregar fotos para ilustrar' },
              { color: '#425078', text: 'Indicá dónde querés recibir los presupuestos' },
            ].map((paso) => (
              <div key={paso.color} className="flex flex-col items-center flex-1">
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: paso.color,
                    position: 'relative',
                    zIndex: 2,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: colors.neutral.black,
                    textAlign: 'center',
                    marginTop: '16px',
                    lineHeight: '1.5',
                    maxWidth: '160px',
                  }}
                >
                  {paso.text}
                </p>
              </div>
            ))}
          </div>

          {/* Semi-círculo final con degradado azul - solo mobile */}
          <div className="md:hidden relative flex justify-center" style={{ marginTop: '0px', marginBottom: '0px' }}>
                <div 
              style={{
                width: '100%',
                maxWidth: '600px',
                height: '200px',
                borderRadius: '300px 300px 0 0',
                    background: 'linear-gradient(180deg, #244C87 0%, #8398B8 50%, #FFFCF9 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '20px',
                paddingLeft: '40px',
                paddingRight: '40px'
              }}
            >
              <p style={{
                fontFamily: 'Maitree, serif',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                textAlign: 'center',
                maxWidth: '480px'
              }}>
                Y listo! Te enviaremos los presupuestos en menos de 48hs para que puedas elegir a que profesional deseas contactar.
              </p>
            </div>
          </div>

          {/* Párrafo final - solo desktop */}
          <div className="hidden md:flex justify-center mt-20 mb-16">
            <p style={{
              fontFamily: 'Maitree, serif',
              fontSize: '20px',
              fontWeight: 400,
              lineHeight: '1.6',
              color: '#244C87',
              textAlign: 'center',
              maxWidth: '640px',
            }}>
              ¡Y listo! Te enviaremos los presupuestos en menos de 48hs para que puedas elegir al profesional que más te convenga.
            </p>
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

      <div style={{ marginTop: '0px', backgroundColor: '#244C87' }}>
        <Footer />
      </div>

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
