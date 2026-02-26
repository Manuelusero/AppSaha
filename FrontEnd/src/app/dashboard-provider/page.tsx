'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors, typography } from '@/styles/tokens';
import { apiGet, getProfileImageUrl, getPortfolioImageUrl, PROVIDER_ID_KEY } from '@/utils';
import { getEspecialidades } from '../data/especialidades';

interface ProviderData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ubicacion: string;
  serviceCategory: string;
  specialties: string[];
  descripcion: string;
  experiencia: number;
  alcanceTrabajo: string;
  profileImage?: string;
  portfolioImages?: string[];
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  referenciaNombre?: string;
  referenciaEmail?: string;
  referenciaTelefono?: string;
}

export default function DashboardProvider() {
  const router = useRouter();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<ProviderData | null>(null);

  // Cargar datos del proveedor
  useEffect(() => {
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    
    if (!providerId) {
      router.push('/login');
      return;
    }

    // Cargar datos del proveedor desde la API
    apiGet<any>(`/providers/${providerId}`)
      .then(data => {
        const profile = data.providerProfile;
        if (!profile) {
          console.error('No se encontró providerProfile');
          return;
        }

        // Parsear especialidades
        let specialties = [];
        try {
          specialties = typeof profile.specialties === 'string' 
            ? JSON.parse(profile.specialties) 
            : profile.specialties || [];
        } catch {
          specialties = [];
        }

        // Parsear fotos de trabajos
        let portfolioImages = [];
        try {
          portfolioImages = typeof profile.portfolioImages === 'string'
            ? JSON.parse(profile.portfolioImages)
            : profile.portfolioImages || [];
        } catch {
          portfolioImages = [];
        }

        const profileImageUrl = getProfileImageUrl(profile.profilePhoto);

        // Limpiar especialidades obsoletas (nombres cortos sin contexto)
        const especialidadesDisponibles = getEspecialidades(profile.serviceCategory || '');
        const especialidadesValidas = specialties.filter((s: string) => 
          especialidadesDisponibles.includes(s)
        );

        setProviderData({
          id: parseInt(providerId),
          nombre: data.name?.split(' ')[0] || '',
          apellido: data.name?.split(' ').slice(1).join(' ') || '',
          email: data.email || '',
          telefono: data.phone || '',
          ubicacion: profile.location || '',
          serviceCategory: profile.serviceCategory || '',
          specialties: especialidadesValidas,
          descripcion: profile.bio || profile.serviceDescription || '',
          experiencia: profile.experience || 0,
          alcanceTrabajo: profile.serviceRadius?.toString() || '',
          profileImage: profileImageUrl,
          portfolioImages: portfolioImages.map((img: string) => 
            getPortfolioImageUrl(img)
          ),
          instagram: profile.instagram || '',
          facebook: profile.facebook || '',
          linkedin: profile.linkedin || '',
          referenciaNombre: '', // TODO: Agregar al schema si es necesario
          referenciaEmail: '',
          referenciaTelefono: ''
        });
      })
      .catch(err => {
        console.error('Error cargando proveedor:', err);
        
        // Fallback a localStorage
        const registroCompleto = localStorage.getItem('registroCompleto');
        if (registroCompleto) {
          try {
            const datosRegistro = JSON.parse(registroCompleto);
            
            setProviderData({
              id: parseInt(providerId),
              nombre: datosRegistro.nombre || '',
              apellido: datosRegistro.apellido || '',
              email: datosRegistro.email || '',
              telefono: datosRegistro.telefono || '',
              ubicacion: datosRegistro.ubicacion || '',
              serviceCategory: datosRegistro.profesion || '',
              specialties: datosRegistro.especialidades || [],
              descripcion: datosRegistro.descripcion || '',
              experiencia: datosRegistro.experiencia || 0,
              alcanceTrabajo: datosRegistro.alcanceTrabajo || '',
              profileImage: '',
              portfolioImages: [],
              instagram: datosRegistro.instagram || '',
              facebook: datosRegistro.facebook || '',
              linkedin: datosRegistro.linkedin || '',
              referenciaNombre: datosRegistro.referenciaNombre || '',
              referenciaEmail: datosRegistro.referenciaEmail || '',
              referenciaTelefono: datosRegistro.referenciaTelefono || ''
            });
          } catch (error) {
            console.error('Error parseando datos del registro:', error);
          }
        }
      });
  }, [router]);

  if (!providerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.lg }}>Cargando...</p>
      </div>
    );
  }

  const handleEditClick = () => {
    console.log('=== ENTRANDO EN MODO EDICIÓN ===');
    console.log('providerData:', providerData);
    
    // Limpiar especialidades que no coincidan con las disponibles
    const especialidadesDisponibles = getEspecialidades(providerData.serviceCategory);
    const especialidadesValidas = providerData.specialties?.filter(s => 
      especialidadesDisponibles.includes(s)
    ) || [];
    
    setEditMode(true);
    setEditedData({ 
      ...providerData,
      specialties: especialidadesValidas
    });
    console.log('editMode activado');
    console.log('Especialidades limpiadas:', especialidadesValidas);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedData(null);
  };

  const handleSaveEdit = async () => {
    if (!editedData) return;
    
    try {
      // TODO: Llamar a la API para guardar los cambios
      // await apiPut(`/providers/${editedData.id}`, editedData);
      
      setProviderData(editedData);
      setEditMode(false);
      setEditedData(null);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    }
  };

  const handleFieldChange = (field: keyof ProviderData, value: any) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const currentData = editMode ? editedData : providerData;
  if (!currentData) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Fixed */}
      <header 
        className="fixed top-0 left-0 right-0 w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between z-50"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
        }}
      >
        {/* Flecha atrás */}
        <button
          onClick={() => router.back()}
          className="hover:bg-white/20 rounded-full transition-colors p-2"
          style={{ cursor: 'pointer' }}
        >
          <svg width="32" height="32" fill="none" stroke={colors.neutral.black} strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Menú hamburguesa */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="hover:bg-white/20 rounded-full transition-colors p-2"
          style={{ cursor: 'pointer' }}
        >
          <svg width="32" height="32" fill="none" stroke={colors.neutral.black} strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </header>

      {/* Menú lateral desplegable */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div 
            className="fixed top-0 left-0 h-full bg-white shadow-lg z-50"
            style={{ width: '280px' }}
          >
            <div className="p-6">
              <button
                onClick={() => setShowMenu(false)}
                className="mb-6"
                style={{ cursor: 'pointer' }}
              >
                <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              
              <nav className="space-y-4">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push('/');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Inicio
                </button>
                
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push('/solicitudes-trabajo');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Solicitudes de trabajo
                </button>
                
                <button
                  onClick={() => {
                    localStorage.clear();
                    router.push('/login');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Contenido principal - con padding-top para compensar header fixed */}
      <main style={{ paddingTop: 'calc(6rem + 48px)', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="max-w-2xl mx-auto">
          {/* Botón Editar Perfil - Solo mostrar cuando NO está en modo edición */}
          {!editMode && (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleEditClick}
                className="px-6 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral.black,
                  border: '2px solid #000000',
                  cursor: 'pointer'
                }}
              >
                Editar Perfil
              </button>
            </div>
          )}

          {/* Card de perfil con imagen */}
          <div 
            className="rounded-3xl overflow-hidden mb-6"
            style={{ 
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {/* Imagen de fondo/header */}
            <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
              {currentData.profileImage ? (
                <Image
                  src={currentData.profileImage}
                  alt="Foto de perfil"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
              )}
              {editMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <button
                    onClick={() => alert('TODO: Implementar cambio de foto')}
                    className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.sm,
                      cursor: 'pointer'
                    }}
                  >
                    Cambiar foto
                  </button>
                </div>
              )}
            </div>

            {/* Información del perfil */}
            <div className="p-6 text-center">
              {editMode ? (
                <div className="space-y-4">
                  {/* Nombre completo no editable (se valida con DNI) */}
                  <h1 style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: '#244C87',
                    marginBottom: '8px'
                  }}>
                    {currentData.nombre} {currentData.apellido}
                  </h1>
                  
                  <input
                    type="text"
                    value={currentData.serviceCategory}
                    onChange={(e) => handleFieldChange('serviceCategory', e.target.value)}
                    placeholder="Profesión"
                    className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
                      color: colors.neutral.black
                    }}
                  />

                  <input
                    type="text"
                    value={currentData.ubicacion}
                    onChange={(e) => handleFieldChange('ubicacion', e.target.value)}
                    placeholder="Ubicación"
                    className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600]
                    }}
                  />
                </div>
              ) : (
                <>
                  <h1 style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: '#244C87',
                    marginBottom: '8px'
                  }}>
                    {currentData.nombre} {currentData.apellido}
                  </h1>
                  
                  <p style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: colors.neutral.black,
                    marginBottom: '4px'
                  }}>
                    {currentData.serviceCategory}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3" fill="white"/>
                    </svg>
                    <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }}>
                      {currentData.ubicacion}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Experiencia profesional */}
          {(currentData.experiencia > 0 || editMode) && (
            <div className="mb-6">
              {editMode ? (
                <div className="flex items-center gap-4">
                  <label style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: colors.neutral.black
                  }}>
                    Años de experiencia:
                  </label>
                  <input
                    type="number"
                    value={currentData.experiencia}
                    onChange={(e) => handleFieldChange('experiencia', parseInt(e.target.value) || 0)}
                    className="w-32 px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base
                    }}
                  />
                </div>
              ) : (
                <p style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: colors.neutral.black
                }}>
                  Experiencia profesional: {currentData.experiencia} años
                </p>
              )}
            </div>
          )}

          {/* Servicios ofrecidos */}
          <div className="mb-6">
            <h2 style={{
              fontFamily: 'Maitree, serif',
              fontSize: '20px',
              fontWeight: 600,
              color: colors.neutral.black,
              marginBottom: '12px'
            }}>
              Servicios ofrecidos:
            </h2>
            <div className="flex flex-wrap gap-2">
              {(() => {
                console.log('=== RENDERIZANDO SERVICIOS ===');
                console.log('editMode:', editMode);
                console.log('currentData:', currentData);
                
                if (editMode) {
                  // Modo edición: mostrar especialidades según la profesión
                  const especialidadesDisponibles = getEspecialidades(currentData.serviceCategory);
                  console.log('Especialidades disponibles:', especialidadesDisponibles);
                  console.log('Especialidades seleccionadas:', currentData.specialties);
                  
                  if (especialidadesDisponibles.length === 0) {
                    return (
                      <p style={{
                        fontFamily: typography.fontFamily.primary,
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[400]
                      }}>
                        No hay especialidades disponibles para esta profesión
                      </p>
                    );
                  }
                  return especialidadesDisponibles.map((specialty) => {
                    const isSelected = currentData.specialties?.includes(specialty);
                    console.log(`${specialty}: ${isSelected ? 'SELECCIONADO' : 'NO seleccionado'}`);
                    return (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => {
                          const current = currentData.specialties || [];
                          if (isSelected) {
                            handleFieldChange('specialties', current.filter(s => s !== specialty));
                          } else {
                            handleFieldChange('specialties', [...current, specialty]);
                          }
                        }}
                        className="px-4 py-2 rounded-full border-2 transition-colors"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.sm,
                          color: isSelected ? '#FFFFFF' : colors.neutral.black,
                          borderColor: isSelected ? '#244C87' : '#000000',
                          backgroundColor: isSelected ? '#244C87' : '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        {specialty}
                      </button>
                    );
                  });
                } else {
                  // Modo vista: mostrar solo los seleccionados
                  if (currentData.specialties && currentData.specialties.length > 0) {
                    return currentData.specialties.map((specialty, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 rounded-full border-2"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.sm,
                          color: colors.neutral.black,
                          borderColor: '#000000',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        {specialty}
                      </div>
                    ));
                  } else {
                    return (
                      <p style={{
                        fontFamily: typography.fontFamily.primary,
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[400]
                      }}>
                        No hay servicios seleccionados
                      </p>
                    );
                  }
                }
              })()}
            </div>
          </div>

          {/* Zona de Trabajo */}
          <div className="mb-6">
            <h2 style={{
              fontFamily: 'Maitree, serif',
              fontSize: '20px',
              fontWeight: 600,
              color: colors.neutral.black,
              marginBottom: '12px'
            }}>
              Zona de Trabajo:
            </h2>
            
            <div 
              className="w-full rounded-3xl border-2 border-gray-300 bg-gray-50 flex items-center justify-center relative overflow-hidden"
              style={{ height: '240px' }}
            >
              {currentData.ubicacion ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Círculo que representa el radio de alcance */}
                  <div 
                    className="border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center"
                    style={{ 
                      width: `${Math.min(currentData.alcanceTrabajo ? parseInt(currentData.alcanceTrabajo) * 6 : 100, 200)}px`,
                      height: `${Math.min(currentData.alcanceTrabajo ? parseInt(currentData.alcanceTrabajo) * 6 : 100, 200)}px`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Ícono de ubicación */}
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#244C87" stroke="#244C87" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3" fill="white"/>
                    </svg>
                  </div>
                  
                  {/* Etiqueta con el radio actual */}
                  <div 
                    className="absolute bottom-4 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200"
                    style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral.black }}
                  >
                    Radio: {currentData.alcanceTrabajo || '0'} km
                  </div>
                </div>
              ) : (
                <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: '#999999' }}>
                  No especificado
                </p>
              )}
            </div>
            
            {/* Slider para ajustar el radio en modo edición */}
            {editMode && currentData.ubicacion && (
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={currentData.alcanceTrabajo || 0}
                  onChange={(e) => handleFieldChange('alcanceTrabajo', e.target.value)}
                  className="w-full"
                  style={{
                    accentColor: '#244C87'
                  }}
                />
                <p className="mt-2 text-xs text-gray-600 text-center" style={{ fontFamily: typography.fontFamily.primary }}>
                  ¿Hasta dónde estarías dispuesto/a a moverte para trabajar desde {currentData.ubicacion}?
                </p>
              </div>
            )}
          </div>

          {/* Galería */}
          {((currentData.portfolioImages && currentData.portfolioImages.length > 0) || editMode) && (
            <div className="mb-6">
              <h2 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '20px',
                fontWeight: 600,
                color: colors.neutral.black,
                marginBottom: '12px'
              }}>
                Galeria
              </h2>
              
              <div 
                className="flex gap-4 overflow-x-auto pb-4"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#244C87 #E5E7EB'
                }}
              >
                {currentData.portfolioImages && currentData.portfolioImages.length > 0 ? (
                  currentData.portfolioImages.map((img, idx) => (
                    <div 
                      key={idx}
                      className="flex-shrink-0 rounded-2xl overflow-hidden"
                      style={{ width: '300px', height: '200px', position: 'relative' }}
                    >
                      <Image
                        src={img}
                        alt={`Trabajo ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      {editMode && (
                        <button
                          onClick={() => {
                            const newImages = currentData.portfolioImages?.filter((_, i) => i !== idx) || [];
                            handleFieldChange('portfolioImages', newImages);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  editMode && (
                    <p style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[400]
                    }}>
                      No hay fotos en la galería
                    </p>
                  )
                )}
                
                {/* Botón agregar foto en modo edición */}
                {editMode && (
                  <div 
                    className="flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#244C87] transition-colors cursor-pointer flex items-center justify-center"
                    style={{ width: '300px', height: '200px' }}
                    onClick={() => alert('TODO: Implementar subida de fotos')}
                  >
                    <div className="text-center">
                      <span style={{
                        fontSize: '48px',
                        color: '#244C87'
                      }}>+</span>
                      <p style={{
                        fontFamily: typography.fontFamily.primary,
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[600],
                        marginTop: '8px'
                      }}>
                        Agregar foto
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Descripción */}
          {(currentData.descripcion || editMode) && (
            <div className="mb-6">
              <h2 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '20px',
                fontWeight: 600,
                color: colors.neutral.black,
                marginBottom: '12px'
              }}>
                Descripción:
              </h2>
              {editMode ? (
                <textarea
                  value={currentData.descripcion}
                  onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                  placeholder="Describe tu experiencia y servicios..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-3xl border-2 border-gray-300 focus:border-[#244C87] focus:outline-none resize-none"
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    lineHeight: '1.6'
                  }}
                />
              ) : (
                <p style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral.black,
                  lineHeight: '1.6'
                }}>
                  {currentData.descripcion}
                </p>
              )}
            </div>
          )}

          {/* Referencias eliminadas por petición del usuario */}

          {/* Botones Cancelar/Guardar Cambios - Mostrar al final en modo edición */}
          {editMode && (
            <div className="flex justify-center gap-4 mt-8 mb-8">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral.black,
                  border: '2px solid #000000',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: '#FFFFFF',
                  backgroundColor: '#244C87',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Guardar Cambios
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
