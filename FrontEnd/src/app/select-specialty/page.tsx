'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getEspecialidades } from '../data/especialidades';
import { Footer } from '@/components/layout';

function SelectSpecialtyContent() {
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

      <Footer />
    </div>
  );
}

export default function SelectSpecialty() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#244C87] mx-auto mb-4"></div>
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#244C87' }}>
            Cargando...
          </p>
        </div>
      </div>
    }>
      <SelectSpecialtyContent />
    </Suspense>
  );
}
