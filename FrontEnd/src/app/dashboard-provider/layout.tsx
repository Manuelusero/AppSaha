import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel de prestador – SERCO',
  description: 'Gestioná tus servicios, solicitudes entrantes y reseñas desde tu panel de prestador en SERCO.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
