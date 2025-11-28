'use client';

import { useState, useEffect } from 'react';
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
  const [profesionActual, setProfesionActual] = useState(0);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);

  // Animación automática de desplazamiento de profesiones
  useEffect(() => {
    const intervalo = setInterval(() => {
      setProfesionActual((prev) => (prev + 1) % profesiones.length);
    }, 2000); // Cambia cada 2 segundos

    return () => clearInterval(intervalo);
  }, []);

  const handleBuscar = () => {
    // Por ahora solo console.log, más adelante se conectará con la búsqueda real
    console.log('Buscando:', {
      servicio: servicioSeleccionado,
      ubicacion: ubicacion
    });
    
    // TODO: Implementar búsqueda cuando haya proveedores en la DB
    alert(`Buscando ${servicioSeleccionado || 'todos los servicios'} en ${ubicacion || 'todas las ubicaciones'}.\n\n(Funcionalidad completa próximamente)`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Image 
            src="/Logo.png" 
            alt="SaHa Logo" 
            width={120} 
            height={40}
            className="h-8 w-auto sm:h-10"
            priority
          />
        </div>
        <div className="text-xs sm:text-sm text-gray-600 font-light">
          Espacio del trabajador
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 sm:py-12">
        {/* Decorative Wave */}
        <div className="w-full max-w-md mb-8">
          <svg 
            viewBox="0 0 400 80" 
            className="w-full h-auto opacity-30"
            preserveAspectRatio="none"
          >
            <path 
              d="M 0 40 Q 100 10, 200 40 T 400 40" 
              stroke="#4F46E5" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>
        </div>

        {/* Título principal con palabra animada */}
        <div className="text-center mb-10 sm:mb-12 max-w-lg px-4">
          <h1 className="font-normal text-[48px] leading-[100%] text-center text-[#244C87] mb-6" style={{ fontFamily: 'Maitree, serif' }}>
            Encontrá
          </h1>
          
          {/* Carrusel horizontal de profesiones */}
          <div className="relative h-16 sm:h-20 overflow-hidden mb-4">
            <div 
              className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${profesionActual * 100}%)`,
                width: `${profesiones.length * 100}%`
              }}
            >
              {profesiones.map((profesion, index) => {
                const isCenter = index === profesionActual;
                const distanceFromCenter = Math.abs(index - profesionActual);
                const opacity = distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.4 : 0.2;
                
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 transition-all duration-500"
                    style={{ 
                      width: `${100 / profesiones.length}%`,
                      opacity: opacity
                    }}
                  >
                    <span 
                      className={`text-[48px] leading-[100%] text-center transition-all duration-500 ${
                        isCenter 
                          ? 'font-bold text-[#244C87] scale-110' 
                          : 'font-normal text-gray-400'
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
    </div>
  );
}
