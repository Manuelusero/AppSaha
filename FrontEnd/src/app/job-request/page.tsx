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
  const [urgencia, setUrgencia] = useState('50');

  const getUrgenciaLabel = (value: string) => {
    const num = parseInt(value);
    if (num <= 33) return { text: 'Baja', color: '#10B981', position: 'left' };
    if (num <= 66) return { text: 'Media', color: '#F59E0B', position: 'center' };
    return { text: 'Alta', color: '#EF4444', position: 'right' };
  };

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFCF9' }}>
      {/* Header con degradado */}
      <header 
        className="w-full px-6 flex items-center relative"
        style={{ 
          background: 'linear-gradient(180deg, #3A5FA0 0%, #FFFCF9 100%)',
          height: '124px'
        }}
      >
        {/* Flecha de regreso */}
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-6"
          style={{ cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6" style={{ paddingTop: '24px' }}>
        <div className="w-full max-w-md">
          {/* Título y subtítulo */}
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <h1 style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '40px', 
              lineHeight: '100%', 
              color: '#244C87', 
              fontWeight: 400,
              marginBottom: '8px'
            }}>
              Detalles del trabajo
            </h1>
            <p style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '16px', 
              lineHeight: '100%', 
              color: '#000000', 
              fontWeight: 400,
              opacity: 0.6
            }}>
              Completá todos los campos para recibir un<br />presupuesto más preciso.
            </p>
          </div>

          {/* Campo de descripción */}
          <div style={{ marginBottom: '32px' }}>
            <label className="block" style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#000000', fontWeight: 400, lineHeight: '100%', letterSpacing: '0%', opacity: 0.6, marginBottom: '8px' }}>
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
          <div style={{ marginBottom: '48px' }}>
            <label className="block" style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#000000', fontWeight: 400, lineHeight: '100%', letterSpacing: '0%', opacity: 0.6, marginBottom: '8px' }}>
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
            <label className="block mb-4" style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#000000', fontWeight: 400, lineHeight: '100%', letterSpacing: '0%', opacity: 0.6 }}>
              Nivel de urgencia
            </label>
            <div className="relative flex flex-col items-center" style={{ paddingTop: '8px', paddingBottom: '32px' }}>
              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={urgencia}
                onChange={(e) => setUrgencia(e.target.value)}
                className="appearance-none cursor-pointer urgencia-slider"
                style={{ 
                  width: '386px',
                  maxWidth: '100%',
                  height: '3px'
                }}
              />
              {/* Etiqueta dinámica */}
              <div 
                className="absolute -bottom-0"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '14px', 
                  color: getUrgenciaLabel(urgencia).color,
                  fontWeight: 400,
                  width: '386px',
                  maxWidth: '100%',
                  ...(getUrgenciaLabel(urgencia).position === 'left' && { textAlign: 'left' }),
                  ...(getUrgenciaLabel(urgencia).position === 'center' && { textAlign: 'center' }),
                  ...(getUrgenciaLabel(urgencia).position === 'right' && { textAlign: 'right' })
                }}
              >
                {getUrgenciaLabel(urgencia).text}
              </div>
            </div>
          </div>

          <style jsx>{`
            .urgencia-slider {
              background: linear-gradient(to right, #10B981 0%, #EF4444 100%);
              outline: none;
              border-radius: 8px;
              opacity: 1;
            }
            
            .urgencia-slider::-webkit-slider-thumb {
              appearance: none;
              width: 29px;
              height: 29px;
              border-radius: 50%;
              background: #10B981;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .urgencia-slider::-moz-range-thumb {
              width: 29px;
              height: 29px;
              border-radius: 50%;
              background: #10B981;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
          `}</style>

          {/* Botón Último paso */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-full transition-colors shadow-md"
              style={{ fontFamily: 'Maitree, serif', fontSize: '18px', color: '#244C87', fontWeight: 500, backgroundColor: '#E8EAF6', cursor: 'pointer' }}
            >
              Último paso
            </button>
          </div>
        </div>
      </main>

      <Footer />
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
