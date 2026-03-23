import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';

export type FontSize = 'S' | 'M' | 'L' | 'XL';
export type LineHeight = 'Normal' | 'Relaxed' | 'Large';
export type FontFamily = 'Lora' | 'Inter';
export type Theme = 'Light' | 'Sepia' | 'Dark';
export type Language = 'Français' | 'English';

export interface Settings {
  defaultTranslation: string;
  fontSize: FontSize;
  lineHeight: LineHeight;
  fontFamily: FontFamily;
  theme: Theme;
  language: Language;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  loadSettings: (settings: Settings) => void;
  synced: boolean;
  setSynced: (synced: boolean) => void;
}

const DEFAULT_SETTINGS: Settings = {
  defaultTranslation: 'kjv',
  fontSize: 'M',
  lineHeight: 'Relaxed',
  fontFamily: 'Lora',
  theme: 'Light',
  language: 'Français',
};

const getInitialSettings = (): Settings => {
  const stored = localStorage.getItem('omed_bible_settings');
  if (stored) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to parse settings from localStorage', e);
    }
  }
  return DEFAULT_SETTINGS;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: getInitialSettings(),
  synced: false,
  updateSettings: (newSettings) =>
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      localStorage.setItem('omed_bible_settings', JSON.stringify(updated));

      const token = useAuthStore.getState().token;
      if (token && state.synced) {
        syncFileToDrive(DRIVE_FILES.settings, updated, token).catch(console.error);
      }

      return { settings: updated };
    }),
  loadSettings: (settings) => set({ settings }),
  setSynced: (synced) => set({ synced }),
}));
