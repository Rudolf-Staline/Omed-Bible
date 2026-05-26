import type { Verse } from './bibleApi';

const MAX_RECENT_CHAPTERS = 20;
const CHAPTER_CACHE_PREFIX = 'omed_bible_chapter';
const CHAPTER_CACHE_INDEX_KEY = 'omed_bible_chapter_index';

type ChapterKey = {
  translation: string;
  bookId: string;
  chapter: number;
};

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getCacheKey = ({ translation, bookId, chapter }: ChapterKey) => `${CHAPTER_CACHE_PREFIX}:${translation}:${bookId}:${chapter}`;

const readIndex = (storage: Storage): string[] => {
  try {
    const raw = storage.getItem(CHAPTER_CACHE_INDEX_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
};

const writeIndex = (storage: Storage, index: string[]) => {
  try {
    storage.setItem(CHAPTER_CACHE_INDEX_KEY, JSON.stringify(index));
  } catch {
    // ignore write errors
  }
};

export const getCachedChapter = (key: ChapterKey): Verse[] | null => {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(getCacheKey(key));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed as Verse[];
  } catch {
    return null;
  }
};

export const setCachedChapter = (key: ChapterKey, verses: Verse[]) => {
  const storage = getStorage();
  if (!storage) return;

  const cacheKey = getCacheKey(key);

  try {
    storage.setItem(cacheKey, JSON.stringify(verses));
  } catch {
    return;
  }

  const index = readIndex(storage);
  const updated = [cacheKey, ...index.filter((item) => item !== cacheKey)].slice(0, MAX_RECENT_CHAPTERS);

  const removed = index.filter((item) => !updated.includes(item));
  removed.forEach((item) => {
    try {
      storage.removeItem(item);
    } catch {
      // ignore removal errors
    }
  });

  writeIndex(storage, updated);
};
