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
      bgColor: '#FFF3CD',
      textColor: '#856404',
      icon: '⏳',
    },
    ACCEPTED: {
      label: 'Aceptada',
      bgColor: '#D1ECF1',
      textColor: '#0C5460',
      icon: '✅',
    },
    REJECTED: {
      label: 'Rechazada',
      bgColor: '#F8D7DA',
      textColor: '#721C24',
      icon: '❌',
    },
    CONFIRMED: {
      label: 'Confirmada',
      bgColor: '#D4EDDA',
      textColor: '#155724',
      icon: '✓',
    },
    IN_PROGRESS: {
      label: 'En Progreso',
      bgColor: '#CCE5FF',
      textColor: '#004085',
      icon: '🔄',
    },
    COMPLETED: {
      label: 'Completada',
      bgColor: '#C3E6CB',
      textColor: '#155724',
      icon: '🎉',
    },
    CANCELLED: {
      label: 'Cancelada',
      bgColor: '#E2E3E5',
      textColor: '#383D41',
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
