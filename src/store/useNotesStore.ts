import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';

export interface Note {
  id: string; // generated id
  verseId: string; // translation-book-chapter-verse
  text: string;
  verseText: string;
  dateAdded: number;
  dateModified: number;
}

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'dateAdded' | 'dateModified'>) => void;
  updateNote: (id: string, text: string) => void;
  removeNote: (id: string) => void;
  loadNotes: (notes: Note[]) => void;
}

const getInitialNotes = (): Note[] => {
  const stored = localStorage.getItem('omed_bible_notes');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse notes from localStorage', e);
    }
  }
  return [];
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: getInitialNotes(),
  addNote: (noteData) =>
    set((state) => {
      const now = Date.now();
      const newNote: Note = {
        ...noteData,
        id: `note-${now}`,
        dateAdded: now,
        dateModified: now,
      };
      const newNotes = [...state.notes, newNote];
      localStorage.setItem('omed_bible_notes', JSON.stringify(newNotes));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.notes, newNotes, token).catch(console.error);
      }
      
      return { notes: newNotes };
    }),
  updateNote: (id, text) =>
    set((state) => {
      const newNotes = state.notes.map((n) =>
        n.id === id ? { ...n, text, dateModified: Date.now() } : n
      );
      localStorage.setItem('omed_bible_notes', JSON.stringify(newNotes));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.notes, newNotes, token).catch(console.error);
      }
      
      return { notes: newNotes };
    }),
  removeNote: (id) =>
    set((state) => {
      const newNotes = state.notes.filter((n) => n.id !== id);
      localStorage.setItem('omed_bible_notes', JSON.stringify(newNotes));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.notes, newNotes, token).catch(console.error);
      }
      
      return { notes: newNotes };
    }),
  loadNotes: (notes) => set({ notes }),
}));
