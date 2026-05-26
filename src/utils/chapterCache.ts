import type { Verse } from './bibleApi';

interface CachedChapterEntry {
  key: string;
  verses: Verse[];
  updatedAt: number;
}

const STORAGE_KEY = 'omed_bible_recent_chapters';
const MAX_CACHED_CHAPTERS = 20;

const buildChapterCacheKey = (translation: string, bookId: string, chapter: number): string =>
  `${translation}:${bookId}:${chapter}`;

const parseCache = (raw: string | null): CachedChapterEntry[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CachedChapterEntry[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry) =>
      entry &&
      typeof entry.key === 'string' &&
      Array.isArray(entry.verses) &&
      typeof entry.updatedAt === 'number'
    );
  } catch (error) {
    console.error('Failed to parse chapter cache', error);
    return [];
  }
};

const readCacheEntries = (): CachedChapterEntry[] => {
  if (typeof localStorage === 'undefined') return [];
  return parseCache(localStorage.getItem(STORAGE_KEY));
};

const saveCacheEntries = (entries: CachedChapterEntry[]) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const getCachedChapter = (
  translation: string,
  bookId: string,
  chapter: number
): Verse[] | null => {
  const key = buildChapterCacheKey(translation, bookId, chapter);
  const entries = readCacheEntries();
  const match = entries.find((entry) => entry.key === key);

  return match?.verses ?? null;
};

export const cacheChapter = (
  translation: string,
  bookId: string,
  chapter: number,
  verses: Verse[]
): void => {
  const key = buildChapterCacheKey(translation, bookId, chapter);
  const entries = readCacheEntries().filter((entry) => entry.key !== key);

  entries.unshift({
    key,
    verses,
    updatedAt: Date.now(),
  });

  saveCacheEntries(entries.slice(0, MAX_CACHED_CHAPTERS));
};
