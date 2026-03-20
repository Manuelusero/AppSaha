'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors, typography } from '@/styles/tokens';
import { apiGet, getProfileImageUrl, PROVIDER_ID_KEY } from '@/utils';

interface ProviderHeaderProps {
  /** Callback personalizado para la flecha atrás. Por defecto: router.back() */
  onBack?: () => void;
  /** Página activa para resaltar en el menú */
  activePage?: 'perfil' | 'solicitudes' | 'recomendaciones';
}

interface ProviderData {
  nombre: string;
  profileImage: string;
}

export default function ProviderHeader({ onBack, activePage }: ProviderHeaderProps) {
  const router = useRouter();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    if (!providerId) return;

    apiGet<any>(`/providers/${providerId}`)
      .then(data => {
        setProviderData({
          nombre: data.name?.split(' ')[0] || 'Proveedor',
          profileImage: getProfileImageUrl(data.providerProfile?.profilePhoto),
        });
      })
      .catch(() => {
        // Fallback a registroCompleto si la API falla
        const registroCompleto = localStorage.getItem('registroCompleto');
        if (registroCompleto) {
          try {
            const d = JSON.parse(registroCompleto);
            setProviderData({ nombre: d.nombre || 'Proveedor', profileImage: '' });
          } catch { /* noop */ }
        }
      });
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const avatarContent = providerData?.profileImage &&
    providerData.profileImage.trim() &&
    !providerData.profileImage.includes('placeholder') ? (
    <Image
      src={providerData.profileImage}
      alt="Perfil"
      width={40}
      height={40}
      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
    />
  ) : (
    <span style={{
      fontFamily: typography.fontFamily.primary,
      fontSize: '18px',
      fontWeight: 600,
      color: colors.neutral.black,
    }}>
      {providerData?.nombre?.charAt(0).toUpperCase() ?? '?'}
    </span>
  );

  const menuAvatarContent = providerData?.profileImage &&
    providerData.profileImage.trim() &&
    !providerData.profileImage.includes('placeholder') ? (
    <Image
      src={providerData.profileImage}
      alt="Perfil"
      width={48}
      height={48}
      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
    />
  ) : (
    <span style={{
      fontFamily: typography.fontFamily.primary,
      fontSize: '20px',
      fontWeight: 600,
      color: colors.neutral.black,
    }}>
      {providerData?.nombre?.charAt(0).toUpperCase() ?? '?'}
    </span>
  );

  const menuItemStyle = (page?: 'perfil' | 'solicitudes' | 'recomendaciones') => ({
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    color: colors.neutral.black,
    cursor: 'pointer',
    backgroundColor: activePage === page ? '#F3F4F6' : 'transparent',
  });

  return (
    <>
      {/* Header fixed */}
      <header
        className="fixed top-0 left-0 right-0 w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
        }}
      >
        {/* Flecha atrás */}
        <button
          onClick={handleBack}
          className="hover:bg-white/20 rounded-full transition-colors p-2"
          style={{ cursor: 'pointer' }}
        >
          <svg width="32" height="32" fill="none" stroke={colors.neutral.black} strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Botón de perfil */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 hover:bg-white/20 rounded-full transition-colors p-2"
          style={{ cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #000000',
          }}>
            {avatarContent}
          </div>
        </button>
      </header>

      {/* Menú desplegable */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="fixed right-4 sm:right-6 bg-white rounded-3xl shadow-2xl z-50"
            style={{
              top: 'calc(6rem + 16px)',
              width: '280px',
              border: '2px solid #000000',
            }}
          >
            <div className="p-6">
              {/* Saludo con foto */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-gray-200">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #000000',
                }}>
                  {menuAvatarContent}
                </div>
                <p style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.lg,
                  fontWeight: 600,
                  color: colors.neutral.black,
                }}>
                  Hola, {providerData?.nombre ?? ''}!
                </p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => { setShowMenu(false); router.push('/dashboard-provider'); }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={menuItemStyle('perfil')}
                >
                  Mi Perfil
                </button>

                <button
                  onClick={() => { setShowMenu(false); router.push('/solicitudes-trabajo'); }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={menuItemStyle('solicitudes')}
                >
                  Solicitudes
                </button>

                <button
                  onClick={() => { setShowMenu(false); /* TODO: navegar a recomendaciones */ }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={menuItemStyle('recomendaciones')}
                >
                  Recomendaciones
                </button>

                <button
                  onClick={() => { setShowMenu(false); setShowLogoutModal(true); }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
                  style={menuItemStyle()}
                >
                  <span>Cerrar Sesión</span>
                  <svg width="20" height="20" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmación de logout */}
      {showLogoutModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowLogoutModal(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl p-8 mx-4"
              style={{ maxWidth: '400px', width: '100%', backgroundColor: '#FFF8F0' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowLogoutModal(false)} style={{ cursor: 'pointer' }}>
                  <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h2 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '24px',
                fontWeight: 600,
                color: '#B45B39',
                textAlign: 'center',
                marginBottom: '32px',
              }}>
                ¿Seguro que deseas continuar?
              </h2>

              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-full hover:opacity-90 transition-opacity"
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: '#FFFFFF',
                    backgroundColor: '#B45B39',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  Si, Cerrar sesión
                </button>

                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-3 rounded-full hover:opacity-90 transition-opacity"
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: '#FFFFFF',
                    backgroundColor: '#B45B39',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  No, volver a mi perfil
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
