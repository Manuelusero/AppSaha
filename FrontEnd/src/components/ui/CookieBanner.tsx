'use client';

import { useState } from 'react';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';
import { colors, typography, borderRadius } from '@/styles/tokens';

const textPrimary = colors.neutral[800];
const textSecondary = colors.neutral[500];
const textDisabled = colors.neutral[400];

// ============================================================================
// TOGGLE SWITCH
// ============================================================================

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        flexShrink: 0,
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        backgroundColor: checked ? colors.primary.main : textDisabled,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          transition: 'left 0.2s ease',
        }}
      />
    </div>
  );
}

// ============================================================================
// FILA DE CATEGORÍA
// ============================================================================

function CategoryRow({
  title,
  description,
  alwaysOn,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  alwaysOn?: boolean;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="border-t py-4" style={{ borderColor: colors.secondary.dark }}>
      <div className="flex items-center justify-between gap-3 mb-1">
        <span
          className="font-semibold text-base"
          style={{ color: textPrimary, fontFamily: typography.fontFamily.primary }}
        >
          {title}
        </span>
        {alwaysOn ? (
          <span
            className="text-xs px-3 py-0.5 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: colors.primary.pale,
              color: colors.primary.dark,
              fontFamily: typography.fontFamily.primary,
            }}
          >
            Siempre activas
          </span>
        ) : (
          <Toggle checked={checked ?? false} onChange={onChange ?? (() => {})} />
        )}
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{ color: textSecondary, fontFamily: typography.fontFamily.primary }}
      >
        {description}
      </p>
    </div>
  );
}

// ============================================================================
// MODAL DE PREFERENCIAS
// ============================================================================

interface PreferencesModalProps {
  onSave: (prefs: Omit<CookiePreferences, 'necessary'>) => void;
  onBack: () => void;
}

function PreferencesModal({ onSave, onBack }: PreferencesModalProps) {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div
        className="w-full sm:max-w-lg mx-auto overflow-y-auto rounded-t-[20px] sm:rounded-[20px]"
        style={{
          backgroundColor: colors.secondary.light,
          maxHeight: '85vh',
          padding: '28px 20px 32px',
          fontFamily: typography.fontFamily.primary,
          boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
        }}
      >
        <h2
          className="text-2xl font-semibold mb-2"
          style={{ color: colors.primary.main }}
        >
          Gestionar preferencias
        </h2>
        <p className="text-sm mb-2 leading-relaxed" style={{ color: textSecondary }}>
          Podés activar o desactivar cada categoría. Las cookies necesarias siempre están activas.
        </p>

        <CategoryRow
          title="Necesarias"
          description="Permiten funciones esenciales como inicio de sesión, seguridad y preferencias básicas. Sin estas cookies el sitio no funciona."
          alwaysOn
        />
        <CategoryRow
          title="Analíticas"
          description="Nos ayudan a entender cómo usás el sitio para mejorar la experiencia. Los datos son anónimos."
          checked={analytics}
          onChange={setAnalytics}
        />
        <CategoryRow
          title="Marketing"
          description="Se usan para mostrarte publicidad relevante dentro y fuera de SERCO, basada en tu actividad."
          checked={marketing}
          onChange={setMarketing}
        />

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => onSave({ analytics, marketing })}
            className="flex-1 py-3 px-6 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              borderRadius: borderRadius.full,
              backgroundColor: colors.primary.main,
              color: colors.secondary.light,
              fontFamily: typography.fontFamily.primary,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Guardar preferencias
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-3 px-6 text-sm font-medium transition-opacity hover:opacity-70"
            style={{
              borderRadius: borderRadius.full,
              backgroundColor: 'transparent',
              color: textSecondary,
              fontFamily: typography.fontFamily.primary,
              border: `1px solid ${colors.secondary.dark}`,
              cursor: 'pointer',
            }}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BANNER PRINCIPAL
// ============================================================================

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, saveCustom } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);

  if (!showBanner) return null;

  if (showPreferences) {
    return (
      <PreferencesModal
        onSave={(prefs) => saveCustom(prefs)}
        onBack={() => setShowPreferences(false)}
      />
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
    >
      <div
        className="w-full sm:max-w-2xl pointer-events-auto"
        style={{
          backgroundColor: colors.secondary.light,
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
          border: `1px solid ${colors.secondary.dark}`,
          fontFamily: typography.fontFamily.primary,
        }}
      >
        {/* Encabezado */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl leading-none mt-0.5 flex-shrink-0">🍪</span>
          <div>
            <h2
              className="text-base font-semibold mb-1"
              style={{ color: colors.primary.main }}
            >
              Usamos cookies
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
              Usamos cookies para mejorar tu experiencia y mostrarte contenido relevante.{' '}
              <a
                href="/privacidad"
                className="underline"
                style={{ color: colors.primary.main }}
              >
                Política de privacidad
              </a>
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <button
            onClick={() => setShowPreferences(true)}
            className="w-full sm:w-auto py-2.5 px-4 text-sm font-medium transition-opacity hover:opacity-70"
            style={{
              borderRadius: borderRadius.full,
              backgroundColor: 'transparent',
              color: textSecondary,
              fontFamily: typography.fontFamily.primary,
              border: `1px solid ${colors.secondary.dark}`,
              cursor: 'pointer',
            }}
          >
            Gestionar preferencias
          </button>
          <button
            onClick={rejectAll}
            className="w-full sm:w-auto py-2.5 px-4 text-sm font-medium transition-opacity hover:opacity-70"
            style={{
              borderRadius: borderRadius.full,
              backgroundColor: 'transparent',
              color: textPrimary,
              fontFamily: typography.fontFamily.primary,
              border: `1px solid ${textDisabled}`,
              cursor: 'pointer',
            }}
          >
            Rechazar no esenciales
          </button>
          <button
            onClick={acceptAll}
            className="w-full sm:w-auto py-2.5 px-4 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              borderRadius: borderRadius.full,
              backgroundColor: colors.primary.main,
              color: colors.secondary.light,
              fontFamily: typography.fontFamily.primary,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}
