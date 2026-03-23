import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';

export interface BibleState {
  translation: string;
  bookId: string;
  chapter: number;
  compareTranslation: string | null;
  setPosition: (translation: string, bookId: string, chapter: number) => void;
  setCompareTranslation: (translation: string | null) => void;
}

const getInitialPosition = () => {
  const stored = localStorage.getItem('omed_bible_position');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.translation && parsed.bookId && parsed.chapter) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse position from localStorage', e);
    }
  }
  return { translation: 'kjv', bookId: 'jean', chapter: 3 };
};

export const useBibleStore = create<BibleState>((set) => ({
  ...getInitialPosition(),
  compareTranslation: null,
  setPosition: (translation, bookId, chapter) => set((state) => {
     const newState = { translation, bookId, chapter, compareTranslation: state.compareTranslation };
     localStorage.setItem('omed_bible_position', JSON.stringify(newState));

     const token = useAuthStore.getState().token;
     const synced = useSettingsStore.getState().synced;
     if (token && synced) {
        syncFileToDrive(DRIVE_FILES.position, newState, token).catch(console.error);
     }

     return newState;
  }),
  setCompareTranslation: (compareTranslation) => set({ compareTranslation }),
}));
