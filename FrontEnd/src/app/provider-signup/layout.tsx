import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrate como prestador – SERCO',
  description: 'Ofrecé tus servicios en SERCO, llegá a nuevos clientes y gestioná tus trabajos desde un solo lugar.',
  openGraph: {
    title: 'Registrate como prestador – SERCO',
    description: 'Ofrecé tus servicios y llegá a nuevos clientes.',
    url: 'https://serco.com.ar/provider-signup',
    siteName: 'SERCO',
    // images: [{ url: 'https://serco.com.ar/og-serco.png', width: 1200, height: 630 }], // TODO ✏️ imagen OG
    locale: 'es_AR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
