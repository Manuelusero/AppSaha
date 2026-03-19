import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis solicitudes – SERCO',
  description: 'Revisá el estado de tus solicitudes de trabajo y presupuestos recibidos en SERCO.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
