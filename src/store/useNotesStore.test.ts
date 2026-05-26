import { describe, it, expect, beforeEach } from 'vitest';
import { useNotesStore } from './useNotesStore';

describe('useNotesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useNotesStore.setState({ notes: [] });
  });

  it('should initialize with empty array if localStorage is empty', () => {
    expect(useNotesStore.getState().notes).toEqual([]);
  });

  it('should add a note and save to localStorage', () => {
    useNotesStore.getState().addNote({
      verseId: 'kjv-john-3-16',
      text: 'My note',
      verseText: 'For God so loved the world...',
    });

    const { notes } = useNotesStore.getState();
    expect(notes).toHaveLength(1);
    expect(notes[0].verseId).toBe('kjv-john-3-16');
    expect(notes[0].text).toBe('My note');
    expect(notes[0].id).toBeDefined();

    const stored = JSON.parse(localStorage.getItem('omed_bible_notes') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].verseId).toBe('kjv-john-3-16');
  });

  it('should update a note and update localStorage', () => {
    useNotesStore.getState().addNote({
      verseId: 'kjv-john-3-16',
      text: 'Original note',
      verseText: 'For God so loved the world...',
    });
    const id = useNotesStore.getState().notes[0].id;
    const originalDateModified = useNotesStore.getState().notes[0].dateModified;

    // Wait a bit to ensure dateModified changes if it uses Date.now() directly
    // Let's just update and check
    useNotesStore.getState().updateNote(id, 'Updated note');

    const { notes } = useNotesStore.getState();
    expect(notes).toHaveLength(1);
    expect(notes[0].text).toBe('Updated note');
    expect(notes[0].dateModified).toBeGreaterThanOrEqual(originalDateModified);

    const stored = JSON.parse(localStorage.getItem('omed_bible_notes') || '[]');
    expect(stored[0].text).toBe('Updated note');
  });

  it('should remove a note and update localStorage', () => {
    useNotesStore.getState().addNote({
      verseId: 'kjv-john-3-16',
      text: 'My note',
      verseText: 'For God so loved the world...',
    });
    const id = useNotesStore.getState().notes[0].id;

    useNotesStore.getState().removeNote(id);

    expect(useNotesStore.getState().notes).toHaveLength(0);
    const stored = JSON.parse(localStorage.getItem('omed_bible_notes') || '[]');
    expect(stored).toHaveLength(0);
  });
});
