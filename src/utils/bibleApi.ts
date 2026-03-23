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

// Versions utilisant bible-api.com
const BIBLE_API_VERSIONS = ['lsg', 'ost', 'kjv', 'web', 'bbe'];

// Versions utilisant API.Bible
const SCRIPTURE_API_VERSIONS: Record<string, string> = {
  niv: '06125adad2d5898a-01', // NIV
  esv: 'f421fe261da7624f-01', // ESV
  nlt: '65eec8e0b60e656b-01', // NLT
};


// bible-api.com CORS can be flaky — always use proxy (Vite in dev, Vercel rewrite in prod)
const BIBLE_API_BASE = '/bible-api';

// API.Bible also through proxy to avoid CORS/preflight issues
const SCRIPTURE_API_BASE = '/bible-proxy';

const parseScriptureApiVerses = (content: string): Verse[] => {
  if (!content) return [];
  // Parse the HTML content from API.Bible into a plain list of verses
  // For simplicity, we create a temporary DOM element (if in browser)
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = content;
    const verses: Verse[] = [];

    // api.bible returns verses in <p class="p"> containing span.v (verse numbers) and span.nd (text), etc.
    // This is a simplified extraction:
    const verseElements = div.querySelectorAll('[data-verse-id]');

    verseElements.forEach(el => {
      const verseId = el.getAttribute('data-verse-id') || '';
      const [bookId, chapterStr, verseStr] = verseId.split('.');
      if (bookId && chapterStr && verseStr) {
         // remove the verse number span if it exists to get just the text
         const clone = el.cloneNode(true) as HTMLElement;
         const vNum = clone.querySelector('.v');
         if (vNum) vNum.remove();

         verses.push({
           book_id: bookId,
           book_name: bookId, // Will need mapping in real app
           chapter: parseInt(chapterStr, 10),
           verse: parseInt(verseStr, 10),
           text: clone.textContent?.trim() || ''
         });
      }
    });

    // Group contiguous verses if they end up being split by the parser
    const mergedVerses: Verse[] = [];
    verses.forEach(v => {
      const last = mergedVerses[mergedVerses.length - 1];
      if (last && last.verse === v.verse) {
        last.text += ' ' + v.text;
      } else {
        mergedVerses.push(v);
      }
    });

    return mergedVerses;
  }
  return [];
};

const BIBLE_API_CODES: Record<string, string> = {
  'genese': 'GEN', 'exode': 'EXO', 'levitique': 'LEV', 'nombres': 'NUM', 'deutéronome': 'DEU',
  'josué': 'JOS', 'juges': 'JDG', 'ruth': 'RUT', '1 samuel': '1SA', '2 samuel': '2SA',
  '1 rois': '1KI', '2 rois': '2KI', '1 chroniques': '1CH', '2 chroniques': '2CH',
  'esdras': 'EZR', 'néhémie': 'NEH', 'esther': 'EST', 'job': 'JOB', 'psaumes': 'PSA',
  'proverbes': 'PRO', 'ecclésiaste': 'ECC', 'cantique': 'SNG', 'ésaïe': 'ISA',
  'jérémie': 'JER', 'lamentations': 'LAM', 'ézéchiel': 'EZK', 'daniel': 'DAN',
  'osée': 'HOS', 'joël': 'JOL', 'amos': 'AMO', 'abdias': 'OBA', 'jonas': 'JON',
  'michée': 'MIC', 'nahum': 'NAM', 'habacuc': 'HAB', 'sophonie': 'ZEP', 'aggée': 'HAG',
  'zacharie': 'ZEC', 'malachie': 'MAL', 'matthieu': 'MAT', 'marc': 'MRK', 'luc': 'LUK',
  'jean': 'JHN', 'actes': 'ACT', 'romains': 'ROM', '1 corinthiens': '1CO',
  '2 corinthiens': '2CO', 'galates': 'GAL', 'éphésiens': 'EPH', 'philippiens': 'PHP',
  'colossiens': 'COL', '1 thessaloniciens': '1TH', '2 thessaloniciens': '2TH',
  '1 timothée': '1TI', '2 timothée': '2TI', 'tite': 'TIT', 'philémon': 'PHM',
  'hébreux': 'HEB', 'jacques': 'JAS', '1 pierre': '1PE', '2 pierre': '2PE',
  '1 jean': '1JN', '2 jean': '2JN', '3 jean': '3JN', 'jude': 'JUD', 'apocalypse': 'REV'
};

export const getChapter = async (
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[]> => {
  if (BIBLE_API_VERSIONS.includes(translation)) {
    // bible-api.com - using the more precise /data endpoint
    const bookCode = BIBLE_API_CODES[book.toLowerCase()] || book;
    
    // For single chapter books, API suggests this param (though /data format might not need it, we follow doc)
    const singleChapterBooks = ['abdias', 'philémon', '2 jean', '3 jean', 'jude'];
    const extraParams = singleChapterBooks.includes(book.toLowerCase()) 
      ? '?single_chapter_book_matching=indifferent' 
      : '';

    const res = await fetch(
      `${BIBLE_API_BASE}/data/${translation}/${encodeURIComponent(bookCode)}/${chapter}${extraParams}`
    );
    if (!res.ok) throw new Error('Failed to fetch chapter');
    const data = await res.json();
    return data.verses || [];
  } else {
    // API.Bible
    const bibleId = SCRIPTURE_API_VERSIONS[translation];
    const chapterId = `${book.toUpperCase()}.${chapter}`;
    const res = await fetch(
      `${SCRIPTURE_API_BASE}/bibles/${bibleId}/chapters/${chapterId}?content-type=html&include-verse-numbers=true`,
      { headers: { 'api-key': import.meta.env.VITE_BIBLE_API_KEY || '' } }
    );
    if (!res.ok) throw new Error('Failed to fetch chapter');
    const data = await res.json();
    return parseScriptureApiVerses(data.data?.content);
  }
};

const searchLocalCache = async (_query: string, translation: string): Promise<SearchResult[]> => {
  // Mock fallback search for bible-api.com (since it doesn't support search)
  // In a real app, you might index fetched verses or use a separate search service
  console.warn(`Search not natively supported for ${translation} on bible-api.com. Fallback returning empty.`);
  return [];
};

export const searchVerses = async (
  translation: string,
  query: string
): Promise<SearchResult[]> => {
  if (BIBLE_API_VERSIONS.includes(translation)) {
    return searchLocalCache(query, translation);
  } else {
    const bibleId = SCRIPTURE_API_VERSIONS[translation];
    const res = await fetch(
      `${SCRIPTURE_API_BASE}/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=20`,
      { headers: { 'api-key': import.meta.env.VITE_BIBLE_API_KEY || '' } }
    );
    if (!res.ok) throw new Error('Failed to search');
    const data = await res.json();
    return data.data?.verses || [];
  }
};

// Liste des livres de la Bible
export const BIBLE_BOOKS = [
  // Ancien Testament
  { id: 'genese', name: 'Genèse', chapters: 50, testament: 'AT' },
  { id: 'exode', name: 'Exode', chapters: 40, testament: 'AT' },
  { id: 'levitique', name: 'Lévitique', chapters: 27, testament: 'AT' },
  { id: 'nombres', name: 'Nombres', chapters: 36, testament: 'AT' },
  { id: 'deutéronome', name: 'Deutéronome', chapters: 34, testament: 'AT' },
  { id: 'josué', name: 'Josué', chapters: 24, testament: 'AT' },
  { id: 'juges', name: 'Juges', chapters: 21, testament: 'AT' },
  { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'AT' },
  { id: '1 samuel', name: '1 Samuel', chapters: 31, testament: 'AT' },
  { id: '2 samuel', name: '2 Samuel', chapters: 24, testament: 'AT' },
  { id: '1 rois', name: '1 Rois', chapters: 22, testament: 'AT' },
  { id: '2 rois', name: '2 Rois', chapters: 25, testament: 'AT' },
  { id: '1 chroniques', name: '1 Chroniques', chapters: 29, testament: 'AT' },
  { id: '2 chroniques', name: '2 Chroniques', chapters: 36, testament: 'AT' },
  { id: 'esdras', name: 'Esdras', chapters: 10, testament: 'AT' },
  { id: 'néhémie', name: 'Néhémie', chapters: 13, testament: 'AT' },
  { id: 'esther', name: 'Esther', chapters: 10, testament: 'AT' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'AT' },
  { id: 'psaumes', name: 'Psaumes', chapters: 150, testament: 'AT' },
  { id: 'proverbes', name: 'Proverbes', chapters: 31, testament: 'AT' },
  { id: 'ecclésiaste', name: 'Ecclésiaste', chapters: 12, testament: 'AT' },
  { id: 'cantique', name: 'Cantique des Cantiques', chapters: 8, testament: 'AT' },
  { id: 'ésaïe', name: 'Ésaïe', chapters: 66, testament: 'AT' },
  { id: 'jérémie', name: 'Jérémie', chapters: 52, testament: 'AT' },
  { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'AT' },
  { id: 'ézéchiel', name: 'Ézéchiel', chapters: 48, testament: 'AT' },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'AT' },
  { id: 'osée', name: 'Osée', chapters: 14, testament: 'AT' },
  { id: 'joël', name: 'Joël', chapters: 3, testament: 'AT' },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'AT' },
  { id: 'abdias', name: 'Abdias', chapters: 1, testament: 'AT' },
  { id: 'jonas', name: 'Jonas', chapters: 4, testament: 'AT' },
  { id: 'michée', name: 'Michée', chapters: 7, testament: 'AT' },
  { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'AT' },
  { id: 'habacuc', name: 'Habacuc', chapters: 3, testament: 'AT' },
  { id: 'sophonie', name: 'Sophonie', chapters: 3, testament: 'AT' },
  { id: 'aggée', name: 'Aggée', chapters: 2, testament: 'AT' },
  { id: 'zacharie', name: 'Zacharie', chapters: 14, testament: 'AT' },
  { id: 'malachie', name: 'Malachie', chapters: 4, testament: 'AT' },
  // Nouveau Testament
  { id: 'matthieu', name: 'Matthieu', chapters: 28, testament: 'NT' },
  { id: 'marc', name: 'Marc', chapters: 16, testament: 'NT' },
  { id: 'luc', name: 'Luc', chapters: 24, testament: 'NT' },
  { id: 'jean', name: 'Jean', chapters: 21, testament: 'NT' },
  { id: 'actes', name: 'Actes des Apôtres', chapters: 28, testament: 'NT' },
  { id: 'romains', name: 'Romains', chapters: 16, testament: 'NT' },
  { id: '1 corinthiens', name: '1 Corinthiens', chapters: 16, testament: 'NT' },
  { id: '2 corinthiens', name: '2 Corinthiens', chapters: 13, testament: 'NT' },
  { id: 'galates', name: 'Galates', chapters: 6, testament: 'NT' },
  { id: 'éphésiens', name: 'Éphésiens', chapters: 6, testament: 'NT' },
  { id: 'philippiens', name: 'Philippiens', chapters: 4, testament: 'NT' },
  { id: 'colossiens', name: 'Colossiens', chapters: 4, testament: 'NT' },
  { id: '1 thessaloniciens', name: '1 Thessaloniciens', chapters: 5, testament: 'NT' },
  { id: '2 thessaloniciens', name: '2 Thessaloniciens', chapters: 3, testament: 'NT' },
  { id: '1 timothée', name: '1 Timothée', chapters: 6, testament: 'NT' },
  { id: '2 timothée', name: '2 Timothée', chapters: 4, testament: 'NT' },
  { id: 'tite', name: 'Tite', chapters: 3, testament: 'NT' },
  { id: 'philémon', name: 'Philémon', chapters: 1, testament: 'NT' },
  { id: 'hébreux', name: 'Hébreux', chapters: 13, testament: 'NT' },
  { id: 'jacques', name: 'Jacques', chapters: 5, testament: 'NT' },
  { id: '1 pierre', name: '1 Pierre', chapters: 5, testament: 'NT' },
  { id: '2 pierre', name: '2 Pierre', chapters: 3, testament: 'NT' },
  { id: '1 jean', name: '1 Jean', chapters: 5, testament: 'NT' },
  { id: '2 jean', name: '2 Jean', chapters: 1, testament: 'NT' },
  { id: '3 jean', name: '3 Jean', chapters: 1, testament: 'NT' },
  { id: 'jude', name: 'Jude', chapters: 1, testament: 'NT' },
  { id: 'apocalypse', name: 'Apocalypse', chapters: 22, testament: 'NT' },
];

export const FEATURED_TRANSLATIONS = [
  { id: 'lsg', name: 'Louis Segond 1910', language: 'fr', short: 'LSG', source: 'bible-api' },
  { id: 'ost', name: 'Ostervald', language: 'fr', short: 'OST', source: 'bible-api' },
  { id: 'kjv', name: 'King James Version', language: 'en', short: 'KJV', source: 'bible-api' },
  { id: 'web', name: 'World English Bible', language: 'en', short: 'WEB', source: 'bible-api' },
  { id: 'niv', name: 'New International Version', language: 'en', short: 'NIV', source: 'scripture-api' },
];
