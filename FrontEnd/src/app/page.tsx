'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

// Ciudades principales de Argentina (se puede expandir más adelante)
const ciudadesArgentina = [
  'Buenos Aires',
  'Córdoba',
  'Rosario',
  'Mendoza',
  'La Plata',
  'San Miguel de Tucumán',
  'Mar del Plata',
  'Salta',
  'Santa Fe',
  'San Juan',
  'Resistencia',
  'Neuquén',
  'Posadas',
  'Bahía Blanca',
  'Paraná',
  'Santiago del Estero',
  'Corrientes',
  'San Salvador de Jujuy',
  'Formosa',
  'San Luis',
  'La Rioja',
  'Catamarca',
  'Santa Rosa',
  'Río Cuarto',
  'Comodoro Rivadavia',
  'San Carlos de Bariloche',
  'Ushuaia',
  'Río Gallegos',
  'Viedma'
];

export default function Home() {
  const router = useRouter();
  const [profesionActual, setProfesionActual] = useState(0);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header con degradado */}
      <header 
        className="px-6 py-4 flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          height: '150px'
        }}
      >
        <div className="flex items-center gap-2">
          <div style={{ 
            width: '145px', 
            height: '66px',
            background: 'url(/LOGO.svg) no-repeat center center',
            mixBlendMode: 'multiply',
            opacity: 1,
            borderRadius: '25px',
            transform: 'rotate(0deg)'
          }} 
          aria-label="SaHa Logo"
          />
        </div>
        <button
          onClick={() => setMostrarModalLogin(true)}
          style={{ 
            fontFamily: 'Maitree, serif',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: '13px',
            lineHeight: '100%',
            letterSpacing: '0%',
            width: 'auto',
            height: '40px',
            gap: '10px',
            opacity: 1,
            borderRadius: '24px',
            padding: '8px 16px',
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
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          Espacio del trabajador
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 sm:py-12">
        {/* Título principal con palabra animada */}
        <div className="text-center mb-10 sm:mb-12 max-w-lg px-4">
          <h1 className="font-normal text-[48px] leading-[100%] text-center text-[#244C87] mb-6" style={{ fontFamily: 'Maitree, serif' }}>
            Encontrá
          </h1>
          
          {/* Carrusel horizontal de profesiones */}
          <div className="relative h-16 sm:h-20 overflow-hidden mb-4 flex items-center justify-center">
            <div className="flex items-center gap-4">
              {/* Mostrar 3 palabras: anterior, actual (centro), siguiente */}
              {[-1, 0, 1].map((offset) => {
                const index = (profesionActual + offset + profesiones.length) % profesiones.length;
                const profesion = profesiones[index];
                const isCenter = offset === 0;
                
                return (
                  <div
                    key={`${index}-${offset}`}
                    className="transition-all duration-700 ease-in-out"
                    style={{ 
                      opacity: isCenter ? 1 : 0.4,
                    }}
                  >
                    <span 
                      className={`block text-center transition-all duration-700 whitespace-nowrap ${
                        isCenter 
                          ? 'text-[48px] font-bold text-[#244C87]' 
                          : 'text-[36px] font-normal text-gray-400'
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
          
          <h1 className="font-normal text-[48px] leading-[100%] text-center text-[#244C87]" style={{ fontFamily: 'Maitree, serif' }}>
            confiables en tu zona
          </h1>
        </div>

        {/* Formulario de búsqueda */}
        <div className="w-full max-w-md space-y-4 px-4">
          {/* Selector de servicio */}
          <div className="relative">
            <input
              type="text"
              value={servicioSeleccionado}
              onChange={(e) => setServicioSeleccionado(e.target.value)}
              onFocus={() => setMostrarServicios(true)}
              placeholder="¿Qué necesitas?"
              className="w-full px-5 py-4 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400 text-base transition-all"
            />
            
            {/* Dropdown de servicios */}
            {mostrarServicios && (
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
                      className="px-5 py-3 hover:bg-indigo-50 cursor-pointer text-gray-700 transition-colors"
                    >
                      {servicio}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Selector de ubicación */}
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              onFocus={() => setMostrarUbicaciones(true)}
              placeholder="Ubicación"
              className="w-full pl-12 pr-5 py-4 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400 text-base transition-all"
            />
            
            {/* Dropdown de ubicaciones */}
            {mostrarUbicaciones && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                {ciudadesArgentina
                  .filter(c => c.toLowerCase().includes(ubicacion.toLowerCase()))
                  .map((ciudad, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setUbicacion(ciudad);
                        setMostrarUbicaciones(false);
                      }}
                      className="px-5 py-3 hover:bg-indigo-50 cursor-pointer text-gray-700 transition-colors"
                    >
                      {ciudad}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Botón de búsqueda */}
          <button
            onClick={handleBuscar}
            className="w-16 h-16 mx-auto flex items-center justify-center bg-white border-2 border-gray-200 rounded-full hover:bg-indigo-50 hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="w-full bg-white py-12 sm:py-16 px-6" style={{ marginTop: '13px' }}>
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
              <div className="relative" style={{ width: '432px', height: '849px', right: '37px' }}>
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
                    left: '35px',
                    top: '-15px'
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
                <div className="absolute" style={{ left: '140px', top: '-28px', maxWidth: '250px' }}>
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

        {/* Resto del footer con fondo azul */}
        <div className="w-full bg-[#244C87] py-12 px-6">
          <div className="max-w-6xl mx-auto">

          {/* Redes Sociales */}
          <div className="flex justify-center mb-16" style={{ gap: '86px', paddingLeft: '49.5px', paddingRight: '49.5px' }}>
            {/* LinkedIn */}
            <a href="#" className="hover:opacity-80 transition-opacity" style={{ opacity: 1 }}>
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" className="hover:opacity-80 transition-opacity" style={{ opacity: 1 }}>
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a href="#" className="hover:opacity-80 transition-opacity" style={{ opacity: 1 }}>
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="hover:opacity-80 transition-opacity" style={{ opacity: 1 }}>
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          {/* Navegación en 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center">
            {/* Para Clientes */}
            <div>
              <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Para Clientes</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Buscar Servidores</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>¿Cómo Funciona?</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Seguridad y Confianza</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Ayuda</a></li>
              </ul>
            </div>

            {/* Para Proveedores */}
            <div>
              <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Para Proveedores</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Sumate como proveedor</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Experiencias</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Recursos útiles</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Soporte Proveedores</a></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Empresa</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Sobre nosotros</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Trabaja con nosotros</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Contacto</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Prensa</a></li>
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
              <div className="flex flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-3 rounded-full transition-colors"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px',
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
                    minWidth: '180px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Si, Iniciar sesión
                </button>
                
                <button
                  onClick={() => router.push('/provider-signup')}
                  className="px-6 py-3 rounded-full transition-colors"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px',
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
                    minWidth: '180px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
