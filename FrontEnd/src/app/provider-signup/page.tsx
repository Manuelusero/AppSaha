'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getEspecialidades } from '../data/especialidades';

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

const ciudadesArgentina = [
  'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata',
  'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan'
];

export default function ProviderSignup() {
  // Datos personales
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [profesion, setProfesion] = useState('');
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Redes sociales
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [sitioWeb, setSitioWeb] = useState('');

  // Multimedia
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotosTrabajos, setFotosTrabajos] = useState<File[]>([]);
  const [videos, setVideos] = useState<string[]>(['']); // URLs de videos

  // Documentación
  const [dni, setDni] = useState('');
  const [dniArchivo, setDniArchivo] = useState<File | null>(null);
  const [antecedentes, setAntecedentes] = useState<File | null>(null);

  // Referencias
  const [referencias, setReferencias] = useState([
    { nombre: '', telefono: '', relacion: '' }
  ]);

  // Certificados
  const [certificados, setCertificados] = useState<File[]>([]);

  // Credenciales
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  // UI states
  const [mostrarProfesiones, setMostrarProfesiones] = useState(false);
  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [paso, setPaso] = useState(1); // 1: Datos básicos, 2: Multimedia, 3: Documentación, 4: Referencias

  const handleAgregarVideo = () => {
    setVideos([...videos, '']);
  };

  const handleCambiarVideo = (index: number, valor: string) => {
    const nuevosVideos = [...videos];
    nuevosVideos[index] = valor;
    setVideos(nuevosVideos);
  };

  const handleAgregarReferencia = () => {
    setReferencias([...referencias, { nombre: '', telefono: '', relacion: '' }]);
  };

  const handleCambiarReferencia = (index: number, campo: string, valor: string) => {
    const nuevasRefs = [...referencias];
    nuevasRefs[index] = { ...nuevasRefs[index], [campo]: valor };
    setReferencias(nuevasRefs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (especialidades.length === 0) {
      alert('Por favor seleccioná al menos una especialidad');
      return;
    }

    const formData = {
      // Datos personales
      nombre,
      apellido,
      email,
      telefono,
      profesion,
      especialidades,
      ubicacion,
      descripcion,
      
      // Redes sociales
      redesSociales: {
        instagram,
        facebook,
        linkedin,
        sitioWeb
      },
      
      // Multimedia (se enviarían como FormData en la implementación real)
      multimedia: {
        fotoPerfil: fotoPerfil?.name,
        fotosTrabajos: fotosTrabajos.map(f => f.name),
        videos
      },
      
      // Documentación
      documentacion: {
        dni,
        dniArchivo: dniArchivo?.name,
        antecedentes: antecedentes?.name
      },
      
      // Referencias
      referencias,
      
      // Certificados
      certificados: certificados.map(c => c.name),
      
      // Credenciales
      password
    };

    console.log('Datos del formulario:', formData);
    
    // TODO: Enviar al backend
    alert('¡Registro exitoso! (Próximamente se conectará al backend)');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between bg-white border-b">
        <a href="/">
          <Image 
            src="/Logo.png" 
            alt="SaHa Logo" 
            width={120} 
            height={40}
            className="h-8 w-auto sm:h-10"
            priority
          />
        </a>
        <a 
          href="/"
          className="px-4 py-2 rounded-full border border-[#244C87] text-[#244C87] text-sm hover:bg-[#244C87] hover:text-white transition-colors"
        >
          Volver al inicio
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Título */}
          <h1 className="text-center mb-4" style={{ fontFamily: 'Maitree, serif', fontSize: '40px', lineHeight: '100%', color: '#244C87', fontWeight: 400 }}>
            Registrate como profesional
          </h1>
          <p className="text-center mb-12" style={{ fontFamily: 'Maitree, serif', fontSize: '18px', color: '#000000' }}>
            Completá tus datos para formar parte de nuestra comunidad
          </p>

          {/* Indicador de pasos */}
          <div className="flex justify-center mb-12 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  paso >= num ? 'bg-[#244C87] text-white' : 'bg-gray-200 text-gray-500'
                }`}
                style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600 }}
              >
                {num}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* PASO 1: Datos Básicos */}
            {paso === 1 && (
              <div className="space-y-6">
                <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '28px', fontWeight: 600, color: '#244C87', marginBottom: '24px' }}>
                  Datos Básicos
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                  />
                </div>

                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Profesión / Oficio *
                  </label>
                  <input
                    type="text"
                    value={profesion}
                    onChange={(e) => setProfesion(e.target.value)}
                    onFocus={() => setMostrarProfesiones(true)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    placeholder="Seleccioná tu profesión"
                  />
                  {mostrarProfesiones && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                      {servicios
                        .filter(s => s.toLowerCase().includes(profesion.toLowerCase()))
                        .map((servicio, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setProfesion(servicio);
                              setMostrarProfesiones(false);
                            }}
                            className="px-5 py-3 hover:bg-indigo-50 cursor-pointer"
                            style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                          >
                            {servicio}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Campo de especialidades */}
                {profesion && (
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Especialidades * (seleccioná al menos una)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getEspecialidades(profesion).map((esp, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center px-4 py-3 rounded-full border-2 cursor-pointer transition-all ${
                            especialidades.includes(esp)
                              ? 'bg-[#244C87] text-white border-[#244C87]'
                              : 'bg-white text-black border-gray-300 hover:border-[#244C87]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={especialidades.includes(esp)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEspecialidades([...especialidades, esp]);
                              } else {
                                setEspecialidades(especialidades.filter(e => e !== esp));
                              }
                            }}
                            className="hidden"
                          />
                          <span style={{ fontFamily: 'Maitree, serif', fontSize: '14px' }}>
                            {esp}
                          </span>
                        </label>
                      ))}
                    </div>
                    {especialidades.length === 0 && (
                      <p className="mt-2 text-sm text-red-500" style={{ fontFamily: 'Maitree, serif' }}>
                        Seleccioná al menos una especialidad
                      </p>
                    )}
                  </div>
                )}

                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    onFocus={() => setMostrarUbicaciones(true)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    placeholder="¿Dónde trabajás?"
                  />
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
                            className="px-5 py-3 hover:bg-indigo-50 cursor-pointer"
                            style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                          >
                            {ciudad}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Descripción de tu servicio *
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-3xl border-2 border-gray-300 focus:border-[#244C87] focus:outline-none resize-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    placeholder="Contanos sobre tu experiencia y servicios que ofrecés..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Confirmar Contraseña *
                    </label>
                    <input
                      type="password"
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: Multimedia y Redes Sociales */}
            {paso === 2 && (
              <div className="space-y-6">
                <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '28px', fontWeight: 600, color: '#244C87', marginBottom: '24px' }}>
                  Multimedia y Redes Sociales
                </h2>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Foto de perfil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFotoPerfil(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Fotos de tus trabajos (máximo 10)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFotosTrabajos(Array.from(e.target.files || []))}
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Videos (URLs de YouTube, Vimeo, etc.)
                  </label>
                  {videos.map((video, idx) => (
                    <div key={idx} className="mb-2">
                      <input
                        type="url"
                        value={video}
                        onChange={(e) => handleCambiarVideo(idx, e.target.value)}
                        placeholder="https://youtube.com/..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                        style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAgregarVideo}
                    className="mt-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '14px' }}
                  >
                    + Agregar otro video
                  </button>
                </div>

                <hr className="my-8" />

                <h3 style={{ fontFamily: 'Maitree, serif', fontSize: '24px', fontWeight: 600, color: '#244C87', marginBottom: '16px' }}>
                  Redes Sociales
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@tu_usuario"
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="facebook.com/tu_pagina"
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/tu_perfil"
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Sitio web
                    </label>
                    <input
                      type="url"
                      value={sitioWeb}
                      onChange={(e) => setSitioWeb(e.target.value)}
                      placeholder="https://tuweb.com"
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: Documentación */}
            {paso === 3 && (
              <div className="space-y-6">
                <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '28px', fontWeight: 600, color: '#244C87', marginBottom: '24px' }}>
                  Documentación
                </h2>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Número de DNI *
                  </label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Foto/Escaneo del DNI * (frente y dorso)
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setDniArchivo(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Certificado de Antecedentes Penales *
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setAntecedentes(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                  />
                  <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: 'Maitree, serif' }}>
                    Podés obtenerlo en: www.argentina.gob.ar/antecedentes-penales
                  </p>
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Certificados profesionales (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={(e) => setCertificados(Array.from(e.target.files || []))}
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                  />
                  <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: 'Maitree, serif' }}>
                    Certificados de cursos, matrículas, habilitaciones, etc.
                  </p>
                </div>
              </div>
            )}

            {/* PASO 4: Referencias */}
            {paso === 4 && (
              <div className="space-y-6">
                <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '28px', fontWeight: 600, color: '#244C87', marginBottom: '24px' }}>
                  Referencias
                </h2>

                <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', marginBottom: '24px' }}>
                  Agregá al menos 2 referencias de clientes o colegas que puedan hablar sobre tu trabajo
                </p>

                {referencias.map((ref, idx) => (
                  <div key={idx} className="p-6 bg-gray-50 rounded-3xl space-y-4">
                    <h3 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600 }}>
                      Referencia {idx + 1}
                    </h3>
                    
                    <div>
                      <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={ref.nombre}
                        onChange={(e) => handleCambiarReferencia(idx, 'nombre', e.target.value)}
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                        style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={ref.telefono}
                        onChange={(e) => handleCambiarReferencia(idx, 'telefono', e.target.value)}
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                        style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                        Relación (cliente, colega, empleador, etc.)
                      </label>
                      <input
                        type="text"
                        value={ref.relacion}
                        onChange={(e) => handleCambiarReferencia(idx, 'relacion', e.target.value)}
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                        style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAgregarReferencia}
                  className="w-full py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                >
                  + Agregar otra referencia
                </button>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between pt-8">
              {paso > 1 && (
                <button
                  type="button"
                  onClick={() => setPaso(paso - 1)}
                  className="px-8 py-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  style={{ fontFamily: 'Maitree, serif', fontSize: '18px' }}
                >
                  Anterior
                </button>
              )}

              {paso < 4 ? (
                <button
                  type="button"
                  onClick={() => setPaso(paso + 1)}
                  className="ml-auto px-8 py-3 rounded-full bg-[#244C87] text-white hover:bg-[#1a3a6b] transition-colors"
                  style={{ fontFamily: 'Maitree, serif', fontSize: '18px' }}
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-8 py-3 rounded-full bg-[#244C87] text-white hover:bg-[#1a3a6b] transition-colors"
                  style={{ fontFamily: 'Maitree, serif', fontSize: '18px' }}
                >
                  Completar registro
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Click outside handlers */}
      {(mostrarProfesiones || mostrarUbicaciones) && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => {
            setMostrarProfesiones(false);
            setMostrarUbicaciones(false);
          }}
        />
      )}
    </div>
  );
}
