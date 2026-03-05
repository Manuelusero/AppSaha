import type { Metadata } from 'next';

export const metadata: Metadata = {
  // TODO: Definir con diseñadora
  title: 'SAHA',
  description: 'TODO',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
