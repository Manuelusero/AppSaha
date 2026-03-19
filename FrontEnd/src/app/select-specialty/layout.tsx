import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elegí la especialidad – SERCO',
  description: 'Seleccioná la especialidad del profesional que necesitás para recibir presupuestos personalizados.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
