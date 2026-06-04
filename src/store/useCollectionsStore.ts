import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';
import type { FavoriteVerse } from './useFavoritesStore';

export interface VerseCollection {
  id: string;
  name: string;
  description?: string;
  verses: FavoriteVerse[];
  createdAt: number;
  updatedAt: number;
}

interface CollectionsState {
  collections: VerseCollection[];
  createCollection: (name: string, description?: string) => string;
  removeCollection: (collectionId: string) => void;
  addVerseToCollection: (collectionId: string, verse: FavoriteVerse) => void;
  removeVerseFromCollection: (collectionId: string, verseId: string) => void;
  loadCollections: (collections: VerseCollection[]) => void;
}

const STORAGE_KEY = 'omed_bible_collections';

const starterCollections = ['Foi', 'Prière', 'Sagesse', 'Consolation', 'Combat intérieur', 'Espérance', 'Repentance', 'Gratitude'];

const createId = (name: string) =>
  `${name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;

const persist = (collections: VerseCollection[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));

  const token = useAuthStore.getState().token;
  const synced = useSettingsStore.getState().synced;
  if (token && synced) {
    syncFileToDrive(DRIVE_FILES.collections, collections, token).catch(() => {
      useSettingsStore.getState().setSyncStatus({ state: 'error', error: 'Collections non synchronisées.' });
    });
  }
};

const getInitialCollections = (): VerseCollection[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as VerseCollection[];
      if (Array.isArray(parsed)) return parsed;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const now = Date.now();
  return starterCollections.map((name, index) => ({
    id: `${name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-')}-${index}`,
    name,
    verses: [],
    createdAt: now,
    updatedAt: now,
  }));
};

export const useCollectionsStore = create<CollectionsState>((set) => ({
  collections: getInitialCollections(),
  createCollection: (name, description) => {
    const cleanName = name.trim();
    if (!cleanName) return '';

    const id = createId(cleanName);
    set((state) => {
      const now = Date.now();
      const collections = [...state.collections, { id, name: cleanName, description, verses: [], createdAt: now, updatedAt: now }];
      persist(collections);
      return { collections };
    });
    return id;
  },
  removeCollection: (collectionId) => set((state) => {
    const collections = state.collections.filter((collection) => collection.id !== collectionId);
    persist(collections);
    return { collections };
  }),
  addVerseToCollection: (collectionId, verse) => set((state) => {
    const collections = state.collections.map((collection) => {
      if (collection.id !== collectionId) return collection;
      if (collection.verses.some((item) => item.id === verse.id)) return collection;
      return { ...collection, verses: [...collection.verses, verse], updatedAt: Date.now() };
    });
    persist(collections);
    return { collections };
  }),
  removeVerseFromCollection: (collectionId, verseId) => set((state) => {
    const collections = state.collections.map((collection) => {
      if (collection.id !== collectionId) return collection;
      return { ...collection, verses: collection.verses.filter((verse) => verse.id !== verseId), updatedAt: Date.now() };
    });
    persist(collections);
    return { collections };
  }),
  loadCollections: (collections) => {
    persist(collections);
    set({ collections });
  },
}));
