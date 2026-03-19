'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TIPOS
// ============================================================================

export interface CookiePreferences {
  necessary: true;       // Siempre activas, no se pueden desactivar
  analytics: boolean;    // Google Analytics, métricas de uso
  marketing: boolean;    // Publicidad, redes sociales
}

export type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'custom';

export interface CookieConsentState {
  status: ConsentStatus;
  preferences: CookiePreferences;
  hasDecided: boolean;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const STORAGE_KEY = 'serco_cookie_consent';
const COOKIE_NAME = 'serco_consent';

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

// ============================================================================
// HELPERS
// ============================================================================

function saveToStorage(state: CookieConsentState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  // También seteamos una cookie HTTP-readable para SSR si fuera necesario
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${COOKIE_NAME}=${state.status}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function loadFromStorage(): CookieConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsentState;
  } catch {
    return null;
  }
}

// ============================================================================
// HOOK
// ============================================================================

export function useCookieConsent() {
  const [state, setState] = useState<CookieConsentState>({
    status: 'pending',
    preferences: DEFAULT_PREFERENCES,
    hasDecided: false,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar preferencias guardadas al montar
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setState(saved);
    }
    setIsLoaded(true);
  }, []);

  // Aceptar todas las cookies
  const acceptAll = useCallback(() => {
    const newState: CookieConsentState = {
      status: 'accepted',
      preferences: { necessary: true, analytics: true, marketing: true },
      hasDecided: true,
    };
    setState(newState);
    saveToStorage(newState);
  }, []);

  // Rechazar todas las no esenciales
  const rejectAll = useCallback(() => {
    const newState: CookieConsentState = {
      status: 'rejected',
      preferences: { necessary: true, analytics: false, marketing: false },
      hasDecided: true,
    };
    setState(newState);
    saveToStorage(newState);
  }, []);

  // Guardar preferencias personalizadas
  const saveCustom = useCallback((prefs: Omit<CookiePreferences, 'necessary'>) => {
    const newState: CookieConsentState = {
      status: 'custom',
      preferences: { necessary: true, ...prefs },
      hasDecided: true,
    };
    setState(newState);
    saveToStorage(newState);
  }, []);

  // Resetear (para que el banner vuelva a aparecer)
  const reset = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setState({ status: 'pending', preferences: DEFAULT_PREFERENCES, hasDecided: false });
  }, []);

  return {
    /** Estado completo del consentimiento */
    state,
    /** Si ya terminó de leer localStorage (evita flash en SSR) */
    isLoaded,
    /** El banner debe mostrarse si no decidió aún */
    showBanner: isLoaded && !state.hasDecided,
    /** Shortcuts de preferencias individuales */
    canUseAnalytics: state.preferences.analytics,
    canUseMarketing: state.preferences.marketing,
    /** Acciones */
    acceptAll,
    rejectAll,
    saveCustom,
    reset,
  };
}
