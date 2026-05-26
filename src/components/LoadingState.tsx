import React from 'react';

interface LoadingStateProps {
  title?: string;
  message?: string;
  compact?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Chargement en cours',
  message = 'Un instant, nous préparons le contenu.',
  compact = false,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={compact ? 'py-12 text-center' : 'py-20 text-center'}
    >
      <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent-gold" aria-hidden="true" />
      <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{message}</p>
      <span className="sr-only">Chargement</span>
    </div>
  );
};
