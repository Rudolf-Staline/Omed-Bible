import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';

export type FontSize = 'S' | 'M' | 'L' | 'XL';
export type LineHeight = 'Normal' | 'Relaxed' | 'Large';
export type FontFamily = 'Lora' | 'Inter';
export type Theme = 'Light' | 'Sepia' | 'Dark';
export type Language = 'Français' | 'English';
export type ReadingWidth = 'Narrow' | 'Comfortable' | 'Wide';
export type ReadingDensity = 'Compact' | 'Aired';
export type ReadingMode = 'Lecture' | 'Étude';
export type SyncState = 'offline' | 'connected' | 'syncing' | 'synced' | 'error';

export interface Settings {
  defaultTranslation: string;
  fontSize: FontSize;
  lineHeight: LineHeight;
  fontFamily: FontFamily;
  theme: Theme;
  language: Language;
  readingWidth: ReadingWidth;
  readingDensity: ReadingDensity;
  readingMode: ReadingMode;
  showVerseNumbers: boolean;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  loadSettings: (settings: Partial<Settings>) => void;
  synced: boolean;
  setSynced: (synced: boolean) => void;
  syncState: SyncState;
  syncError: string | null;
  lastSyncedAt: number | null;
  setSyncStatus: (status: { state: SyncState; error?: string | null; lastSyncedAt?: number | null }) => void;
}

const DEFAULT_SETTINGS: Settings = {
  defaultTranslation: 'kjv',
  fontSize: 'M',
  lineHeight: 'Relaxed',
  fontFamily: 'Lora',
  theme: 'Light',
  language: 'Français',
  readingWidth: 'Comfortable',
  readingDensity: 'Aired',
  readingMode: 'Lecture',
  showVerseNumbers: true,
};

const getInitialSettings = (): Settings => {
  const stored = localStorage.getItem('omed_bible_settings');
  if (stored) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      localStorage.removeItem('omed_bible_settings');
    }
  }
  return DEFAULT_SETTINGS;
};

const getInitialSynced = (): boolean => {
  return localStorage.getItem('omed_bible_synced') === 'true';
};

const getInitialLastSyncedAt = (): number | null => {
  const value = localStorage.getItem('omed_bible_last_synced_at');
  return value ? Number(value) : null;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: getInitialSettings(),
  synced: getInitialSynced(),
  syncState: getInitialSynced() ? 'synced' : 'offline',
  syncError: null,
  lastSyncedAt: getInitialLastSyncedAt(),
  updateSettings: (newSettings) =>
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      localStorage.setItem('omed_bible_settings', JSON.stringify(updated));

      const token = useAuthStore.getState().token;
      if (token && state.synced) {
        syncFileToDrive(DRIVE_FILES.settings, updated, token).catch(() => {
          useSettingsStore.getState().setSyncStatus({ state: 'error', error: 'Sauvegarde des préférences non synchronisée.' });
        });
      }

      return { settings: updated };
    }),
  loadSettings: (settings) => set({ settings: { ...DEFAULT_SETTINGS, ...settings } }),
  setSynced: (synced) => {
    localStorage.setItem('omed_bible_synced', String(synced));
    set({ synced, syncState: synced ? 'synced' : 'connected' });
  },
  setSyncStatus: ({ state, error = null, lastSyncedAt }) => {
    if (typeof lastSyncedAt === 'number') {
      localStorage.setItem('omed_bible_last_synced_at', String(lastSyncedAt));
    }
    set((current) => ({
      syncState: state,
      syncError: error,
      lastSyncedAt: typeof lastSyncedAt === 'number' ? lastSyncedAt : current.lastSyncedAt,
    }));
  },
}));
