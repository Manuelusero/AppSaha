'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getEspecialidades } from '../data/especialidades';

export default function SelectSpecialty() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const servicio = searchParams.get('servicio') || '';
  const ubicacion = searchParams.get('ubicacion') || '';
  
  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState<string[]>([]);
  
  const especialidades = getEspecialidades(servicio);

  const toggleEspecialidad = (especialidad: string) => {
    if (especialidadesSeleccionadas.includes(especialidad)) {
      setEspecialidadesSeleccionadas(especialidadesSeleccionadas.filter(e => e !== especialidad));
    } else {
      setEspecialidadesSeleccionadas([...especialidadesSeleccionadas, especialidad]);
    }
  };

  const handleContinuar = () => {
    if (especialidadesSeleccionadas.length === 0) {
      alert('Por favor seleccioná al menos una especialidad');
      return;
    }
    
    const params = new URLSearchParams();
    params.append('servicio', servicio);
    params.append('ubicacion', ubicacion);
    // Enviar todas las especialidades separadas por coma
    params.append('especialidades', especialidadesSeleccionadas.join(','));
    
    router.push(`/search-results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between bg-white border-b">
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
        <a 
          href="/provider-signup"
          className="px-4 py-2 rounded-full border border-[#244C87] text-[#244C87] text-sm hover:bg-[#244C87] hover:text-white transition-colors"
        >
          Espacio del trabajador
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6" style={{ paddingTop: '164px' }}>
        <div className="w-full max-w-md">
          {/* Título */}
          <h1 className="text-center" style={{ fontFamily: 'Maitree, serif', fontSize: '40px', lineHeight: '100%', letterSpacing: '0%', color: '#244C87', fontWeight: 400, marginBottom: '48px' }}>
            ¿Qué tipo de trabajo necesitás?
          </h1>

          {/* Información del servicio seleccionado */}
          <div className="mb-8 p-4 bg-blue-50 rounded-2xl">
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#244C87' }}>
              <strong>Servicio:</strong> {servicio}
            </p>
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#244C87' }}>
              <strong>Ubicación:</strong> {ubicacion}
            </p>
          </div>

          {/* Grid de especialidades */}
          <div className="mb-8">
            <label className="block mb-4" style={{ fontFamily: 'Maitree, serif', fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', color: '#6B7280', fontWeight: 400 }}>
              Seleccioná las especialidades que necesitás (podés elegir más de una):
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {especialidades.map((esp, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleEspecialidad(esp)}
                  className={`px-6 py-4 rounded-full text-left transition-all ${
                    especialidadesSeleccionadas.includes(esp)
                      ? 'bg-[#244C87] text-white border-2 border-[#244C87]'
                      : 'bg-white text-black border-2 border-gray-300 hover:border-[#244C87]'
                  }`}
                  style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                >
                  {esp}
                </button>
              ))}
            </div>
            {especialidadesSeleccionadas.length > 0 && (
              <p className="mt-3 text-center" style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#244C87' }}>
                {especialidadesSeleccionadas.length} especialidad{especialidadesSeleccionadas.length > 1 ? 'es' : ''} seleccionada{especialidadesSeleccionadas.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Botón Continuar */}
          <div className="flex justify-center">
            <button
              onClick={handleContinuar}
              className="px-12 py-4 rounded-full transition-all duration-300"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px', 
                color: '#FFFFFF', 
                fontWeight: 500,
                backgroundColor: especialidadesSeleccionadas.length > 0 ? '#244C87' : '#D1D5DB',
                cursor: especialidadesSeleccionadas.length > 0 ? 'pointer' : 'not-allowed'
              }}
              disabled={especialidadesSeleccionadas.length === 0}
            >
              Ver profesionales
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-white" style={{ marginTop: '150px' }}>
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
            <div className="flex justify-center mb-16" style={{ gap: '86px', paddingLeft: '49.5px', paddingRight: '49.5px' }}>
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
