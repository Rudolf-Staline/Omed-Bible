import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { usePlansStore } from '../../store/usePlansStore';
import { READING_PLANS } from './plansData';

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
        <div className="bg-bg-card border border-border rounded-xl p-8 text-center text-text-secondary">
          Aucun parcours disponible pour le moment.
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
