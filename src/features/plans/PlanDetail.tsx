import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { usePlansStore } from '../../store/usePlansStore';
import { READING_PLANS } from './PlansPage';

const PLAN_READING_PATHS: Record<string, { bookId: string; maxChapter: number }> = {
  'bible-365': { bookId: 'genese', maxChapter: 50 },
  'nt-90': { bookId: 'matthieu', maxChapter: 28 },
  'psalms-30': { bookId: 'psaumes', maxChapter: 150 },
  'proverbs-31': { bookId: 'proverbes', maxChapter: 31 },
  'gospels-40': { bookId: 'jean', maxChapter: 21 },
};

const getReadingForDay = (planId: string, day: number) => {
  const base = PLAN_READING_PATHS[planId] || { bookId: 'jean', maxChapter: 21 };
  const chapter = ((day - 1) % base.maxChapter) + 1;
  return { bookId: base.bookId, chapter };
};

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
        Parcours introuvable ou non commencé.
        <br />
        <button onClick={() => navigate('/plans')} className="text-accent-brown underline mt-4">Retour aux parcours</button>
      </div>
    );
  }

  const completedCount = planProgress.completedDays.length;
  const percentage = Math.round((completedCount / plan.days) * 100);
  const currentDay = Math.min(completedCount + 1, plan.days);

  const days = Array.from({ length: plan.days }, (_, i) => i + 1);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button
        onClick={() => navigate('/plans')}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Retour aux parcours
      </button>

      <div className="bg-bg-card border border-border rounded-2xl p-8 mb-8">
        <h1 className="font-display text-3xl font-bold mb-3 text-text-primary">{plan.name}</h1>
        <p className="font-body text-text-secondary mb-6 leading-relaxed">
          {plan.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
          <div className="rounded-lg border border-border p-3 bg-bg-secondary/40">
            <p className="text-text-muted">Progression</p>
            <p className="text-text-primary font-semibold">{completedCount} / {plan.days} jours</p>
          </div>
          <div className="rounded-lg border border-border p-3 bg-bg-secondary/40">
            <p className="text-text-muted">Avancement</p>
            <p className="text-text-primary font-semibold">{percentage}%</p>
          </div>
          <div className="rounded-lg border border-border p-3 bg-bg-secondary/40">
            <p className="text-text-muted">Étape actuelle</p>
            <p className="text-text-primary font-semibold">Jour {currentDay}</p>
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
        <h2 className="font-display text-xl font-bold text-text-primary">Étapes du parcours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {days.map((day) => {
            const isCompleted = planProgress.completedDays.includes(day);
            const reading = getReadingForDay(plan.id, day);

            return (
              <div
                key={day}
                className={`rounded-xl border p-4 transition-colors ${
                  isCompleted
                    ? 'border-accent-sage/40 bg-accent-sage/10'
                    : 'border-border bg-bg-card'
                }`}
              >
                <div className="flex items-center justify-between mb-3 gap-3">
                  <div>
                    <p className="text-xs text-text-muted">Étape</p>
                    <p className="font-semibold text-text-primary">Jour {day}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (isCompleted) {
                        unmarkDayComplete(plan.id, day);
                      } else {
                        markDayComplete(plan.id, day);
                      }
                    }}
                    className={`text-xs font-medium px-3 py-1.5 rounded border ${
                      isCompleted
                        ? 'border-accent-sage text-accent-sage'
                        : 'border-border text-text-secondary hover:border-accent-gold/50'
                    }`}
                  >
                    {isCompleted ? 'Marqué comme fait' : 'Marquer comme fait'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-text-secondary">
                    Lecture suggérée : {reading.bookId} {reading.chapter}
                  </p>
                  <button
                    onClick={() => navigate(`/read/kjv/${reading.bookId}/${reading.chapter}`)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent-brown hover:underline"
                  >
                    <BookOpen size={15} />
                    Ouvrir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
