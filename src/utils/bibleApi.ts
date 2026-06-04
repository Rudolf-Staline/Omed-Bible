export interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface SearchResult {
  reference: string;
  text: string;
  translation_id: string;
  book_id: string;
  chapter_id: string;
}

export type TranslationSource = 'bolls' | 'bible-api' | 'api-bible';

export interface BibleTranslation {
  id: string;
  name: string;
  language: 'fr' | 'en';
  short: string;
  source: TranslationSource;
  sourceId: string;
  searchSupported: boolean;
  requiresApiKey?: boolean;
  note?: string;
}

export interface BibleBook {
  id: string;
  name: string;
  englishName: string;
  chapters: number;
  testament: 'AT' | 'NT';
  bollsNumber: number;
  apiBibleId?: string;
}

const API_BIBLE_KEY = import.meta.env.VITE_BIBLE_API_KEY || '';

const OPTIONAL_API_BIBLE_TRANSLATIONS: BibleTranslation[] = [
  {
    id: 'niv',
    name: 'New International Version',
    language: 'en',
    short: 'NIV',
    source: 'api-bible',
    sourceId: '06125adad2d5898a-01',
    searchSupported: false,
    requiresApiKey: true,
    note: 'Disponible uniquement si VITE_BIBLE_API_KEY est configurée.'
  }
];

export const BIBLE_BOOKS: BibleBook[] = [
  { id: 'genese', name: 'Genèse', englishName: 'Genesis', chapters: 50, testament: 'AT', bollsNumber: 1, apiBibleId: 'GEN' },
  { id: 'exode', name: 'Exode', englishName: 'Exodus', chapters: 40, testament: 'AT', bollsNumber: 2, apiBibleId: 'EXO' },
  { id: 'levitique', name: 'Lévitique', englishName: 'Leviticus', chapters: 27, testament: 'AT', bollsNumber: 3, apiBibleId: 'LEV' },
  { id: 'nombres', name: 'Nombres', englishName: 'Numbers', chapters: 36, testament: 'AT', bollsNumber: 4, apiBibleId: 'NUM' },
  { id: 'deutéronome', name: 'Deutéronome', englishName: 'Deuteronomy', chapters: 34, testament: 'AT', bollsNumber: 5, apiBibleId: 'DEU' },
  { id: 'josué', name: 'Josué', englishName: 'Joshua', chapters: 24, testament: 'AT', bollsNumber: 6, apiBibleId: 'JOS' },
  { id: 'juges', name: 'Juges', englishName: 'Judges', chapters: 21, testament: 'AT', bollsNumber: 7, apiBibleId: 'JDG' },
  { id: 'ruth', name: 'Ruth', englishName: 'Ruth', chapters: 4, testament: 'AT', bollsNumber: 8, apiBibleId: 'RUT' },
  { id: '1 samuel', name: '1 Samuel', englishName: '1 Samuel', chapters: 31, testament: 'AT', bollsNumber: 9, apiBibleId: '1SA' },
  { id: '2 samuel', name: '2 Samuel', englishName: '2 Samuel', chapters: 24, testament: 'AT', bollsNumber: 10, apiBibleId: '2SA' },
  { id: '1 rois', name: '1 Rois', englishName: '1 Kings', chapters: 22, testament: 'AT', bollsNumber: 11, apiBibleId: '1KI' },
  { id: '2 rois', name: '2 Rois', englishName: '2 Kings', chapters: 25, testament: 'AT', bollsNumber: 12, apiBibleId: '2KI' },
  { id: '1 chroniques', name: '1 Chroniques', englishName: '1 Chronicles', chapters: 29, testament: 'AT', bollsNumber: 13, apiBibleId: '1CH' },
  { id: '2 chroniques', name: '2 Chroniques', englishName: '2 Chronicles', chapters: 36, testament: 'AT', bollsNumber: 14, apiBibleId: '2CH' },
  { id: 'esdras', name: 'Esdras', englishName: 'Ezra', chapters: 10, testament: 'AT', bollsNumber: 15, apiBibleId: 'EZR' },
  { id: 'néhémie', name: 'Néhémie', englishName: 'Nehemiah', chapters: 13, testament: 'AT', bollsNumber: 16, apiBibleId: 'NEH' },
  { id: 'esther', name: 'Esther', englishName: 'Esther', chapters: 10, testament: 'AT', bollsNumber: 17, apiBibleId: 'EST' },
  { id: 'job', name: 'Job', englishName: 'Job', chapters: 42, testament: 'AT', bollsNumber: 18, apiBibleId: 'JOB' },
  { id: 'psaumes', name: 'Psaumes', englishName: 'Psalms', chapters: 150, testament: 'AT', bollsNumber: 19, apiBibleId: 'PSA' },
  { id: 'proverbes', name: 'Proverbes', englishName: 'Proverbs', chapters: 31, testament: 'AT', bollsNumber: 20, apiBibleId: 'PRO' },
  { id: 'ecclésiaste', name: 'Ecclésiaste', englishName: 'Ecclesiastes', chapters: 12, testament: 'AT', bollsNumber: 21, apiBibleId: 'ECC' },
  { id: 'cantique', name: 'Cantique des Cantiques', englishName: 'Song of Solomon', chapters: 8, testament: 'AT', bollsNumber: 22, apiBibleId: 'SNG' },
  { id: 'ésaïe', name: 'Ésaïe', englishName: 'Isaiah', chapters: 66, testament: 'AT', bollsNumber: 23, apiBibleId: 'ISA' },
  { id: 'jérémie', name: 'Jérémie', englishName: 'Jeremiah', chapters: 52, testament: 'AT', bollsNumber: 24, apiBibleId: 'JER' },
  { id: 'lamentations', name: 'Lamentations', englishName: 'Lamentations', chapters: 5, testament: 'AT', bollsNumber: 25, apiBibleId: 'LAM' },
  { id: 'ézéchiel', name: 'Ézéchiel', englishName: 'Ezekiel', chapters: 48, testament: 'AT', bollsNumber: 26, apiBibleId: 'EZK' },
  { id: 'daniel', name: 'Daniel', englishName: 'Daniel', chapters: 12, testament: 'AT', bollsNumber: 27, apiBibleId: 'DAN' },
  { id: 'osée', name: 'Osée', englishName: 'Hosea', chapters: 14, testament: 'AT', bollsNumber: 28, apiBibleId: 'HOS' },
  { id: 'joël', name: 'Joël', englishName: 'Joel', chapters: 3, testament: 'AT', bollsNumber: 29, apiBibleId: 'JOL' },
  { id: 'amos', name: 'Amos', englishName: 'Amos', chapters: 9, testament: 'AT', bollsNumber: 30, apiBibleId: 'AMO' },
  { id: 'abdias', name: 'Abdias', englishName: 'Obadiah', chapters: 1, testament: 'AT', bollsNumber: 31, apiBibleId: 'OBA' },
  { id: 'jonas', name: 'Jonas', englishName: 'Jonah', chapters: 4, testament: 'AT', bollsNumber: 32, apiBibleId: 'JON' },
  { id: 'michée', name: 'Michée', englishName: 'Micah', chapters: 7, testament: 'AT', bollsNumber: 33, apiBibleId: 'MIC' },
  { id: 'nahum', name: 'Nahum', englishName: 'Nahum', chapters: 3, testament: 'AT', bollsNumber: 34, apiBibleId: 'NAM' },
  { id: 'habacuc', name: 'Habacuc', englishName: 'Habakkuk', chapters: 3, testament: 'AT', bollsNumber: 35, apiBibleId: 'HAB' },
  { id: 'sophonie', name: 'Sophonie', englishName: 'Zephaniah', chapters: 3, testament: 'AT', bollsNumber: 36, apiBibleId: 'ZEP' },
  { id: 'aggée', name: 'Aggée', englishName: 'Haggai', chapters: 2, testament: 'AT', bollsNumber: 37, apiBibleId: 'HAG' },
  { id: 'zacharie', name: 'Zacharie', englishName: 'Zechariah', chapters: 14, testament: 'AT', bollsNumber: 38, apiBibleId: 'ZEC' },
  { id: 'malachie', name: 'Malachie', englishName: 'Malachi', chapters: 4, testament: 'AT', bollsNumber: 39, apiBibleId: 'MAL' },
  { id: 'matthieu', name: 'Matthieu', englishName: 'Matthew', chapters: 28, testament: 'NT', bollsNumber: 40, apiBibleId: 'MAT' },
  { id: 'marc', name: 'Marc', englishName: 'Mark', chapters: 16, testament: 'NT', bollsNumber: 41, apiBibleId: 'MRK' },
  { id: 'luc', name: 'Luc', englishName: 'Luke', chapters: 24, testament: 'NT', bollsNumber: 42, apiBibleId: 'LUK' },
  { id: 'jean', name: 'Jean', englishName: 'John', chapters: 21, testament: 'NT', bollsNumber: 43, apiBibleId: 'JHN' },
  { id: 'actes', name: 'Actes des Apôtres', englishName: 'Acts', chapters: 28, testament: 'NT', bollsNumber: 44, apiBibleId: 'ACT' },
  { id: 'romains', name: 'Romains', englishName: 'Romans', chapters: 16, testament: 'NT', bollsNumber: 45, apiBibleId: 'ROM' },
  { id: '1 corinthiens', name: '1 Corinthiens', englishName: '1 Corinthians', chapters: 16, testament: 'NT', bollsNumber: 46, apiBibleId: '1CO' },
  { id: '2 corinthiens', name: '2 Corinthiens', englishName: '2 Corinthians', chapters: 13, testament: 'NT', bollsNumber: 47, apiBibleId: '2CO' },
  { id: 'galates', name: 'Galates', englishName: 'Galatians', chapters: 6, testament: 'NT', bollsNumber: 48, apiBibleId: 'GAL' },
  { id: 'éphésiens', name: 'Éphésiens', englishName: 'Ephesians', chapters: 6, testament: 'NT', bollsNumber: 49, apiBibleId: 'EPH' },
  { id: 'philippiens', name: 'Philippiens', englishName: 'Philippians', chapters: 4, testament: 'NT', bollsNumber: 50, apiBibleId: 'PHP' },
  { id: 'colossiens', name: 'Colossiens', englishName: 'Colossians', chapters: 4, testament: 'NT', bollsNumber: 51, apiBibleId: 'COL' },
  { id: '1 thessaloniciens', name: '1 Thessaloniciens', englishName: '1 Thessalonians', chapters: 5, testament: 'NT', bollsNumber: 52, apiBibleId: '1TH' },
  { id: '2 thessaloniciens', name: '2 Thessaloniciens', englishName: '2 Thessalonians', chapters: 3, testament: 'NT', bollsNumber: 53, apiBibleId: '2TH' },
  { id: '1 timothée', name: '1 Timothée', englishName: '1 Timothy', chapters: 6, testament: 'NT', bollsNumber: 54, apiBibleId: '1TI' },
  { id: '2 timothée', name: '2 Timothée', englishName: '2 Timothy', chapters: 4, testament: 'NT', bollsNumber: 55, apiBibleId: '2TI' },
  { id: 'tite', name: 'Tite', englishName: 'Titus', chapters: 3, testament: 'NT', bollsNumber: 56, apiBibleId: 'TIT' },
  { id: 'philémon', name: 'Philémon', englishName: 'Philemon', chapters: 1, testament: 'NT', bollsNumber: 57, apiBibleId: 'PHM' },
  { id: 'hébreux', name: 'Hébreux', englishName: 'Hebrews', chapters: 13, testament: 'NT', bollsNumber: 58, apiBibleId: 'HEB' },
  { id: 'jacques', name: 'Jacques', englishName: 'James', chapters: 5, testament: 'NT', bollsNumber: 59, apiBibleId: 'JAS' },
  { id: '1 pierre', name: '1 Pierre', englishName: '1 Peter', chapters: 5, testament: 'NT', bollsNumber: 60, apiBibleId: '1PE' },
  { id: '2 pierre', name: '2 Pierre', englishName: '2 Peter', chapters: 3, testament: 'NT', bollsNumber: 61, apiBibleId: '2PE' },
  { id: '1 jean', name: '1 Jean', englishName: '1 John', chapters: 5, testament: 'NT', bollsNumber: 62, apiBibleId: '1JN' },
  { id: '2 jean', name: '2 Jean', englishName: '2 John', chapters: 1, testament: 'NT', bollsNumber: 63, apiBibleId: '2JN' },
  { id: '3 jean', name: '3 Jean', englishName: '3 John', chapters: 1, testament: 'NT', bollsNumber: 64, apiBibleId: '3JN' },
  { id: 'jude', name: 'Jude', englishName: 'Jude', chapters: 1, testament: 'NT', bollsNumber: 65, apiBibleId: 'JUD' },
  { id: 'apocalypse', name: 'Apocalypse', englishName: 'Revelation', chapters: 22, testament: 'NT', bollsNumber: 66, apiBibleId: 'REV' },
];

const BASE_TRANSLATIONS: BibleTranslation[] = [
  { id: 'lsg', name: 'Louis Segond 1910', language: 'fr', short: 'LSG', source: 'bolls', sourceId: 'FRLSG', searchSupported: true },
  { id: 'darby', name: 'Darby (Français)', language: 'fr', short: 'DBY', source: 'bolls', sourceId: 'FRDBY', searchSupported: true },
  { id: 'kjv', name: 'King James Version', language: 'en', short: 'KJV', source: 'bible-api', sourceId: 'kjv', searchSupported: true },
  { id: 'web', name: 'World English Bible', language: 'en', short: 'WEB', source: 'bible-api', sourceId: 'web', searchSupported: true },
  {
    id: 'bbe',
    name: 'Bible in Basic English',
    language: 'en',
    short: 'BBE',
    source: 'bible-api',
    sourceId: 'bbe',
    searchSupported: false,
    note: 'Lecture prise en charge, recherche textuelle non garantie par la source utilisée.'
  },
];

export const FEATURED_TRANSLATIONS: BibleTranslation[] = [
  ...BASE_TRANSLATIONS,
  ...(API_BIBLE_KEY ? OPTIONAL_API_BIBLE_TRANSLATIONS : []),
];

export const UNAVAILABLE_TRANSLATIONS = API_BIBLE_KEY ? [] : OPTIONAL_API_BIBLE_TRANSLATIONS;

const normalizeBookId = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

const BOOK_ALIASES = new Map<string, BibleBook>();
BIBLE_BOOKS.forEach((book) => {
  [book.id, book.name, book.englishName].forEach((key) => BOOK_ALIASES.set(normalizeBookId(key), book));
});

export const getBook = (bookId: string): BibleBook | undefined => {
  return BOOK_ALIASES.get(normalizeBookId(bookId));
};

export const getTranslationInfo = (translationId: string): BibleTranslation | undefined => {
  return FEATURED_TRANSLATIONS.find((translation) => translation.id === translationId);
};

export const supportsSearch = (translationId: string) => {
  return Boolean(getTranslationInfo(translationId)?.searchSupported);
};

class BibleApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BibleApiError';
  }
}

const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new BibleApiError('Connexion impossible. Vérifiez votre réseau puis réessayez.');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new BibleApiError('Accès refusé par la source biblique. Vérifiez la configuration des clés API.');
    }
    if (response.status === 404) {
      throw new BibleApiError('Passage introuvable dans cette traduction.');
    }
    throw new BibleApiError(`La source biblique a répondu avec une erreur ${response.status}.`);
  }

  try {
    return await response.json();
  } catch {
    throw new BibleApiError('Réponse invalide reçue depuis la source biblique.');
  }
};

const parseScriptureApiVerses = (content: string, book: BibleBook, chapter: number): Verse[] => {
  if (!content || typeof document === 'undefined') return [];

  const div = document.createElement('div');
  div.innerHTML = content;
  const verseNodes = div.querySelectorAll('[data-verse-id]');
  const verses: Verse[] = [];

  verseNodes.forEach((node) => {
    const verseId = node.getAttribute('data-verse-id') || '';
    const [, , verseStr] = verseId.split('.');
    const verseNumber = Number.parseInt(verseStr, 10);
    if (!Number.isFinite(verseNumber)) return;

    const clone = node.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.v, .label').forEach((label) => label.remove());
    const text = clone.textContent?.replace(/\s+/g, ' ').trim();
    if (!text) return;

    verses.push({
      book_id: book.id,
      book_name: book.name,
      chapter,
      verse: verseNumber,
      text,
    });
  });

  return verses;
};

const validateChapter = (book: BibleBook, chapter: number) => {
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    throw new BibleApiError(`${book.name} ne contient pas le chapitre ${chapter}.`);
  }
};

export const getChapter = async (
  translationId: string,
  bookId: string,
  chapter: number
): Promise<Verse[]> => {
  const translation = getTranslationInfo(translationId);
  if (!translation) {
    throw new BibleApiError('Cette traduction n’est pas disponible dans la configuration actuelle.');
  }

  const book = getBook(bookId);
  if (!book) {
    throw new BibleApiError(`Livre biblique inconnu : ${bookId}.`);
  }

  validateChapter(book, chapter);

  if (translation.source === 'bolls') {
    const data = await fetchJson<Array<{ pk: number; verse: number; text: string }>>(
      `https://bolls.life/get-chapter/${translation.sourceId}/${book.bollsNumber}/${chapter}/`
    );

    return data.map((verse) => ({
      book_id: book.id,
      book_name: book.name,
      chapter,
      verse: verse.verse,
      text: verse.text.replace(/<[^>]+>/g, '').trim(),
    }));
  }

  if (translation.source === 'bible-api') {
    const chapterRef = book.chapters === 1 ? book.englishName : `${book.englishName} ${chapter}`;
    const singleChapterParam = book.chapters === 1 ? '&single_chapter_book_matching=indifferent' : '';
    const data = await fetchJson<{ verses?: Array<{ book_id?: string; book_name?: string; chapter: number; verse: number; text: string }> }>(
      `/bible-api/${encodeURIComponent(chapterRef)}?translation=${translation.sourceId}${singleChapterParam}`
    );

    if (!data.verses?.length) {
      throw new BibleApiError('Aucun verset reçu pour ce chapitre.');
    }

    return data.verses.map((verse) => ({
      book_id: book.id,
      book_name: book.name,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text.trim(),
    }));
  }

  if (translation.source === 'api-bible') {
    if (!API_BIBLE_KEY) {
      throw new BibleApiError('Cette traduction nécessite VITE_BIBLE_API_KEY. Elle est masquée tant que la clé n’est pas configurée.');
    }
    if (!book.apiBibleId) {
      throw new BibleApiError('Ce livre n’est pas encore mappé pour API.Bible.');
    }

    const data = await fetchJson<{ data?: { content?: string } }>(
      `/bible-proxy/bibles/${translation.sourceId}/chapters/${book.apiBibleId}.${chapter}?content-type=html&include-verse-numbers=true`,
      { headers: { 'api-key': API_BIBLE_KEY } }
    );

    const verses = parseScriptureApiVerses(data.data?.content || '', book, chapter);
    if (!verses.length) {
      throw new BibleApiError('La source API.Bible n’a pas retourné de versets exploitables.');
    }

    return verses;
  }

  throw new BibleApiError('Source biblique non reconnue.');
};

const SEARCH_TRANSLATION_MAP: Record<string, string> = {
  lsg: 'FRLSG',
  darby: 'FRDBY',
  kjv: 'KJV',
  web: 'WEB',
};

const getBookByBollsNumber = (bookNumber: number): BibleBook | undefined => {
  return BIBLE_BOOKS.find((book) => book.bollsNumber === bookNumber);
};

export const searchVerses = async (
  translationId: string,
  query: string
): Promise<SearchResult[]> => {
  const translation = getTranslationInfo(translationId);
  if (!translation) {
    throw new BibleApiError('Cette traduction n’est pas disponible dans la configuration actuelle.');
  }

  if (!translation.searchSupported || !SEARCH_TRANSLATION_MAP[translationId]) {
    throw new BibleApiError(`La recherche textuelle n’est pas disponible pour ${translation.short}. Changez de traduction pour rechercher.`);
  }

  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) {
    throw new BibleApiError('La recherche doit contenir au moins deux caractères.');
  }

  const data = await fetchJson<Array<{ book: number; chapter: number; verse: number; text: string }>>(
    `https://bolls.life/search/${SEARCH_TRANSLATION_MAP[translationId]}/?search=${encodeURIComponent(cleanQuery)}&match_case=false&match_whole_word=false`
  );

  return data.map((result) => {
    const book = getBookByBollsNumber(result.book);
    const bookId = book?.id || 'genese';
    const bookName = book?.name || bookId;

    return {
      reference: `${bookName} ${result.chapter}:${result.verse}`,
      text: result.text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      translation_id: translationId,
      book_id: bookId,
      chapter_id: String(result.chapter),
    };
  });
};

export const getTranslationLabel = (translationId: string) => {
  const translation = getTranslationInfo(translationId);
  return translation ? `${translation.short} · ${translation.name}` : translationId.toUpperCase();
};
