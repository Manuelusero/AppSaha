import type { Metadata } from 'next';

export const metadata: Metadata = {
  // ✏️ DISEÑADORA: revisar estos textos antes del lanzamiento
  // title: lo que aparece en la pestaña del navegador y en Google (max 60 caracteres)
  title: 'Encontrá profesionales de confianza – SERCO',

  // description: el texto que aparece debajo del título en Google (max 160 caracteres)
  description: 'Buscá y contratá plomeros, electricistas, pintores y más profesionales verificados cerca tuyo. Presupuestos en menos de 48hs.',

  // openGraph: lo que se ve cuando compartís el link en WhatsApp, Instagram, etc.
  openGraph: {
    title: 'Encontrá profesionales de confianza – SERCO',
    description: 'Buscá y contratá profesionales verificados cerca tuyo.',
    url: 'https://serco.com.ar/buscar',
    siteName: 'SERCO',
    // TODO ✏️ DISEÑADORA: necesitamos una imagen de 1200x630px para esto
    // images: [{ url: 'https://serco.com.ar/og-buscar.png', width: 1200, height: 630 }],
    locale: 'es_AR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
