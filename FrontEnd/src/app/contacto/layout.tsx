import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto – SERCO',
  description: '¿Tenés dudas o consultas? Contactate con el equipo de SERCO y te respondemos a la brevedad.',
  openGraph: {
    title: 'Contacto – SERCO',
    description: '¿Tenés dudas? Contactate con el equipo de SERCO.',
    url: 'https://serco.com.ar/contacto',
    siteName: 'SERCO',
    // images: [{ url: 'https://serco.com.ar/og-serco.png', width: 1200, height: 630 }], // TODO ✏️ imagen OG
    locale: 'es_AR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
