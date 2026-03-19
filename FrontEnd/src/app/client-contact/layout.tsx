import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contactar profesional – SERCO',
  description: 'Enviá un mensaje directo al profesional y coordiná los detalles de tu servicio en SERCO.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
