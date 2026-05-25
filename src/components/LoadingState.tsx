import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingStateProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Chargement en cours',
  description = 'Merci de patienter quelques instants.',
  compact = false,
}) => {
  return (
    <div className={`text-center ${compact ? 'py-10' : 'py-20'}`} role="status" aria-live="polite">
      <Loader2 className="mx-auto mb-4 text-accent-gold animate-spin" size={compact ? 28 : 36} />
      <p className="text-text-primary font-medium">{title}</p>
      <p className="text-text-muted text-sm mt-2">{description}</p>
    </div>
  );
};
