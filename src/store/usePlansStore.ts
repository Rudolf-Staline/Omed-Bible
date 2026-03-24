import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';

export interface PlanProgress {
  planId: string; // e.g., bible-365
  completedDays: number[]; // array of day indices (1-based)
  startDate: number;
}

interface PlansState {
  progress: Record<string, PlanProgress>;
  startPlan: (planId: string) => void;
  markDayComplete: (planId: string, dayIndex: number) => void;
  unmarkDayComplete: (planId: string, dayIndex: number) => void;
  loadPlans: (progress: Record<string, PlanProgress>) => void;
}

const getInitialPlans = (): Record<string, PlanProgress> => {
  const stored = localStorage.getItem('omed_bible_plans');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse plans from localStorage', e);
    }
  }
  return {};
};

export const usePlansStore = create<PlansState>((set) => ({
  progress: getInitialPlans(),
  startPlan: (planId) =>
    set((state) => {
      const newProgress = {
        ...state.progress,
        [planId]: { planId, completedDays: [], startDate: Date.now() },
      };
      localStorage.setItem('omed_bible_plans', JSON.stringify(newProgress));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.plans, newProgress, token).catch(console.error);
      }
      
      return { progress: newProgress };
    }),
  markDayComplete: (planId, dayIndex) =>
    set((state) => {
      const plan = state.progress[planId];
      if (!plan) return state;
      const newProgress = {
        ...state.progress,
        [planId]: {
          ...plan,
          completedDays: Array.from(new Set([...plan.completedDays, dayIndex])),
        },
      };
      localStorage.setItem('omed_bible_plans', JSON.stringify(newProgress));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.plans, newProgress, token).catch(console.error);
      }
      
      return { progress: newProgress };
    }),
  unmarkDayComplete: (planId, dayIndex) =>
    set((state) => {
      const plan = state.progress[planId];
      if (!plan) return state;
      const newProgress = {
        ...state.progress,
        [planId]: {
          ...plan,
          completedDays: plan.completedDays.filter((d) => d !== dayIndex),
        },
      };
      localStorage.setItem('omed_bible_plans', JSON.stringify(newProgress));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.plans, newProgress, token).catch(console.error);
      }
      
      return { progress: newProgress };
    }),
  loadPlans: (progress) => set({ progress }),
}));
