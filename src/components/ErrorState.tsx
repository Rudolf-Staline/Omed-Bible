import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Impossible de charger cette page',
  message = 'Veuillez réessayer dans quelques instants.',
  actionLabel = 'Réessayer',
  onAction,
  compact = false,
}) => {
  return (
    <div
      role="alert"
      className={compact ? 'py-12 text-center' : 'py-20 text-center'}
    >
      <AlertTriangle className="mx-auto mb-4 text-text-muted" size={28} aria-hidden="true" />
      <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{message}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-lg border border-border bg-bg-card px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-secondary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
