'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

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

      {/* Footer */}
      <footer className="w-full text-white mt-20">
        <div className="w-full bg-[#244C87]" style={{ height: '60px' }}></div>
        
        <div className="w-full bg-white py-8">
          <div className="flex justify-center">
            <Image 
              src="/Logo.png" 
              alt="Serco Logo" 
              width={484} 
              height={134}
              className="w-auto"
              style={{ maxWidth: '484px', height: 'auto' }}
            />
          </div>
        </div>

        <div className="w-full bg-[#244C87] py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-16" style={{ gap: '86px', paddingLeft: '49.05px', paddingRight: '49.05px' }}>
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
