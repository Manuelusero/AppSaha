'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function ContactDetails() {
  const searchParams = useSearchParams();
  
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [metodoContacto, setMetodoContacto] = useState('');

  const handleSubmit = () => {
    // Validaciones básicas
    if (!nombre || !telefono || !email || !metodoContacto) {
      alert('Por favor completá todos los campos');
      return;
    }

    // TODO: Enviar los datos al backend
    console.log({
      nombre,
      telefono,
      email,
      metodoContacto,
      // Datos que vienen de las páginas anteriores
      professionals: searchParams.get('professionals'),
      descripcion: searchParams.get('descripcion'),
      urgencia: searchParams.get('urgencia')
    });

    alert('¡Solicitud enviada exitosamente! Los profesionales te contactarán pronto.');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #a8c5e8 0%, #f5f5f5 30%, #ffffff 100%)' }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image 
            src="/Logo.png" 
            alt="SaHa Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <a 
          href="/provider-signup"
          className="px-4 py-2 rounded-full border border-[#244C87] text-[#244C87] text-sm hover:bg-[#244C87] hover:text-white transition-colors"
          style={{ fontFamily: 'Maitree, serif' }}
        >
          Espacio del trabajador
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Título */}
          <h1 className="text-center mb-12" style={{ fontFamily: 'Maitree, serif', fontSize: '40px', lineHeight: '100%', color: '#244C87', fontWeight: 400 }}>
            Detalles de contacto
          </h1>

          {/* Formulario */}
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Andrea"
                className="w-full px-5 py-4 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
                Teléfono
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 1234558690"
                className="w-full px-5 py-4 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alguien@algo.com"
                className="w-full px-5 py-4 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
              />
            </div>

            {/* Método preferido de contacto */}
            <div>
              <label className="block mb-3" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
                Método preferido de contacto:
              </label>
              <div className="space-y-3">
                {/* Mail */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="metodoContacto"
                    value="Mail"
                    checked={metodoContacto === 'Mail'}
                    onChange={(e) => setMetodoContacto(e.target.value)}
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#244C87' }}
                  />
                  <span style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#6B7280' }}>
                    Mail
                  </span>
                </label>

                {/* Llamada */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="metodoContacto"
                    value="Llamada"
                    checked={metodoContacto === 'Llamada'}
                    onChange={(e) => setMetodoContacto(e.target.value)}
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#244C87' }}
                  />
                  <span style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#6B7280' }}>
                    Llamada
                  </span>
                </label>

                {/* Mensaje */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="metodoContacto"
                    value="Mensaje"
                    checked={metodoContacto === 'Mensaje'}
                    onChange={(e) => setMetodoContacto(e.target.value)}
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#244C87' }}
                  />
                  <span style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#6B7280' }}>
                    Mensaje
                  </span>
                </label>
              </div>
            </div>

            {/* Botón Enviar */}
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSubmit}
                className="px-12 py-3 rounded-full transition-all duration-300 shadow-md"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '18px', 
                  color: '#244C87', 
                  fontWeight: 500, 
                  backgroundColor: '#E8EAF6' 
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
