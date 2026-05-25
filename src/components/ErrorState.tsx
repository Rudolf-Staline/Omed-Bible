import React from 'react';
import { AlertCircle } from 'lucide-react';

type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Une erreur est survenue',
  description = 'Nous n\'avons pas pu terminer cette action pour le moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-20 text-center" role="alert" aria-live="assertive">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
      <h2 className="font-display text-2xl text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary max-w-xl mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2 rounded-lg bg-bg-secondary text-text-primary hover:bg-border transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
