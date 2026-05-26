import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore, type FavoriteVerse } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ favorites: [] });
  });

  it('should initialize with empty array if localStorage is empty', () => {
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });

  it('should add a favorite and save to localStorage', () => {
    const verse: FavoriteVerse = {
      id: 'kjv-john-3-16',
      translation: 'kjv',
      bookId: 'john',
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world...',
      dateAdded: Date.now(),
    };

    useFavoritesStore.getState().addFavorite(verse);

    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe('kjv-john-3-16');

    const stored = JSON.parse(localStorage.getItem('omed_bible_favorites') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('kjv-john-3-16');
  });

  it('should remove a favorite and update localStorage', () => {
    const verse: FavoriteVerse = {
      id: 'kjv-john-3-16',
      translation: 'kjv',
      bookId: 'john',
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world...',
      dateAdded: Date.now(),
    };
    useFavoritesStore.getState().addFavorite(verse);

    useFavoritesStore.getState().removeFavorite('kjv-john-3-16');

    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    const stored = JSON.parse(localStorage.getItem('omed_bible_favorites') || '[]');
    expect(stored).toHaveLength(0);
  });
});
