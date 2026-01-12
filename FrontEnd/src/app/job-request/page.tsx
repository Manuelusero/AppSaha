'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Footer } from '@/components/layout';
import { Input } from '@/components/ui';

function JobRequestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionar imagen (máximo 800px de ancho)
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprimir a JPEG con calidad 0.7
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!descripcion) {
      alert('Por favor describí el problema');
      return;
    }
    
    if (!urgencia) {
      alert('Por favor seleccioná el nivel de urgencia');
      return;
    }

    // Convertir y comprimir la foto si existe
    if (foto) {
      try {
        const compressedImage = await compressImage(foto);
        localStorage.setItem('jobRequestPhoto', compressedImage);
        localStorage.setItem('jobRequestPhotoName', foto.name);
        navigateToNextPage();
      } catch (error) {
        console.error('Error al procesar imagen:', error);
        alert('Error al procesar la imagen. Por favor, intentá con otra foto.');
      }
    } else {
      // Si no hay foto, limpiar localStorage y continuar
      localStorage.removeItem('jobRequestPhoto');
      localStorage.removeItem('jobRequestPhotoName');
      navigateToNextPage();
    }
  };

  const navigateToNextPage = () => {
    // Navegar a contact-details con todos los parámetros
    const params = new URLSearchParams();
    params.append('professionals', professionals);
    params.append('descripcion', descripcion);
    params.append('urgencia', urgencia);
    
    // Pasar la ubicación si existe
    const ubicacion = searchParams.get('ubicacion');
    if (ubicacion) {
      params.append('ubicacion', ubicacion);
    }
    
    router.push(`/contact-details?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #a8c5e8 0%, #f5f5f5 30%, #ffffff 100%)' }}>
      {/* Header superior */}
      <div className="w-full px-6 py-4 flex items-center" style={{ position: 'relative' }}>
        {/* Botón back */}
        <button 
          onClick={() => window.history.back()}
          className="p-2"
          style={{ cursor: 'pointer' }}
        >
          <svg width="24" height="24" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
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
            <div className="relative">
              <Input
                label="Nivel de urgencia"
                placeholder="Alto/Medio/Bajo"
                value={urgencia}
                onChange={setUrgencia}
                className="px-5 py-4 cursor-pointer"
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

      <Footer />

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

export default function JobRequest() {
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
      <JobRequestContent />
    </Suspense>
  );
}
