import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solicitar servicio – SERCO',
  description: 'Describí lo que necesitás, adjuntá fotos si querés y recibí presupuestos de profesionales en menos de 48hs.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
