import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear cuenta – SERCO',
  description: 'Registrate gratis en SERCO y encontrá profesionales verificados para cualquier servicio del hogar.',
  openGraph: {
    title: 'Crear cuenta – SERCO',
    description: 'Registrate gratis y encontrá profesionales verificados.',
    url: 'https://serco.com.ar/signup',
    siteName: 'SERCO',
    // images: [{ url: 'https://serco.com.ar/og-serco.png', width: 1200, height: 630 }], // TODO ✏️ imagen OG
    locale: 'es_AR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
