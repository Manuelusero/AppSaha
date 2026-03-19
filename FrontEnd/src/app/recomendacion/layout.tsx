import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recomendá un profesional – SERCO',
  description: 'Compartí tu experiencia y recomendá a este profesional para que otros usuarios puedan contratarlo.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
