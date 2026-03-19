import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi panel – SERCO',
  description: 'Gestioná tus solicitudes, presupuestos y profesionales contratados desde tu panel de cliente en SERCO.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
