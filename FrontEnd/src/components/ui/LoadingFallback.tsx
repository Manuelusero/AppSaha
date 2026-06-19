'use client';

interface LoadingFallbackProps {
  message?: string;
}

export default function LoadingFallback({ message = 'Cargando...' }: LoadingFallbackProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      <span className="ml-4 text-neutral-600">{message}</span>
    </div>
  );
}
