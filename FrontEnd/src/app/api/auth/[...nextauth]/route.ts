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

export const authOptions: NextAuthOptions = {
  providers: [
    /**
     * GOOGLE OAuth
     * Docs: https://next-auth.js.org/providers/google
     * 
     * Setup:
     * 1. Go to https://console.cloud.google.com/
     * 2. Create a new project or select existing
     * 3. Enable Google+ API
     * 4. Create OAuth 2.0 credentials
     * 5. Add authorized redirect URI:
     *    - Development: http://localhost:3000/api/auth/callback/google
     *    - Production: https://saha.vercel.app/api/auth/callback/google
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),

    /**
     * FACEBOOK OAuth
     * Docs: https://next-auth.js.org/providers/facebook
     * 
     * Setup:
     * 1. Go to https://developers.facebook.com/
     * 2. Create a new app
     * 3. Add Facebook Login product
     * 4. Add valid OAuth redirect URIs:
     *    - Development: http://localhost:3000/api/auth/callback/facebook
     *    - Production: https://saha.vercel.app/api/auth/callback/facebook
     */
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),

    /**
     * APPLE OAuth
     * Docs: https://next-auth.js.org/providers/apple
     * 
     * Setup:
     * 1. Go to https://developer.apple.com/account/resources/identifiers/list/serviceId
     * 2. Create a new Service ID
     * 3. Configure Sign in with Apple
     * 4. Add return URLs:
     *    - Development: http://localhost:3000/api/auth/callback/apple
     *    - Production: https://saha.vercel.app/api/auth/callback/apple
     * 
     * Note: Apple OAuth requires additional setup (private key, team ID, key ID)
     */
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
    }),

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
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          
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
    secret: process.env.NEXTAUTH_SECRET,
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
