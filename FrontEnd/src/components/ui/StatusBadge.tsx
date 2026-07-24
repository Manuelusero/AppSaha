import React from 'react';
import { colors, typography } from '@/styles/tokens';

type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

/**
 * Badge para estados de booking con colores semánticos
 * 
 * @example
 * ```tsx
 * <StatusBadge status="COMPLETED" />
 * <StatusBadge status="PENDING" />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig: Record<
    BookingStatus,
    { label: string; bgColor: string; textColor: string; icon?: string }
  > = {
    PENDING: {
      label: 'Pendiente',
      bgColor: colors.warning.light,
      textColor: colors.warning.main,
      icon: '⏳',
    },
    ACCEPTED: {
      label: 'Aceptada',
      bgColor: colors.success.light,
      textColor: colors.success.dark,
      icon: '✅',
    },
    REJECTED: {
      label: 'Rechazada',
      bgColor: colors.error.light,
      textColor: colors.error.dark,
      icon: '❌',
    },
    CONFIRMED: {
      label: 'Confirmada',
      bgColor: colors.success.light,
      textColor: colors.success.dark,
      icon: '✓',
    },
    IN_PROGRESS: {
      label: 'En Progreso',
      bgColor: colors.info.light,
      textColor: colors.info.dark,
      icon: '🔄',
    },
    COMPLETED: {
      label: 'Completada',
      bgColor: colors.success.light,
      textColor: colors.success.dark,
      icon: '🎉',
    },
    CANCELLED: {
      label: 'Cancelada',
      bgColor: colors.neutral[100],
      textColor: colors.neutral[600],
      icon: '🚫',
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontFamily: typography.fontFamily.primary,
      }}
    >
      {config.icon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
};
