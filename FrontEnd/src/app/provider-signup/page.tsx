'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getEspecialidades } from '../data/especialidades';
import { Footer } from '@/components/layout';
import { Input, Button } from '@/components/ui';
import { colors, typography, spacing } from '@/styles/tokens';
import { useForm } from '@/hooks';

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

  // Hook de formulario unificado
  const { values, handleChange, setFieldValue, resetForm } = useForm({
    initialValues: {
      // Datos personales
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      profesion: '',
      especialidades: [] as string[],
      profesionesAdicionales: [] as Array<{profesion: string, especialidades: string[]}>,
      ubicacion: '',
      alcanceTrabajo: '',
      descripcion: '',
      // Redes sociales
      instagram: '',
      facebook: '',
      linkedin: '',
      // Multimedia
      fotoPerfil: null as File | null,
      fotosTrabajos: [] as File[],
      // Documentación
      dni: '',
      fotoDniFrente: null as File | null,
      fotoDniDorso: null as File | null,
      certificadosProfesionales: [{ nombre: '', archivo: null }] as Array<{nombre: string, archivo: File | null}>,
      // Credenciales
      password: '',
      confirmarPassword: ''
    },
    onSubmit: () => {} // Se maneja por handleSubmit personalizado
  });

  // UI states separados (no son parte del formulario)
  const [mostrarProfesiones, setMostrarProfesiones] = useState(false);
  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [ubicacionesFiltradas, setUbicacionesFiltradas] = useState<string[]>([]);
  const [profesionAdicionalAbierta, setProfesionAdicionalAbierta] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [paso, setPaso] = useState(1); // 1: Datos Personales, 2: Datos Profesionales, 3: Documentación, 4: Extras
  const [mostrarModalEmail, setMostrarModalEmail] = useState(false);

  // Scroll al inicio cuando cambia el paso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [paso]);

  // Función para filtrar ubicaciones mientras escribe
  const handleUbicacionChange = (valor: string) => {
    setFieldValue('ubicacion', valor);
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
    setFieldValue('ubicacion', ciudad);
    setMostrarUbicaciones(false);
  };

  // Función para agregar especialidad
  const toggleEspecialidad = (especialidad: string) => {
    if (values.especialidades.includes(especialidad)) {
      setFieldValue('especialidades', values.especialidades.filter((e: string) => e !== especialidad));
    } else {
      setFieldValue('especialidades', [...values.especialidades, especialidad]);
    }
  };

  // Función para agregar otra profesión
  const agregarOtraProfesion = () => {
    setFieldValue('profesionesAdicionales', [...values.profesionesAdicionales, { profesion: '', especialidades: [] }]);
  };

  // Función para actualizar profesión adicional
  const actualizarProfesionAdicional = (index: number, profesion: string) => {
    const nuevas = [...values.profesionesAdicionales];
    nuevas[index].profesion = profesion;
    nuevas[index].especialidades = []; // Resetear especialidades cuando cambia la profesión
    setFieldValue('profesionesAdicionales', nuevas);
  };

  // Función para toggle especialidad en profesión adicional
  const toggleEspecialidadAdicional = (indexProfesion: number, especialidad: string) => {
    const nuevas = [...values.profesionesAdicionales];
    const especialidadesActuales = nuevas[indexProfesion].especialidades;
    
    if (especialidadesActuales.includes(especialidad)) {
      nuevas[indexProfesion].especialidades = especialidadesActuales.filter((e: string) => e !== especialidad);
    } else {
      nuevas[indexProfesion].especialidades = [...especialidadesActuales, especialidad];
    }
    
    setFieldValue('profesionesAdicionales', nuevas);
  };

  // Validación para el paso 1
  const validarPaso1 = () => {
    // Verificar que todos los campos estén llenos
    if (!values.nombre || !values.apellido || !values.email || !values.telefono || !values.password || !values.confirmarPassword) {
      alert('Por favor completa todos los campos');
      return false;
    }

    // Verificar que las contraseñas coincidan
    if (values.password !== values.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return false;
    }

    // Verificar longitud mínima
    if (values.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Verificar mayúscula
    if (!/[A-Z]/.test(values.password)) {
      alert('La contraseña debe contener al menos una letra mayúscula');
      return false;
    }

    // Verificar número
    if (!/[0-9]/.test(values.password)) {
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
          nombre: values.nombre,
          apellido: values.apellido,
          email: values.email,
          telefono: values.telefono,
          password: values.password
        };
        localStorage.setItem('registroTemporal', JSON.stringify(datosBasicos));

        // TODO: Enviar email de verificación con el servicio de email de la empresa
        console.log('Enviando email de verificación a:', values.email);
        // await fetch('/api/send-verification-email', { body: JSON.stringify({ email: values.email }) });
        
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

  const agregarCertificadoProfesional = () => {
    setFieldValue('certificadosProfesionales', [...values.certificadosProfesionales, { nombre: '', archivo: null }]);
  };

  const actualizarNombreCertificado = (index: number, nombre: string) => {
    const nuevos = [...values.certificadosProfesionales];
    nuevos[index].nombre = nombre;
    setFieldValue('certificadosProfesionales', nuevos);
  };

  const actualizarArchivoCertificado = (index: number, archivo: File | null) => {
    const nuevos = [...values.certificadosProfesionales];
    nuevos[index].archivo = archivo;
    setFieldValue('certificadosProfesionales', nuevos);
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
      nombre: values.nombre,
      apellido: values.apellido,
      email: values.email,
      telefono: values.telefono,
      profesion: values.profesion,
      especialidades: values.especialidades,
      profesionesAdicionales: values.profesionesAdicionales,
      ubicacion: values.ubicacion,
      alcanceTrabajo: values.alcanceTrabajo,
      descripcion: values.descripcion,
      instagram: values.instagram,
      facebook: values.facebook,
      linkedin: values.linkedin,
      dni: values.dni,
      certificadosProfesionales: values.certificadosProfesionales.map(c => c.nombre),
      fotoPerfil: values.fotoPerfil ? values.fotoPerfil.name : '',
      fotosTrabajos: values.fotosTrabajos.map(f => f.name)
    };
    localStorage.setItem('registroCompleto', JSON.stringify(registroCompleto));
    console.log('Datos guardados en localStorage:', registroCompleto);
    
    // Validaciones
    if (values.password !== values.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar que la contraseña tenga al menos una mayúscula y un número
    const tieneMayuscula = /[A-Z]/.test(values.password);
    const tieneNumero = /[0-9]/.test(values.password);
    
    if (!tieneMayuscula || !tieneNumero) {
      alert('La contraseña debe contener al menos una mayúscula y un número');
      return;
    }

    if (values.especialidades.length === 0) {
      alert('Por favor seleccioná al menos una especialidad');
      return;
    }

    // Crear FormData para enviar archivos
    const formData = new FormData();
    
    // Datos personales
    formData.append('nombre', values.nombre);
    formData.append('apellido', values.apellido);
    formData.append('email', values.email);
    formData.append('telefono', values.telefono);
    formData.append('password', values.password);
    formData.append('profesion', values.profesion);
    formData.append('especialidades', JSON.stringify(values.especialidades));
    formData.append('profesionesAdicionales', JSON.stringify(values.profesionesAdicionales));
    formData.append('ubicacion', values.ubicacion);
    formData.append('alcanceTrabajo', values.alcanceTrabajo);
    formData.append('descripcion', values.descripcion);
    formData.append('dni', values.dni);
    
    // Redes sociales
    if (values.instagram) formData.append('instagram', values.instagram);
    if (values.facebook) formData.append('facebook', values.facebook);
    if (values.linkedin) formData.append('linkedin', values.linkedin);
    
    // Archivos
    if (values.fotoPerfil) {
      formData.append('fotoPerfil', values.fotoPerfil);
    }
    
    if (values.fotoDniFrente) {
      formData.append('fotoDniFrente', values.fotoDniFrente);
    }
    
    if (values.fotoDniDorso) {
      formData.append('fotoDniDorso', values.fotoDniDorso);
    }
    
    // Fotos de trabajos (múltiples)
    values.fotosTrabajos.forEach(foto => {
      formData.append('fotosTrabajos', foto);
    });
    
    // Certificados (múltiples)
    values.certificadosProfesionales.forEach(cert => {
      if (cert.archivo) {
        formData.append('certificados', cert.archivo);
      }
    });

    console.log('Enviando registro al backend...');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/providers/register`, {
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
      {/* Header con degradado - Responsive */}
      <header 
        className="w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
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
          className="hover:bg-white/20 rounded-full transition-colors p-2"
          style={{ cursor: 'pointer' }}
        >
          <svg width="32" height="32" fill="none" stroke={colors.neutral.black} strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </header>

      {/* Main Content - Responsive */}
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Título del paso actual - Responsive */}
          <h2 
            className="text-center text-3xl sm:text-4xl mb-6 sm:mb-8"
            style={{ 
              fontFamily: typography.fontFamily.primary, 
              fontWeight: typography.fontWeight.normal, 
              color: colors.primary.main
            }}
          >
            {paso === 1 && 'Datos Personales'}
            {paso === 2 && 'Datos Profesionales'}
            {paso === 3 && 'Documentación'}
            {paso === 4 && 'Extras'}
          </h2>

          {/* Indicador de pasos - Responsive */}
          <div className="flex justify-center mb-8 sm:mb-12 gap-2 sm:gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors text-base sm:text-xl ${
                  paso >= num ? 'text-white' : 'bg-gray-300 text-gray-500'
                }`}
                style={{ 
                  fontFamily: typography.fontFamily.primary, 
                  fontWeight: typography.fontWeight.semibold,
                  backgroundColor: paso >= num ? colors.primary.main : undefined
                }}
              >
                {num}
              </div>
            ))}
          </div>

          {/* Botón Demo (solo para desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={() => {
                  setFieldValue('nombre', 'Juan');
                  setFieldValue('apellido', 'Perez');
                  setFieldValue('email', 'juan.perez' + Date.now() + '@test.com'); // Email único
                  setFieldValue('telefono', '+54 11 1234 5678');
                  setFieldValue('password', 'Password123');
                  setFieldValue('confirmarPassword', 'Password123');
                  setFieldValue('profesion', 'Plomeros');
                  setFieldValue('especialidades', ['Instalación', 'Reparación']);
                  setFieldValue('ubicacion', 'Buenos Aires, Buenos Aires');
                  setFieldValue('alcanceTrabajo', '25');
                  setFieldValue('descripcion', 'Plomero profesional con 10 años de experiencia');
                  setFieldValue('dni', '12345678');
                  setFieldValue('instagram', '@juanplomero');
                  setFieldValue('facebook', 'juanplomero');
                  setFieldValue('linkedin', 'juan-perez');
                  alert('✅ Formulario autocompletado! Ahora puedes avanzar los pasos.');
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 text-sm"
              >
                🚀 Autocompletar (Demo)
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* PASO 1: Datos Básicos */}
            {paso === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <Input
                  label="Nombre *"
                  placeholder="JOSE"
                  value={values.nombre}
                  onChange={(value) => setFieldValue('nombre', capitalizeName(value))}
                  required
                  className="px-4 py-2.5 sm:py-3 text-sm sm:text-base"
                />

                <Input
                  label="Apellido *"
                  placeholder="PEREZ"
                  value={values.apellido}
                  onChange={(value) => setFieldValue('apellido', capitalizeName(value))}
                  required
                  className="px-4 py-2.5 sm:py-3 text-sm sm:text-base"
                />

                <Input
                  label="Email *"
                  type="email"
                  placeholder="algo@algo.com"
                  value={values.email}
                  onChange={(value) => setFieldValue('email', value)}
                  required
                  className="px-4 py-2.5 sm:py-3 text-sm sm:text-base"
                />

                <div>
                  <Input
                    label="Telefono laboral *"
                    type="tel"
                    placeholder="+54 1234 34 54"
                    value={values.telefono}
                    onChange={(value) => setFieldValue('telefono', value)}
                    required
                    className="px-4 py-2.5 sm:py-3 text-sm sm:text-base"
                  />
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 flex items-start gap-1" style={{ fontFamily: typography.fontFamily.primary }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Tu número de teléfono no será compartido con nadie hasta que seas contactado por un cliente</span>
                  </p>
                </div>

                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                    Contraseña *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={(e) => setFieldValue('password', e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-300 focus:outline-none"
                    style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, borderColor: colors.primary.main }}
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
                  <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: typography.fontFamily.primary }}>
                    Mínimo 6 dígitos. Debe contener al menos una mayúscula y un número
                  </p>
                </div>

                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                    Repetir Contraseña *
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmarPassword}
                    onChange={(e) => setFieldValue('confirmarPassword', e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-300 focus:outline-none"
                    style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, borderColor: colors.primary.main }}
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
                  <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                    Profesión / Oficio principal *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={values.profesion}
                      onClick={() => setMostrarProfesiones(true)}
                      readOnly
                      required
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none cursor-pointer"
                      style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}
                      placeholder="Seleccionar profesión"
                    />
                    {mostrarProfesiones && (
                      <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                        {servicios.map((servicio) => (
                          <div
                            key={servicio}
                            onClick={() => {
                              setFieldValue('profesion', servicio);
                              setFieldValue('especialidades', []); // Resetear especialidades
                              setMostrarProfesiones(false);
                            }}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                            style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}
                          >
                            {servicio}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Especialidades de la profesión principal */}
                {values.profesion && (
                  <div>
                    <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                      Especialidades *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getEspecialidades(values.profesion).map((esp) => (
                        <button
                          key={esp}
                          type="button"
                          onClick={() => toggleEspecialidad(esp)}
                          className={`px-4 py-2 rounded-full border-2 transition-colors ${
                            values.especialidades.includes(esp)
                              ? 'bg-[#244C87] text-white border-[#244C87]'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-[#244C87]'
                          }`}
                          style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }}
                        >
                          {esp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Profesiones adicionales */}
                {values.profesionesAdicionales.map((profAdic, index) => (
                  <div key={index} className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="relative">
                      <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                        Otra Profesión / Oficio
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={profAdic.profesion}
                          onClick={() => setProfesionAdicionalAbierta(index)}
                          readOnly
                          className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none cursor-pointer"
                          style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}
                          placeholder="Seleccionar profesión"
                        />
                        {profesionAdicionalAbierta === index && (
                          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                            {servicios
                              .filter(servicio => {
                                // Filtrar la profesión principal
                                if (servicio === values.profesion) return false;
                                // Filtrar las profesiones ya agregadas
                                return !values.profesionesAdicionales.some(p => p.profesion === servicio);
                              })
                              .map((servicio) => (
                              <div
                                key={servicio}
                                onClick={() => {
                                  actualizarProfesionAdicional(index, servicio);
                                  setProfesionAdicionalAbierta(null);
                                }}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                                style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}
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
                        <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
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
                              style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }}
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
                  style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, fontWeight: 600 }}
                >
                  + Agregar otra profesión
                </button>

                {/* Ubicación con autocompletado */}
                <div className="relative">
                  <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    value={values.ubicacion}
                    onChange={(e) => handleUbicacionChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}
                    placeholder="Empezá a escribir tu ciudad..."
                  />
                  {mostrarUbicaciones && ubicacionesFiltradas.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                      {ubicacionesFiltradas.map((ciudad, idx) => (
                        <div
                          key={idx}
                          onClick={() => seleccionarUbicacion(ciudad)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                          style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}
                        >
                          {ciudad}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Alcance del trabajo */}
                <Input
                  label="Alcance del trabajo"
                  type="number"
                  placeholder="Ejemplo: 10"
                  value={values.alcanceTrabajo}
                  onChange={(value) => setFieldValue('alcanceTrabajo', value)}
                />
                  <p className="mt-2 text-xs text-gray-600" style={{ fontFamily: typography.fontFamily.primary }}>
                    ¿Hasta cuántos km estarías dispuesto/a a moverte para trabajar desde {values.ubicacion || 'tu ubicación'}?
                  </p>
              </div>
            )}

            {/* PASO 3: Documentación */}
            {paso === 3 && (
              <div className="space-y-6">
                {/* DNI* */}
                <Input
                  label="DNI*"
                  placeholder="DNI"
                  value={values.dni}
                  onChange={(value) => setFieldValue('dni', value)}
                  required
                />

                {/* Fotos del DNI (frente y dorso) */}
                <div>
                  <label className="block mb-4" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                    Fotos del DNI <span style={{ color: colors.neutral[400] }}>(frente y dorso)</span>
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
                      <p className="mt-4" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[400] }}>
                        Arrastrá tu foto o hacé click para subirlo
                      </p>
                      {(values.fotoDniFrente || values.fotoDniDorso) && (
                        <p className="mt-2 text-sm text-green-600" style={{ fontFamily: typography.fontFamily.primary }}>
                          {values.fotoDniFrente?.name} {values.fotoDniDorso && `y ${values.fotoDniDorso.name}`}
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
                        setFieldValue('fotoDniFrente', files[0] || null);
                        setFieldValue('fotoDniDorso', files[1] || null);
                      }
                    }}
                    multiple
                    className="hidden"
                  />
                </div>

                {/* Certificado Profesional */}
                {values.certificadosProfesionales.map((cert, idx) => (
                  <div key={idx} className="space-y-4">
                    <Input
                      label="Certificado Profesional"
                      placeholder="Nombre del curso/formación"
                      value={cert.nombre}
                      onChange={(value) => actualizarNombreCertificado(idx, value)}
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
                        <p className="mt-4" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[400] }}>
                          Arrastrá tu certificado o hacé click para subirlo
                        </p>
                        {cert.archivo && (
                          <p className="mt-2 text-sm text-green-600" style={{ fontFamily: typography.fontFamily.primary }}>
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
                  style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, fontWeight: 600 }}
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
                  <label className="block mb-4" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
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
                      <p className="mt-4" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[400] }}>
                        Arrastrá tu foto o hacé click para subirlo
                      </p>
                      {values.fotoPerfil && (
                        <p className="mt-2 text-sm text-green-600" style={{ fontFamily: typography.fontFamily.primary }}>
                          {values.fotoPerfil.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <input
                    id="file-perfil"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue('fotoPerfil', e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>

                {/* Descripción de tu servicio */}
                <div>
                  <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                    Descripción de tu servicio
                  </label>
                  <textarea
                    value={values.descripcion}
                    onChange={(e) => setFieldValue('descripcion', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-3xl border-2 border-gray-300 focus:border-[#244C87] focus:outline-none resize-none"
                    style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}
                    placeholder=""
                  />
                </div>

                {/* Fotos de tu trabajo */}
                <div>
                  <label className="block mb-4" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                    Fotos de tu trabajo <span style={{ color: colors.neutral[400] }}>(máximo 5 fotos)</span>
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
                      <p className="mt-4" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[400] }}>
                        Arrastrá tu foto o hacé click para subirlo
                      </p>
                      {values.fotosTrabajos.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-green-600" style={{ fontFamily: typography.fontFamily.primary }}>
                            {values.fotosTrabajos.length} foto{values.fotosTrabajos.length > 1 ? 's' : ''} seleccionada{values.fotosTrabajos.length > 1 ? 's' : ''} (de 5)
                          </p>
                          <div className="mt-2 space-y-1">
                            {values.fotosTrabajos.map((foto, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded" style={{ fontFamily: typography.fontFamily.primary }}>
                                <span className="text-xs text-gray-600 truncate flex-1">• {foto.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFieldValue('fotosTrabajos', values.fotosTrabajos.filter((_, i) => i !== idx));
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {values.fotosTrabajos.length >= 5 && (
                        <p className="mt-2 text-sm text-orange-600" style={{ fontFamily: typography.fontFamily.primary }}>
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
                      const newFiles = Array.from(e.target.files || []);
                      const currentTotal = values.fotosTrabajos.length;
                      const availableSlots = 5 - currentTotal;
                      
                      if (newFiles.length > availableSlots) {
                        alert(`Solo podés agregar ${availableSlots} foto${availableSlots !== 1 ? 's' : ''} más (máximo 5 fotos en total)`);
                        setFieldValue('fotosTrabajos', [...values.fotosTrabajos, ...newFiles.slice(0, availableSlots)]);
                      } else {
                        setFieldValue('fotosTrabajos', [...values.fotosTrabajos, ...newFiles]);
                      }
                      
                      // Resetear el input para permitir seleccionar el mismo archivo nuevamente
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block mb-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={values.instagram}
                    onChange={(e) => setFieldValue('instagram', e.target.value)}
                    placeholder="insertá nombre de usuario"
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}
                  />
                </div>

                {/* Facebook */}
                <Input
                  label="Facebook"
                  placeholder="insertá nombre de usuario"
                  value={values.facebook}
                  onChange={(value) => setFieldValue('facebook', value)}
                />

                {/* LinkedIn */}
                <Input
                  label="Linkedin"
                  placeholder="insertá URL del perfil"
                  value={values.linkedin}
                  onChange={(value) => setFieldValue('linkedin', value)}
                />
              </div>
            )}

            {/* Botones de navegación - Responsive */}
            <div className="flex justify-end pt-6 sm:pt-8">
              {paso < 4 ? (
                <button
                  type="button"
                  onClick={handleSiguiente}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#244C87] text-white hover:bg-[#1a3a6b] transition-colors cursor-pointer text-base sm:text-lg"
                  style={{ fontFamily: typography.fontFamily.primary }}
                >
                  {paso === 1 ? 'Guardar y seguir' : 'Siguiente'}
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#244C87] text-white hover:bg-[#1a3a6b] transition-colors cursor-pointer text-base sm:text-lg"
                  style={{ fontFamily: typography.fontFamily.primary }}
                >
                  Finalizar registro
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {/* Modal de verificación de email */}
      {mostrarModalEmail && paso === 1 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center">
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: typography.fontFamily.primary, color: colors.primary.main }}>
              ¡Revisá tu email!
            </h2>
            <p className="mb-6" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black }}>
              Te enviamos un correo a <strong>{values.email}</strong> con un enlace para verificar tu cuenta y seguir completando tu perfil.
            </p>
            <p className="mb-6 text-sm text-gray-600" style={{ fontFamily: typography.fontFamily.primary }}>
              Si no ves el correo, revisá tu carpeta de spam.
            </p>
            <button
              onClick={() => {
                setMostrarModalEmail(false);
                // Avanzar al paso 2 para continuar con el registro
                setPaso(2);
              }}
              className="px-8 py-3 rounded-full bg-[#244C87] text-white hover:bg-[#1a3a6b] transition-colors"
              style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base }}
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
