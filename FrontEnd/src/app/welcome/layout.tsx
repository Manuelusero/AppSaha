import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bienvenido a SERCO',
  description: 'SERCO conecta clientes con profesionales de servicios verificados en Argentina. Encontrá al experto que necesitás hoy.',
  openGraph: {
    title: 'Bienvenido a SERCO',
    description: 'Conectamos clientes con profesionales verificados en Argentina.',
    url: 'https://serco.com.ar',
    siteName: 'SERCO',
    // images: [{ url: 'https://serco.com.ar/og-serco.png', width: 1200, height: 630 }], // TODO ✏️ imagen OG
    locale: 'es_AR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
