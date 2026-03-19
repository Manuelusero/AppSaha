import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalles de contacto – SERCO',
  description: 'Confirmá los datos de contacto del profesional y coordiná tu servicio a través de SERCO.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
