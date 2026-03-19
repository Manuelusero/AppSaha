'use client';

import { useRouter } from 'next/navigation';
import { colors, typography } from '@/styles/tokens';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 mb-8 group"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        color: colors.primary.main,
        fontFamily: typography.fontFamily.primary,
        fontSize: '15px',
        fontWeight: 500,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform group-hover:-translate-x-1 duration-150"
      >
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      Volver
    </button>
  );
}
