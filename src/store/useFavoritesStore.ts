import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';

export interface FavoriteVerse {
  id: string; // e.g., lsg-jean-3-16
  translation: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  dateAdded: number;
}

interface FavoritesState {
  favorites: FavoriteVerse[];
  addFavorite: (verse: FavoriteVerse) => void;
  removeFavorite: (id: string) => void;
  loadFavorites: (favorites: FavoriteVerse[]) => void;
}

const getInitialFavorites = (): FavoriteVerse[] => {
  const stored = localStorage.getItem('omed_bible_favorites');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse favorites from localStorage', e);
    }
  }
  return [];
};

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: getInitialFavorites(),
  addFavorite: (verse) =>
    set((state) => {
      const newFavorites = [...state.favorites, verse];
      localStorage.setItem('omed_bible_favorites', JSON.stringify(newFavorites));

      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.favorites, newFavorites, token).catch(console.error);
      }

      return { favorites: newFavorites };
    }),
  removeFavorite: (id) =>
    set((state) => {
      const newFavorites = state.favorites.filter((f) => f.id !== id);
      localStorage.setItem('omed_bible_favorites', JSON.stringify(newFavorites));

      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.favorites, newFavorites, token).catch(console.error);
      }

      return { favorites: newFavorites };
    }),
  loadFavorites: (favorites) => set({ favorites }),
}));
