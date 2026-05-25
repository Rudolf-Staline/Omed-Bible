import React from 'react';
import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <Icon size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
      <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2 bg-bg-secondary text-text-primary rounded-lg font-medium hover:bg-border transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
