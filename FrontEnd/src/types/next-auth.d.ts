/**
 * Type definitions para NextAuth.js
 * Extiende los tipos de sesión y usuario con campos personalizados
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
      accessToken?: string;
      provider?: string; // 'google' | 'facebook' | 'apple' | 'credentials'
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
    accessToken?: string;
    provider?: string;
  }
}
