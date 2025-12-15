'use client';

import { useState, useEffect } from 'react';
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
  'Buenos Aires, Buenos Aires',
  'La Plata, Buenos Aires',
  'Mar del Plata, Buenos Aires',
  'Córdoba, Córdoba',
  'Rosario, Santa Fe',
  'Mendoza, Mendoza',
  'San Miguel de Tucumán, Tucumán',
  'Salta, Salta',
  'Santa Fe, Santa Fe',
  'San Juan, San Juan',
  'Resistencia, Chaco',
  'Neuquén, Neuquén',
  'Posadas, Misiones',
  'Bahía Blanca, Buenos Aires',
  'Paraná, Entre Ríos',
  'San Salvador de Jujuy, Jujuy',
  'Corrientes, Corrientes',
  'Santiago del Estero, Santiago del Estero',
  'San Fernando del Valle de Catamarca, Catamarca',
  'Formosa, Formosa',
  'San Luis, San Luis',
  'La Rioja, La Rioja',
  'Río Cuarto, Córdoba',
  'Comodoro Rivadavia, Chubut',
  'Quilmes, Buenos Aires',
  'San Isidro, Buenos Aires',
  'Vicente López, Buenos Aires',
  'Lomas de Zamora, Buenos Aires',
  'Banfield, Buenos Aires',
  'Pergamino, Buenos Aires',
  'Tandil, Buenos Aires',
  'Olavarría, Buenos Aires',
  'Zárate, Buenos Aires',
  'Campana, Buenos Aires',
  'Luján, Buenos Aires',
  'San Nicolás de los Arroyos, Buenos Aires',
  'Junín, Buenos Aires',
  'Necochea, Buenos Aires',
  'Chivilcoy, Buenos Aires',
  'Mercedes, Buenos Aires',
  'Villa María, Córdoba',
  'San Francisco, Córdoba',
  'Villa Carlos Paz, Córdoba',
  'Rafaela, Santa Fe',
  'Venado Tuerto, Santa Fe',
  'Reconquista, Santa Fe',
  'Godoy Cruz, Mendoza',
  'San Rafael, Mendoza',
  'Maipú, Mendoza',
  'Ushuaia, Tierra del Fuego',
  'Río Grande, Tierra del Fuego',
  'San Carlos de Bariloche, Río Negro',
  'Cipolletti, Río Negro',
  'Trelew, Chubut',
  'Puerto Madryn, Chubut',
  'Concordia, Entre Ríos',
  'Gualeguaychú, Entre Ríos',
  'Oberá, Misiones',
  'Eldorado, Misiones',
  'Goya, Corrientes',
  'Paso de los Libres, Corrientes',
  'Tartagal, Salta',
  'Orán, Salta',
  'Yerba Buena, Tucumán',
  'Concepción, Tucumán',
  'La Banda, Santiago del Estero',
  'Termas de Río Hondo, Santiago del Estero'
  // TODO: Cuando se implemente la API de Google Maps, reemplazar este listado estático
  // con búsquedas dinámicas usando Places API o Geocoding API
];

export default function ProviderSignup() {
  // Función para capitalizar cada palabra
  const capitalizeName = (text: string): string => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Datos personales
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [profesion, setProfesion] = useState('');
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [profesionesAdicionales, setProfesionesAdicionales] = useState<Array<{profesion: string, especialidades: string[]}>>([]);
  const [ubicacion, setUbicacion] = useState('');
  const [alcanceTrabajo, setAlcanceTrabajo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mostrarProfesiones, setMostrarProfesiones] = useState(false);
  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [ubicacionesFiltradas, setUbicacionesFiltradas] = useState<string[]>([]);
  const [profesionAdicionalAbierta, setProfesionAdicionalAbierta] = useState<number | null>(null);

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
  const [tipoDni, setTipoDni] = useState(''); // DNI, Pasaporte, etc.
  const [fotoDniFrente, setFotoDniFrente] = useState<File | null>(null);
  const [fotoDniDorso, setFotoDniDorso] = useState<File | null>(null);
  const [antecedentes, setAntecedentes] = useState<File | null>(null);
  const [certificadosProfesionales, setCertificadosProfesionales] = useState<Array<{nombre: string, archivo: File | null}>>([
    { nombre: '', archivo: null }
  ]);

  // Referencias
  const [referencias, setReferencias] = useState([
    { nombre: '', telefono: '', relacion: '' }
  ]);

  // Certificados (legacy - mantener por compatibilidad)
  const [certificados, setCertificados] = useState<File[]>([]);

  // Credenciales
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [codigoVerificacion, setCodigoVerificacion] = useState('');

  // UI states
  const [paso, setPaso] = useState(1); // 1: Datos Personales, 2: Datos Profesionales, 3: Documentación, 4: Extras
  const [mostrarModalEmail, setMostrarModalEmail] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);

  // Scroll al inicio cuando cambia el paso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [paso]);

  // Función para filtrar ubicaciones mientras escribe
  const handleUbicacionChange = (valor: string) => {
    setUbicacion(valor);
    if (valor.length > 0) {
      const filtradas = ciudadesArgentina.filter(ciudad => 
        ciudad.toLowerCase().includes(valor.toLowerCase())
      );
      setUbicacionesFiltradas(filtradas.slice(0, 5)); // Mostrar solo las primeras 5
      setMostrarUbicaciones(true);
    } else {
      setUbicacionesFiltradas([]);
      setMostrarUbicaciones(false);
    }
  };

  // Función para seleccionar una ubicación
  const seleccionarUbicacion = (ciudad: string) => {
    setUbicacion(ciudad);
    setMostrarUbicaciones(false);
  };

  // Función para agregar especialidad
  const toggleEspecialidad = (especialidad: string) => {
    if (especialidades.includes(especialidad)) {
      setEspecialidades(especialidades.filter(e => e !== especialidad));
    } else {
      setEspecialidades([...especialidades, especialidad]);
    }
  };

  // Función para agregar otra profesión
  const agregarOtraProfesion = () => {
    setProfesionesAdicionales([...profesionesAdicionales, { profesion: '', especialidades: [] }]);
  };

  // Función para actualizar profesión adicional
  const actualizarProfesionAdicional = (index: number, profesion: string) => {
    const nuevas = [...profesionesAdicionales];
    nuevas[index].profesion = profesion;
    nuevas[index].especialidades = []; // Resetear especialidades cuando cambia la profesión
    setProfesionesAdicionales(nuevas);
  };

  // Función para toggle especialidad en profesión adicional
  const toggleEspecialidadAdicional = (indexProfesion: number, especialidad: string) => {
    const nuevas = [...profesionesAdicionales];
    const especialidadesActuales = nuevas[indexProfesion].especialidades;
    
    if (especialidadesActuales.includes(especialidad)) {
      nuevas[indexProfesion].especialidades = especialidadesActuales.filter(e => e !== especialidad);
    } else {
      nuevas[indexProfesion].especialidades = [...especialidadesActuales, especialidad];
    }
    
    setProfesionesAdicionales(nuevas);
  };

  // Función para enviar código de verificación (a implementar con email real)
  const enviarCodigoVerificacion = async () => {
    // TODO: Implementar cuando tengamos el servicio de email
    console.log('Enviando código de verificación a:', email);
    alert('Función de verificación de email pendiente de implementar con el mail de la empresa');
    // const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    // setCodigoVerificacion(codigo);
    // await fetch('/api/send-verification-email', { ... });
  };

  // Validación para el paso 1
  const validarPaso1 = () => {
    // Verificar que todos los campos estén llenos
    if (!nombre || !apellido || !email || !telefono || !password || !confirmarPassword) {
      alert('Por favor completa todos los campos');
      return false;
    }

    // Verificar que las contraseñas coincidan
    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return false;
    }

    // Verificar longitud mínima
    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Verificar mayúscula
    if (!/[A-Z]/.test(password)) {
      alert('La contraseña debe contener al menos una letra mayúscula');
      return false;
    }

    // Verificar número
    if (!/[0-9]/.test(password)) {
      alert('La contraseña debe contener al menos un número');
      return false;
    }

    return true;
  };

  const handleSiguiente = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevenir el submit del formulario
    if (e) {
      e.preventDefault();
    }
    
    // Validar paso 1 antes de continuar
    if (paso === 1 && !validarPaso1()) {
      return;
    }

    // Si es el paso 1, guardar los datos básicos
    if (paso === 1) {
      try {
        // Guardar en localStorage temporalmente
        const datosBasicos = {
          nombre,
          apellido,
          email,
          telefono,
          password
        };
        localStorage.setItem('registroTemporal', JSON.stringify(datosBasicos));
        setDatosGuardados(true);

        // TODO: Enviar email de verificación con el servicio de email de la empresa
        console.log('Enviando email de verificación a:', email);
        // await fetch('/api/send-verification-email', { body: JSON.stringify({ email }) });
        
        // Mostrar modal
        setMostrarModalEmail(true);
        
      } catch (error) {
        console.error('Error al guardar datos:', error);
        alert('Error al guardar los datos. Por favor intentá de nuevo.');
        return;
      }
    } else {
      // Para otros pasos, simplemente avanzar
      setPaso(paso + 1);
    }
  };

  const handleAgregarVideo = () => {
    setVideos([...videos, '']);
  };

  const handleCambiarVideo = (index: number, valor: string) => {
    const nuevosVideos = [...videos];
    nuevosVideos[index] = valor;
    setVideos(nuevosVideos);
  };

  const agregarCertificadoProfesional = () => {
    setCertificadosProfesionales([...certificadosProfesionales, { nombre: '', archivo: null }]);
  };

  const actualizarNombreCertificado = (index: number, nombre: string) => {
    const nuevos = [...certificadosProfesionales];
    nuevos[index].nombre = nombre;
    setCertificadosProfesionales(nuevos);
  };

  const actualizarArchivoCertificado = (index: number, archivo: File | null) => {
    const nuevos = [...certificadosProfesionales];
    nuevos[index].archivo = archivo;
    setCertificadosProfesionales(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Solo procesar el submit si estamos en el paso 4
    if (paso !== 4) {
      return;
    }
    
    console.log('Formulario enviado - iniciando registro...');
    
    // GUARDAR DATOS EN LOCALSTORAGE PRIMERO (antes de cualquier validación o llamada al backend)
    const registroCompleto = {
      nombre,
      apellido,
      email,
      telefono,
      profesion,
      especialidades,
      profesionesAdicionales,
      ubicacion,
      alcanceTrabajo,
      descripcion,
      instagram,
      facebook,
      linkedin,
      dni,
      certificadosProfesionales: certificadosProfesionales.map(c => c.nombre),
      fotoPerfil: fotoPerfil ? fotoPerfil.name : '',
      fotosTrabajos: fotosTrabajos.map(f => f.name)
    };
    localStorage.setItem('registroCompleto', JSON.stringify(registroCompleto));
    console.log('Datos guardados en localStorage:', registroCompleto);
    
    // Validaciones
    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar que la contraseña tenga al menos una mayúscula y un número
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    
    if (!tieneMayuscula || !tieneNumero) {
      alert('La contraseña debe contener al menos una mayúscula y un número');
      return;
    }

    if (especialidades.length === 0) {
      alert('Por favor seleccioná al menos una especialidad');
      return;
    }

    // Crear FormData para enviar archivos
    const formData = new FormData();
    
    // Datos personales
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('email', email);
    formData.append('telefono', telefono);
    formData.append('password', password);
    formData.append('profesion', profesion);
    formData.append('especialidades', JSON.stringify(especialidades));
    formData.append('profesionesAdicionales', JSON.stringify(profesionesAdicionales));
    formData.append('ubicacion', ubicacion);
    formData.append('alcanceTrabajo', alcanceTrabajo);
    formData.append('descripcion', descripcion);
    formData.append('dni', dni);
    
    // Redes sociales
    if (instagram) formData.append('instagram', instagram);
    if (facebook) formData.append('facebook', facebook);
    if (linkedin) formData.append('linkedin', linkedin);
    
    // Archivos
    if (fotoPerfil) {
      formData.append('fotoPerfil', fotoPerfil);
    }
    
    if (fotoDniFrente) {
      formData.append('fotoDniFrente', fotoDniFrente);
    }
    
    if (fotoDniDorso) {
      formData.append('fotoDniDorso', fotoDniDorso);
    }
    
    // Fotos de trabajos (múltiples)
    fotosTrabajos.forEach(foto => {
      formData.append('fotosTrabajos', foto);
    });
    
    // Certificados (múltiples)
    certificadosProfesionales.forEach(cert => {
      if (cert.archivo) {
        formData.append('certificados', cert.archivo);
      }
    });

    console.log('Enviando registro al backend...');
    
    try {
      const response = await fetch('http://localhost:8000/api/providers/register', {
        method: 'POST',
        body: formData
        // No establecer Content-Type, el navegador lo hará automáticamente con boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar proveedor');
      }

      console.log('✅ Registro exitoso:', data);
      
      // Guardar el ID del proveedor y token si vienen en la respuesta
      if (data.provider?.id) {
        localStorage.setItem('providerId', data.provider.id);
      }
      
      // Redirigir al dashboard
      alert('¡Registro completado exitosamente!');
      window.location.href = '/dashboard-provider';
      
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      alert(error instanceof Error ? error.message : 'Error al registrar. Por favor intentá de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header con degradado */}
      <header 
        className="px-6 flex items-start"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          width: '480px',
          height: '124px',
          opacity: 1
        }}
      >
        <button
          onClick={() => {
            if (paso === 1) {
              window.location.href = '/';
            } else {
              setPaso(paso - 1);
            }
          }}
          className="hover:bg-white/20 rounded-full transition-colors"
          style={{ 
            cursor: 'pointer',
            marginTop: '58px',
            marginBottom: '38.7px'
          }}
        >
          <svg width="32" height="32" fill="none" stroke="#000000" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Título del paso actual */}
          <h2 className="text-center" style={{ fontFamily: 'Maitree', fontSize: '40px', fontWeight: 400, fontStyle: 'normal', lineHeight: '100%', letterSpacing: '0%', color: '#244C87', marginTop: '0px', marginBottom: '32px' }}>
            {paso === 1 && 'Datos Personales'}
            {paso === 2 && 'Datos Profesionales'}
            {paso === 3 && 'Documentación'}
            {paso === 4 && 'Extras'}
          </h2>

          {/* Indicador de pasos */}
          <div className="flex justify-center mb-12 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  paso >= num ? 'bg-[#244C87] text-white' : 'bg-gray-300 text-gray-500'
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
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(capitalizeName(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder="JOSE"
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(capitalizeName(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder="PEREZ"
                  />
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
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder="algo@algo.com"
                  />
                  {/* TODO: Agregar botón de "Verificar Email" y campo para código de verificación */}
                  {/* <button onClick={enviarCodigoVerificacion}>Verificar Email</button> */}
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Telefono laboral *
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder="+54 1234 34 54"
                  />
                  <p className="mt-2 text-xs text-gray-600 flex items-start gap-1" style={{ fontFamily: 'Maitree, serif' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Tu número de teléfono no será compartido con nadie hasta que seas contactado por un cliente</span>
                  </p>
                </div>

                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Contraseña *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[46px] text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                  <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: 'Maitree, serif' }}>
                    Mínimo 6 dígitos. Debe contener al menos una mayúscula y un número
                  </p>
                </div>

                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Repetir Contraseña *
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[46px] text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: Datos Profesionales */}
            {paso === 2 && (
              <div className="space-y-6">
                {/* Profesión Principal */}
                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Profesión / Oficio principal *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profesion}
                      onClick={() => setMostrarProfesiones(true)}
                      readOnly
                      required
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none cursor-pointer"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                      placeholder="Seleccionar profesión"
                    />
                    {mostrarProfesiones && (
                      <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                        {servicios.map((servicio) => (
                          <div
                            key={servicio}
                            onClick={() => {
                              setProfesion(servicio);
                              setEspecialidades([]); // Resetear especialidades
                              setMostrarProfesiones(false);
                            }}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                            style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                          >
                            {servicio}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Especialidades de la profesión principal */}
                {profesion && (
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Especialidades *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getEspecialidades(profesion).map((esp) => (
                        <button
                          key={esp}
                          type="button"
                          onClick={() => toggleEspecialidad(esp)}
                          className={`px-4 py-2 rounded-full border-2 transition-colors ${
                            especialidades.includes(esp)
                              ? 'bg-[#244C87] text-white border-[#244C87]'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-[#244C87]'
                          }`}
                          style={{ fontFamily: 'Maitree, serif', fontSize: '14px' }}
                        >
                          {esp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Profesiones adicionales */}
                {profesionesAdicionales.map((profAdic, index) => (
                  <div key={index} className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="relative">
                      <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                        Otra Profesión / Oficio
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={profAdic.profesion}
                          onClick={() => setProfesionAdicionalAbierta(index)}
                          readOnly
                          className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none cursor-pointer"
                          style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                          placeholder="Seleccionar profesión"
                        />
                        {profesionAdicionalAbierta === index && (
                          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                            {servicios
                              .filter(servicio => {
                                // Filtrar la profesión principal
                                if (servicio === profesion) return false;
                                // Filtrar las profesiones ya agregadas
                                return !profesionesAdicionales.some(p => p.profesion === servicio);
                              })
                              .map((servicio) => (
                              <div
                                key={servicio}
                                onClick={() => {
                                  actualizarProfesionAdicional(index, servicio);
                                  setProfesionAdicionalAbierta(null);
                                }}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                              >
                                {servicio}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {profAdic.profesion && (
                      <div>
                        <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                          Especialidades
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getEspecialidades(profAdic.profesion).map((esp) => (
                            <button
                              key={esp}
                              type="button"
                              onClick={() => toggleEspecialidadAdicional(index, esp)}
                              className={`px-4 py-2 rounded-full border-2 transition-colors ${
                                profAdic.especialidades.includes(esp)
                                  ? 'bg-[#244C87] text-white border-[#244C87]'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#244C87]'
                              }`}
                              style={{ fontFamily: 'Maitree, serif', fontSize: '14px' }}
                            >
                              {esp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Botón para agregar otra profesión */}
                <button
                  type="button"
                  onClick={agregarOtraProfesion}
                  className="w-full py-3 rounded-full border-2 border-[#244C87] text-[#244C87] hover:bg-[#244C87] hover:text-white transition-colors"
                  style={{ fontFamily: 'Maitree, serif', fontSize: '16px', fontWeight: 600 }}
                >
                  + Agregar otra profesión
                </button>

                {/* Ubicación con autocompletado */}
                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => handleUbicacionChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder="Empezá a escribir tu ciudad..."
                  />
                  {mostrarUbicaciones && ubicacionesFiltradas.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                      {ubicacionesFiltradas.map((ciudad, idx) => (
                        <div
                          key={idx}
                          onClick={() => seleccionarUbicacion(ciudad)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                          style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                        >
                          {ciudad}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Alcance del trabajo */}
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Alcance del trabajo
                  </label>
                  <input
                    type="number"
                    value={alcanceTrabajo}
                    onChange={(e) => setAlcanceTrabajo(e.target.value)}
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder="Ejemplo: 10"
                    min="0"
                  />
                  <p className="mt-2 text-xs text-gray-600" style={{ fontFamily: 'Maitree, serif' }}>
                    ¿Hasta cuántos km estarías dispuesto/a a moverte para trabajar desde {ubicacion || 'tu ubicación'}?
                  </p>
                </div>
              </div>
            )}

            {/* PASO 3: Documentación */}
            {paso === 3 && (
              <div className="space-y-6">
                {/* DNI* */}
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    DNI*
                  </label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="DNI"
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                  />
                </div>

                {/* Fotos del DNI (frente y dorso) */}
                <div>
                  <label className="block mb-4" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Fotos del DNI <span style={{ color: '#999999' }}>(frente y dorso)</span>
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center cursor-pointer hover:border-[#244C87] transition-colors"
                    onClick={() => document.getElementById('file-dni')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <p className="mt-4" style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#999999' }}>
                        Arrastrá tu foto o hacé click para subirlo
                      </p>
                      {(fotoDniFrente || fotoDniDorso) && (
                        <p className="mt-2 text-sm text-green-600" style={{ fontFamily: 'Maitree, serif' }}>
                          {fotoDniFrente?.name} {fotoDniDorso && `y ${fotoDniDorso.name}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <input
                    id="file-dni"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        setFotoDniFrente(files[0] || null);
                        setFotoDniDorso(files[1] || null);
                      }
                    }}
                    multiple
                    className="hidden"
                  />
                </div>

                {/* Certificado Profesional */}
                {certificadosProfesionales.map((cert, idx) => (
                  <div key={idx} className="space-y-4">
                    <label className="block" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                      Certificado Profesional
                    </label>
                    <input
                      type="text"
                      value={cert.nombre}
                      onChange={(e) => actualizarNombreCertificado(idx, e.target.value)}
                      placeholder="Nombre del curso/formación"
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    />
                    
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center cursor-pointer hover:border-[#244C87] transition-colors"
                      onClick={() => document.getElementById(`file-cert-${idx}`)?.click()}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <p className="mt-4" style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#999999' }}>
                          Arrastrá tu certificado o hacé click para subirlo
                        </p>
                        {cert.archivo && (
                          <p className="mt-2 text-sm text-green-600" style={{ fontFamily: 'Maitree, serif' }}>
                            {cert.archivo.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <input
                      id={`file-cert-${idx}`}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => actualizarArchivoCertificado(idx, e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                ))}

                {/* Botón Agregar otra Certificado */}
                <button
                  type="button"
                  onClick={agregarCertificadoProfesional}
                  className="text-[#244C87] underline"
                  style={{ fontFamily: 'Maitree, serif', fontSize: '16px', fontWeight: 600 }}
                >
                  Agregar otra Certificado +
                </button>
              </div>
            )}

            {/* PASO 4: Extras */}
            {paso === 4 && (
              <div className="space-y-6">
                {/* Foto de perfil */}
                <div>
                  <label className="block mb-4" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Foto de perfil
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center cursor-pointer hover:border-[#244C87] transition-colors"
                    onClick={() => document.getElementById('file-perfil')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <p className="mt-4" style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#999999' }}>
                        Arrastrá tu foto o hacé click para subirlo
                      </p>
                      {fotoPerfil && (
                        <p className="mt-2 text-sm text-green-600" style={{ fontFamily: 'Maitree, serif' }}>
                          {fotoPerfil.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <input
                    id="file-perfil"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFotoPerfil(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>

                {/* Descripción de tu servicio */}
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Descripción de tu servicio
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-3xl border-2 border-gray-300 focus:border-[#244C87] focus:outline-none resize-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                    placeholder=""
                  />
                </div>

                {/* Fotos de tu trabajo */}
                <div>
                  <label className="block mb-4" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Fotos de tu trabajo <span style={{ color: '#999999' }}>(máximo 5 fotos)</span>
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center cursor-pointer hover:border-[#244C87] transition-colors"
                    onClick={() => document.getElementById('file-trabajos')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <p className="mt-4" style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#999999' }}>
                        Arrastrá tu foto o hacé click para subirlo
                      </p>
                      {fotosTrabajos.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-green-600" style={{ fontFamily: 'Maitree, serif' }}>
                            {fotosTrabajos.length} foto{fotosTrabajos.length > 1 ? 's' : ''} seleccionada{fotosTrabajos.length > 1 ? 's' : ''} (de 5)
                          </p>
                          <div className="mt-2 text-xs text-gray-600" style={{ fontFamily: 'Maitree, serif' }}>
                            {fotosTrabajos.map((foto, idx) => (
                              <div key={idx}>• {foto.name}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {fotosTrabajos.length >= 5 && (
                        <p className="mt-2 text-sm text-orange-600" style={{ fontFamily: 'Maitree, serif' }}>
                          ¡Has alcanzado el límite de 5 fotos!
                        </p>
                      )}
                    </div>
                  </div>
                  <input
                    id="file-trabajos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 5) {
                        alert('Solo podés subir un máximo de 5 fotos');
                        setFotosTrabajos(files.slice(0, 5));
                      } else {
                        setFotosTrabajos(files);
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="insertá nombre de usuario"
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                  />
                </div>

                {/* Facebook */}
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="insertá nombre de usuario"
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}>
                    Linkedin
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="insertá URL del perfil"
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
                  />
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-end pt-8">
              {paso < 4 ? (
                <button
                  type="button"
                  onClick={handleSiguiente}
                  className="px-8 py-3 rounded-full bg-[#244C87] text-white hover:bg-[#1a3a6b] transition-colors cursor-pointer"
                  style={{ fontFamily: 'Maitree, serif', fontSize: '18px' }}
                >
                  {paso === 1 ? 'Guardar y seguir' : 'Siguiente'}
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-[#244C87] text-white hover:bg-[#1a3a6b] transition-colors cursor-pointer"
                  style={{ fontFamily: 'Maitree, serif', fontSize: '18px' }}
                >
                  Finalizar registro
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

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

      {/* Modal de verificación de email */}
      {mostrarModalEmail && paso === 1 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center">
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Maitree', color: '#244C87' }}>
              ¡Revisá tu email!
            </h2>
            <p className="mb-6" style={{ fontFamily: 'Maitree', fontSize: '16px', color: '#000000' }}>
              Te enviamos un correo a <strong>{email}</strong> con un enlace para verificar tu cuenta y seguir completando tu perfil.
            </p>
            <p className="mb-6 text-sm text-gray-600" style={{ fontFamily: 'Maitree' }}>
              Si no ves el correo, revisá tu carpeta de spam.
            </p>
            <button
              onClick={() => {
                setMostrarModalEmail(false);
                // Avanzar al paso 2 para continuar con el registro
                setPaso(2);
              }}
              className="px-8 py-3 rounded-full bg-[#244C87] text-white hover:bg-[#1a3a6b] transition-colors"
              style={{ fontFamily: 'Maitree', fontSize: '16px' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {(mostrarProfesiones || mostrarUbicaciones || profesionAdicionalAbierta !== null) && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => {
            setMostrarProfesiones(false);
            setMostrarUbicaciones(false);
            setProfesionAdicionalAbierta(null);
          }}
        />
      )}
    </div>
  );
}
