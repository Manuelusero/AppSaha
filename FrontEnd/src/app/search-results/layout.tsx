import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resultados de búsqueda – SERCO',
  description: 'Encontrá los mejores profesionales verificados para tu servicio. Compará perfiles, reseñas y solicitá presupuestos.',
  openGraph: {
    title: 'Resultados de búsqueda – SERCO',
    description: 'Encontrá profesionales verificados y solicitá presupuestos.',
    url: 'https://serco.com.ar/search-results',
    siteName: 'SERCO',
    // images: [{ url: 'https://serco.com.ar/og-serco.png', width: 1200, height: 630 }], // TODO ✏️ imagen OG
    locale: 'es_AR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
