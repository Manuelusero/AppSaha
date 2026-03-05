'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getEspecialidades } from '../data/especialidades';
import BuscarPage from '@/app/buscar/page';

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

  const handleOverlayClick = () => {
    router.back();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background page (visible behind) */}
      <div className="absolute inset-0 overflow-y-auto pointer-events-none">
        <div className="opacity-60">
          <BuscarPage />
        </div>
      </div>

      {/* Dim overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="relative z-10 min-h-screen flex items-end justify-center pointer-events-none">
        <div
          className="w-full rounded-t-3xl animate-slide-up flex flex-col pointer-events-auto"
          style={{
            maxHeight: '90vh',
            borderRadius: '24px 24px 0 0',
            background: 'linear-gradient(180deg, #FFFCF9 0%, #91A4C0 60%, #244C87 100%)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            animation: 'slideUp 0.4s ease-out',
          }}
          onClick={handleModalClick}
        >
        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Título */}
          <h1
            className="text-center"
            style={{
              fontFamily: 'Maitree, serif',
              fontSize: '32px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#244C87',
              fontWeight: 400,
              marginBottom: '10px',
            }}
          >
            ¿Qué servicio necesitas?
          </h1>

          <p
            className="text-center"
            style={{
              fontFamily: 'Maitree, serif',
              fontSize: '16px',
              color: '#6B7280',
              marginBottom: '18px',
            }}
          >
            Selecciona las especialidades que más se acerquen a tu necesidad
          </p>

          {/* Lista de especialidades */}
          <div className="space-y-3 mb-8">
            {especialidades.map((esp) => (
              <button
                key={esp}
                onClick={() => toggleEspecialidad(esp)}
                className="w-full px-6 py-3 rounded-full transition-all border text-center cursor-pointer"
                style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#111827',
                  borderColor: '#244C87',
                  backgroundColor: especialidadesSeleccionadas.includes(esp)
                    ? 'rgba(36, 76, 135, 0.12)'
                    : '#FFFFFF',
                }}
              >
                {esp}
              </button>
            ))}
          </div>

          {/* Botón Continuar */}
          <div className="flex justify-center pb-6">
            <button
              onClick={handleContinuar}
              className="rounded-full transition-all duration-300 cursor-pointer backdrop-blur-md border shadow-lg"
              style={{
                fontFamily: 'Maitree, serif',
                fontSize: '16px',
                color: '#FFFFFF',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: '24px',
                gap: '10px',
                backgroundColor: especialidadesSeleccionadas.length > 0
                  ? 'rgba(191, 198, 238, 0.2)'
                  : 'rgba(209, 213, 219, 0.2)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: especialidadesSeleccionadas.length > 0
                  ? '0 8px 20px rgba(36, 76, 135, 0.3)'
                  : '0 4px 10px rgba(0, 0, 0, 0.1)',
                cursor: especialidadesSeleccionadas.length > 0 ? 'pointer' : 'not-allowed',
              }}
              disabled={especialidadesSeleccionadas.length === 0}
            >
              Ver Profesionales
            </button>
          </div>
        </div>
        </div>
      </div>
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
