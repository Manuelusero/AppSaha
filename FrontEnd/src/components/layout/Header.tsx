'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';
import { colors, gradients, spacing, borderRadius, shadows, withOpacity } from '@/styles/tokens';
import { apiGet, getProfileImageUrl } from '@/utils';

interface HeaderProps {
  variant?: 'landing' | 'minimal';
  showAuthButton?: boolean;
  onLoginClick?: () => void;
}

interface ProviderData {
  id: string;
  nombre: string;
  profileImage: string;
}

export default function Header({ 
  variant = 'landing', 
  showAuthButton = true,
  onLoginClick 
}: HeaderProps) {
  const router = useRouter();
  const { user, providerId, isAuthenticated, logout: authLogout } = useAuth();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Verificar si hay un proveedor logueado y cargar sus datos
  useEffect(() => {
    if (providerId) {
      // Cargar datos del proveedor
      const fetchProviderData = async () => {
        try {
          const data = await apiGet<any>(`/providers/${providerId}`);
          setProviderData({
            id: providerId,
            nombre: data.name || 'Proveedor',
            profileImage: getProfileImageUrl(data.providerProfile?.profilePhoto)
          });
        } catch (error) {
          console.error('Error loading provider data:', error);
        }
      };

      fetchProviderData();
    } else {
      setProviderData(null);
    }
  }, [providerId]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-menu-container')) {
          setShowProfileMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = () => {
    authLogout();
    setProviderData(null);
    setShowProfileMenu(false);
  };

  return (
    <header 
      className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
      style={{ 
        background: gradients.hero,
        minHeight: '80px',
        height: 'auto'
      }}
    >
      {/* Logo */}
      <div 
        className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
        onClick={() => router.push('/')}
      >
        <div style={{ 
          width: '100px', 
          height: '45px',
          background: 'url(/LOGO.svg) no-repeat center center',
          backgroundSize: 'contain',
          mixBlendMode: 'multiply',
          opacity: 1,
          borderRadius: borderRadius.xl,
          transform: 'rotate(0deg)'
        }} 
        className="sm:w-[145px] sm:h-[66px]"
        aria-label="Serco Logo"
        />
      </div>
      
      {/* Menú de usuario o botón de login */}
      {showAuthButton && (
        <>
          {isAuthenticated && providerData ? (
            <div className="relative profile-menu-container">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  padding: spacing[2],
                  backgroundColor: withOpacity(colors.primary.pale, 0.2),
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${withOpacity(colors.neutral.white, 0.3)}`,
                  borderRadius: borderRadius['2xl'],
                  boxShadow: shadows.md
                }}
              >
                {/* Foto de perfil */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/dashboard-provider');
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: borderRadius.full,
                    overflow: 'hidden',
                    border: `2px solid ${colors.primary.main}`,
                    cursor: 'pointer'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={providerData.profileImage}
                    alt={providerData.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                {/* Flecha hacia abajo */}
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={colors.primary.main}
                  strokeWidth="2"
                  style={{
                    transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>

              {/* Menú desplegable */}
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '60px',
                    right: '0',
                    backgroundColor: colors.neutral.white,
                    borderRadius: borderRadius.md,
                    boxShadow: shadows.lg,
                    overflow: 'hidden',
                    minWidth: '200px',
                    zIndex: 1000
                  }}
                >
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/dashboard-provider');
                    }}
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      textAlign: 'left',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
                      color: colors.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      transition: 'background-color 200ms ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.neutral[100]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Mi Perfil
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/dashboard-provider?tab=solicitudes');
                    }}
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      textAlign: 'left',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
                      color: colors.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      transition: 'background-color 200ms ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.neutral[100]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    Ver Solicitudes
                  </button>

                  <div style={{ height: '1px', backgroundColor: colors.neutral[200], margin: spacing[2] }}></div>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      textAlign: 'left',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
                      color: colors.error.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      transition: 'background-color 200ms ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.error.light}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick || (() => router.push('/login'))}
              className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap flex-shrink-0"
              style={{ 
                fontFamily: 'Maitree, serif',
                fontWeight: 400,
                fontStyle: 'normal',
                lineHeight: '100%',
                letterSpacing: '0%',
                height: 'auto',
                gap: spacing[2],
                opacity: 1,
                borderRadius: borderRadius.xl,
                backgroundColor: withOpacity(colors.primary.pale, 0.2),
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${withOpacity(colors.neutral.white, 0.3)}`,
                color: colors.neutral.black,
                cursor: 'pointer',
                transform: 'rotate(0deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Espacio del trabajador
            </button>
          )}
        </>
      )}
    </header>
  );
}
