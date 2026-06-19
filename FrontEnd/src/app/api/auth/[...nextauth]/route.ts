/**
 * NextAuth.js Configuration para SAHA Platform
 * 
 * OAuth Providers:
 * - Google (Login con cuenta de Google)
 * - Facebook (Login con cuenta de Facebook)  
 * - Apple (Login con cuenta de Apple)
 * 
 * También soporta:
 * - Credentials (Email + Password tradicional)
 * - JWT Sessions
 * - Prisma Database Adapter
 */

import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createHash } from 'crypto';

const getApiBaseUrl = (): string => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:8000';
  }

  throw new Error('Configuración faltante: NEXT_PUBLIC_API_URL no está definida en producción.');
};

const getNextAuthSecret = (): string => {
  const configuredSecret = process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-nextauth-secret';
  }

  const seed = process.env.NEXTAUTH_URL?.trim() || process.env.VERCEL_URL?.trim() || 'saha-nextauth-default';
  return createHash('sha256').update(seed).digest('hex');
};

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth — solo se habilita si las credenciales están configuradas
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              prompt: 'consent',
              access_type: 'offline',
              response_type: 'code'
            }
          }
        })]
      : []),

    // Facebook OAuth — solo se habilita si las credenciales están configuradas
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET &&
        process.env.FACEBOOK_CLIENT_ID !== 'your-facebook-app-id'
      ? [FacebookProvider({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        })]
      : []),

    // Apple OAuth — solo se habilita si las credenciales están configuradas
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET &&
        process.env.APPLE_CLIENT_ID !== 'com.yourdomain.services'
      ? [AppleProvider({
          clientId: process.env.APPLE_CLIENT_ID,
          clientSecret: process.env.APPLE_CLIENT_SECRET,
        })]
      : []),

    /**
     * CREDENTIALS (Email + Password)
     * Login tradicional con email y contraseña
     * Se valida contra la API de SAHA
     */
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'tu@email.com' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Llamar a la API de SAHA para validar credenciales
          const apiUrl = getApiBaseUrl();
          const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (data.success && data.token && data.user) {
            // Retornar usuario para NextAuth
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              image: data.user.avatar || null,
              accessToken: data.token
            };
          }

          return null;
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      }
    })
  ],

  /**
   * Callbacks para personalizar el comportamiento
   */
  callbacks: {
    /**
     * JWT Callback - Se ejecuta cuando se crea/actualiza el token
     * Aquí agregamos el rol del usuario al token y sincronizamos con backend
     */
    async jwt({ token, user, account }) {
      // En el primer login, user estará disponible
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }

      // Si es OAuth (Google, Facebook, Apple), sincronizar con nuestra DB
      if (account?.provider && account?.provider !== 'credentials' && token.email) {
        token.provider = account.provider;
        
        try {
          const apiUrl = getApiBaseUrl();
          
          // Llamar a nuestro backend para crear/obtener el usuario de OAuth
          const response = await fetch(`${apiUrl}/api/auth/oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: account.provider,
              providerId: account.providerAccountId,
              email: token.email,
              name: token.name || '',
              image: token.picture || ''
            })
          });

          if (response.ok) {
            const data = await response.json();
            
            // Actualizar token con datos del backend
            token.id = data.user.id;
            token.role = data.user.role;
            token.accessToken = data.token;
            token.isNewUser = data.isNewUser;
            
            console.log('✅ Usuario OAuth sincronizado con backend:', {
              email: data.user.email,
              role: data.user.role,
              isNew: data.isNewUser
            });
          } else {
            console.error('❌ Error al sincronizar usuario OAuth con backend');
          }
        } catch (error) {
          console.error('❌ Error en llamada a /api/auth/oauth:', error);
        }
      }

      return token;
    },

    /**
     * Session Callback - Se ejecuta cuando se accede a la sesión
     * Aquí pasamos el rol al objeto session para uso en cliente
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) as 'CLIENT' | 'PROVIDER' | 'ADMIN';
        session.user.accessToken = token.accessToken as string;
        session.user.provider = token.provider as string;
      }
      return session;
    }
  },

  /**
   * Páginas personalizadas
   */
  pages: {
    signIn: '/login',        // Página de login personalizada
    error: '/login',         // Página de error → redirect a login
    // newUser: '/welcome',  // Página para nuevos usuarios (opcional)
  },

  /**
   * Session configuration
   */
  session: {
    strategy: 'jwt',         // Usar JWT en lugar de database sessions
    maxAge: 7 * 24 * 60 * 60, // 7 días
  },

  /**
   * JWT configuration
   */
  jwt: {
    secret: getNextAuthSecret(),
    maxAge: 7 * 24 * 60 * 60, // 7 días
  },

  /**
   * Debug mode (solo en development)
   */
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

// Export handlers for App Router (Next.js 15)
export { handler as GET, handler as POST };
