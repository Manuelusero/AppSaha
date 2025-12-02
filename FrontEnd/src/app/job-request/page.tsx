'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function JobRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const servicio = searchParams.get('servicio') || 'Servicio';
  const ubicacion = searchParams.get('ubicacion') || 'Ubicación';
  const professionals = searchParams.get('professionals') || '';
  
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [urgencia, setUrgencia] = useState('');
  const [mostrarUrgencias, setMostrarUrgencias] = useState(false);

  const nivelesUrgencia = ['Alto', 'Medio', 'Bajo'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Validaciones
    if (!descripcion) {
      alert('Por favor describí el problema');
      return;
    }
    
    if (!urgencia) {
      alert('Por favor seleccioná el nivel de urgencia');
      return;
    }

    // Navegar a contact-details con todos los parámetros
    const params = new URLSearchParams();
    params.append('professionals', professionals);
    params.append('descripcion', descripcion);
    params.append('urgencia', urgencia);
    if (foto) params.append('foto', foto.name);
    
    router.push(`/contact-details?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #a8c5e8 0%, #f5f5f5 30%, #ffffff 100%)' }}>
      {/* Header superior con servicio y ubicación */}
      <div className="w-full px-6 py-4 flex items-center justify-between" style={{ position: 'relative' }}>
        {/* Botón back */}
        <button 
          onClick={() => window.history.back()}
          className="p-2"
        >
          <svg width="24" height="24" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Texto central */}
        <div className="flex-1 mx-4">
          <div className="max-w-md mx-auto px-6 py-3 rounded-full bg-white/50 backdrop-blur-sm border border-gray-300 text-center">
            <span style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#6B7280' }}>
              {servicio} en {ubicacion}
            </span>
          </div>
        </div>

        {/* Icono de filtro */}
        <button className="p-2">
          <svg width="24" height="24" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6" style={{ paddingTop: '40px' }}>
        <div className="w-full max-w-md">
          {/* Título */}
          <h1 className="text-center mb-12" style={{ fontFamily: 'Maitree, serif', fontSize: '40px', lineHeight: '100%', color: '#244C87', fontWeight: 400 }}>
            Explicanos tu problema
          </h1>

          {/* Campo de descripción */}
          <div style={{ marginBottom: '32px' }}>
            <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
              ¿En qué te podemos ayudar?
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-3 rounded-3xl border-2 border-gray-300 focus:border-[#244C87] focus:outline-none resize-none bg-white"
              rows={6}
              placeholder=""
              style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
            />
          </div>

          {/* Upload de foto */}
          <div style={{ marginBottom: '32px' }}>
            <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
              Foto para entender mejor
            </label>
            <div 
              className="w-full px-4 py-12 rounded-3xl border-2 border-dashed border-gray-300 hover:border-[#244C87] transition-colors cursor-pointer bg-white"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="flex flex-col items-center justify-center text-center">
                {/* Ícono de upload */}
                <svg className="w-16 h-16 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#6B7280' }}>
                  {foto ? foto.name : 'Arrastrá tu foto o hacé click para subirlo'}
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Nivel de urgencia */}
          <div style={{ marginBottom: '48px' }}>
            <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
              Nivel de urgencia
            </label>
            <div className="relative">
              <input
                type="text"
                value={urgencia}
                onChange={(e) => setUrgencia(e.target.value)}
                onFocus={() => setMostrarUrgencias(true)}
                className="w-full px-5 py-4 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                placeholder="Alto/Medio/Bajo"
                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                readOnly
              />
              
              {/* Dropdown de urgencias */}
              {mostrarUrgencias && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                  {nivelesUrgencia.map((nivel, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setUrgencia(nivel);
                        setMostrarUrgencias(false);
                      }}
                      className="px-5 py-3 hover:bg-indigo-50 cursor-pointer transition-colors"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    >
                      {nivel}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón Último paso */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-full transition-colors shadow-md"
              style={{ fontFamily: 'Maitree, serif', fontSize: '18px', color: '#244C87', fontWeight: 500, backgroundColor: '#E8EAF6' }}
            >
              Último paso
            </button>
          </div>
        </div>
      </main>

      {/* Click outside handler para cerrar dropdown */}
      {mostrarUrgencias && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setMostrarUrgencias(false)}
        />
      )}
    </div>
  );
}
