import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre nosotros – SERCO',
  description: 'Conocé la historia de SERCO, la plataforma que conecta a clientes con profesionales de servicios verificados en Argentina.',
  openGraph: {
    title: 'Sobre nosotros – SERCO',
    description: 'La plataforma que conecta clientes con profesionales verificados.',
    url: 'https://serco.com.ar/sobre-nosotros',
    siteName: 'SERCO',
    // images: [{ url: 'https://serco.com.ar/og-serco.png', width: 1200, height: 630 }], // TODO ✏️ imagen OG
    locale: 'es_AR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
