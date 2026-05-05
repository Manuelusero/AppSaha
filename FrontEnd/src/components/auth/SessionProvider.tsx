'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Wrapper del SessionProvider de NextAuth
 * Debe envolver toda la aplicación para que useSession() funcione
 * 
 * IMPORTANTE: Este componente ya está incluido en el layout principal
 */
export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}
