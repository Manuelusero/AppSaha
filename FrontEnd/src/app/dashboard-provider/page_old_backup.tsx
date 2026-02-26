'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors, typography } from '@/styles/tokens';
import { apiGet, getProfileImageUrl, getPortfolioImageUrl, PROVIDER_ID_KEY } from '@/utils';

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

        setProviderData({
          id: parseInt(providerId),
          nombre: data.name?.split(' ')[0] || '',
          apellido: data.name?.split(' ').slice(1).join(' ') || '',
          email: data.email || '',
          telefono: data.phone || '',
          ubicacion: profile.location || '',
          serviceCategory: profile.serviceCategory || '',
          specialties: specialties,
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Fixed */}
      <header 
        className="fixed top-0 left-0 right-0 w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between z-50"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
        }}
      >
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
          {/* Botón Editar Perfil */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => {
                // TODO: Implementar edición de perfil
                alert('Función de editar perfil en desarrollo');
              }}
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
              {providerData.profileImage ? (
                <Image
                  src={providerData.profileImage}
                  alt="Foto de perfil"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
              )}
            </div>

            {/* Información del perfil */}
            <div className="p-6 text-center">
              <h1 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '32px',
                fontWeight: 600,
                color: '#244C87',
                marginBottom: '8px'
              }}>
                {providerData.nombre} {providerData.apellido}
              </h1>
              
              <p style={{
                fontFamily: 'Maitree, serif',
                fontSize: '18px',
                fontWeight: 400,
                color: colors.neutral.black,
                marginBottom: '4px'
              }}>
                {providerData.serviceCategory}
              </p>

              <div className="flex items-center justify-center gap-2 text-gray-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3" fill="white"/>
                </svg>
                <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }}>
                  {providerData.ubicacion}
                </span>
              </div>
            </div>
          </div>

          {/* Experiencia profesional */}
          {providerData.experiencia > 0 && (
            <div className="mb-6">
              <p style={{
                fontFamily: 'Maitree, serif',
                fontSize: '18px',
                fontWeight: 600,
                color: colors.neutral.black
              }}>
                Experiencia profesional: {providerData.experiencia} años
              </p>
            </div>
          )}

          {/* Servicios ofrecidos */}
          {providerData.specialties && providerData.specialties.length > 0 && (
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
                {providerData.specialties.map((specialty, idx) => (
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
                ))}
              </div>
            </div>
          )}

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
              {providerData.ubicacion ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Círculo que representa el radio de alcance */}
                  <div 
                    className="border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center"
                    style={{ 
                      width: `${Math.min(providerData.alcanceTrabajo ? parseInt(providerData.alcanceTrabajo) * 6 : 100, 200)}px`,
                      height: `${Math.min(providerData.alcanceTrabajo ? parseInt(providerData.alcanceTrabajo) * 6 : 100, 200)}px`,
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
                    Radio: {providerData.alcanceTrabajo || '0'} km
                  </div>
                </div>
              ) : (
                <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: '#999999' }}>
                  No especificado
                </p>
              )}
            </div>
          </div>

          {/* Galería */}
          {providerData.portfolioImages && providerData.portfolioImages.length > 0 && (
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
                {providerData.portfolioImages.map((img, idx) => (
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {providerData.descripcion && (
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
              <p style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: colors.neutral.black,
                lineHeight: '1.6'
              }}>
                {providerData.descripcion}
              </p>
            </div>
          )}

          {/* Referencias */}
          {(providerData.referenciaNombre || providerData.referenciaEmail || providerData.referenciaTelefono) && (
            <div className="mb-6">
              <h2 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '20px',
                fontWeight: 600,
                color: colors.neutral.black,
                marginBottom: '8px'
              }}>
                Referencias
              </h2>
              
              <ul className="list-disc list-inside space-y-2">
                {providerData.referenciaNombre && (
                  <li style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black
                  }}>
                    {providerData.referenciaNombre}
                    {providerData.referenciaEmail && (
                      <ul className="list-none ml-6">
                        <li style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                          {providerData.referenciaEmail}
                        </li>
                      </ul>
                    )}
                    {providerData.referenciaTelefono && (
                      <ul className="list-none ml-6">
                        <li style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                          {providerData.referenciaTelefono}
                        </li>
                      </ul>
                    )}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
