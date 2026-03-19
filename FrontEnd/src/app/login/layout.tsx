import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar sesión – SERCO',
  description: 'Accedé a tu cuenta de SERCO para gestionar tus servicios y solicitudes.',
  openGraph: {
    title: 'Iniciar sesión – SERCO',
    description: 'Accedé a tu cuenta de SERCO.',
    url: 'https://serco.com.ar/login',
    siteName: 'SERCO',
    // images: [{ url: 'https://serco.com.ar/og-serco.png', width: 1200, height: 630 }], // TODO ✏️ imagen OG
    locale: 'es_AR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
