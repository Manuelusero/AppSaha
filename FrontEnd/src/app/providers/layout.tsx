import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfil de profesional – SERCO',
  description: 'Conocé el perfil, especialidades, reseñas y trabajos anteriores de este profesional en SERCO.',
  // Nota: para SEO óptimo usar generateMetadata() dinámico con el nombre real del prestador
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
