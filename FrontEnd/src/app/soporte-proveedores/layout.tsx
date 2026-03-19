import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soporte para prestadores – SERCO',
  description: '¿Necesitás ayuda como prestador? Encontrá respuestas a las preguntas más frecuentes o contactá a nuestro equipo.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
