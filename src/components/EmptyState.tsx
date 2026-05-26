import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  compact = false,
}) => {
  return (
    <div className={compact ? 'py-12 text-center' : 'py-20 text-center'}>
      <Inbox size={30} className="mx-auto mb-4 text-text-muted" aria-hidden="true" />
      <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-lg bg-bg-secondary px-6 py-2 font-medium text-text-primary transition-colors hover:bg-border"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
