import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { usePlansStore } from '../../store/usePlansStore';
import { EmptyState } from '../../components/EmptyState';

export const READING_PLANS = [
  { id: 'bible-365', name: 'La Bible en 1 an', days: 365, description: 'Un parcours complet, régulier et structuré sur l’ensemble des Écritures.' },
  { id: 'nt-90', name: 'Nouveau Testament en 90 jours', days: 90, description: 'Une lecture suivie du Nouveau Testament avec un rythme soutenu.' },
  { id: 'psalms-30', name: 'Psaumes en 30 jours', days: 30, description: 'Un mois dans les Psaumes pour nourrir la prière et la méditation.' },
  { id: 'proverbs-31', name: 'Proverbes en 31 jours', days: 31, description: 'Un chapitre de sagesse chaque jour, sur un cycle de 31 étapes.' },
  { id: 'gospels-40', name: 'Les 4 Évangiles en 40 jours', days: 40, description: 'Un parcours centré sur la vie et les enseignements de Jésus-Christ.' },
];

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const progress = usePlansStore((state) => state.progress);
  const startPlan = usePlansStore((state) => state.startPlan);

  const handlePlanClick = (planId: string) => {
    if (!progress[planId]) {
      startPlan(planId);
    }
    navigate(`/plans/${planId}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-2 text-text-primary flex items-center gap-3">
        <Calendar className="text-accent-gold" />
        Parcours
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        Choisissez un parcours biblique et avancez jour après jour avec constance.
      </p>

      {READING_PLANS.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl">
          <EmptyState
            title="Aucun parcours disponible"
            message="Les parcours de lecture apparaîtront ici."
            compact
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {READING_PLANS.map((plan) => {
            const planProgress = progress[plan.id];
            const isStarted = !!planProgress;
            const completed = isStarted ? planProgress.completedDays.length : 0;
            const remaining = plan.days - completed;
            const percentage = isStarted
              ? Math.round((completed / plan.days) * 100)
              : 0;

            return (
              <div
                key={plan.id}
                onClick={() => handlePlanClick(plan.id)}
                className="bg-bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-display font-semibold text-lg text-text-primary">{plan.name}</h3>
                  {isStarted && (
                    <span className="text-xs font-medium bg-accent-sage/20 text-accent-sage px-2 py-1 rounded">
                      En cours
                    </span>
                  )}
                </div>
                <p className="font-body text-text-secondary text-sm mb-6 flex-1">
                  {plan.description}
                </p>

                <div className="mt-auto">
                  {isStarted ? (
                    <div>
                      <div className="flex justify-between text-xs font-medium text-text-muted mb-1.5">
                        <span>{completed} / {plan.days} jours</span>
                        <span>{remaining} restants</span>
                      </div>
                      <div className="flex justify-between text-xs font-medium text-text-muted mb-2">
                        <span>Progression</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-gold transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-muted">{plan.days} étapes</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-accent-brown">
                        Commencer <ChevronRight size={16} />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
