import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePlansStore } from '../../store/usePlansStore';
import { READING_PLANS } from './PlansPage';

export const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  
  const progress = usePlansStore((state) => state.progress);
  const markDayComplete = usePlansStore((state) => state.markDayComplete);
  const unmarkDayComplete = usePlansStore((state) => state.unmarkDayComplete);

  const plan = READING_PLANS.find((p) => p.id === planId);
  const planProgress = progress[planId || ''];

  if (!plan || !planProgress) {
    return (
      <div className="py-20 text-center text-text-muted">
        Plan introuvable ou non commencé.
        <br />
        <button onClick={() => navigate('/plans')} className="text-accent-brown underline mt-4">Retour aux plans</button>
      </div>
    );
  }

  const completedCount = planProgress.completedDays.length;
  const percentage = Math.round((completedCount / plan.days) * 100);

  // Generate an array of days [1, 2, ..., plan.days]
  const days = Array.from({ length: plan.days }, (_, i) => i + 1);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button 
        onClick={() => navigate('/plans')}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Retour aux plans
      </button>

      <div className="bg-bg-card border border-border rounded-2xl p-8 mb-8">
        <h1 className="font-display text-3xl font-bold mb-4 text-text-primary">{plan.name}</h1>
        <p className="font-body text-text-secondary mb-8 leading-relaxed">
          {plan.description}
        </p>
        
        <div className="flex justify-between items-end mb-2">
          <div className="text-sm font-medium text-text-muted">
            <strong className="text-text-primary text-xl mr-2">{completedCount}</strong>
            / {plan.days} jours complétés
          </div>
          <div className="text-2xl font-display font-semibold text-accent-gold">
            {percentage}%
          </div>
        </div>
        <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-gold transition-all duration-500 ease-out" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-text-primary mb-4">Progression quotidienne</h2>
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3">
          {days.map((day) => {
            const isCompleted = planProgress.completedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => {
                  if (isCompleted) {
                    unmarkDayComplete(plan.id, day);
                  } else {
                    markDayComplete(plan.id, day);
                  }
                }}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center border transition-all
                  ${isCompleted 
                    ? 'bg-accent-sage border-accent-sage text-white shadow-sm' 
                    : 'bg-bg-card border-border text-text-secondary hover:border-accent-gold/50 hover:bg-bg-secondary'
                  }
                `}
              >
                <span className="text-xs font-semibold mb-1 opacity-80">Jour</span>
                <span className="font-mono font-bold text-lg">{day}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
