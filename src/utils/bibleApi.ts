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

// Versions utilisant bolls.life (French translations — reliable, CORS enabled)
const BOLLS_VERSIONS: Record<string, string> = {
  lsg: 'FRLSG',    // Bible Segond 1910
  darby: 'FRDBY',  // Darby (French) 1890
};

// Versions utilisant bible-api.com (English translations only)
const BIBLE_API_VERSIONS = ['kjv', 'web', 'bbe'];

// Versions utilisant API.Bible
const SCRIPTURE_API_VERSIONS: Record<string, string> = {
  niv: '06125adad2d5898a-01', // NIV
  esv: 'f421fe261da7624f-01', // ESV
  nlt: '65eec8e0b60e656b-01', // NLT
};

// Mapping French book IDs to getbible.net book numbers
const BOOK_NUMBERS: Record<string, number> = {
  'genese': 1, 'exode': 2, 'levitique': 3, 'nombres': 4, 'deutéronome': 5,
  'josué': 6, 'juges': 7, 'ruth': 8, '1 samuel': 9, '2 samuel': 10,
  '1 rois': 11, '2 rois': 12, '1 chroniques': 13, '2 chroniques': 14,
  'esdras': 15, 'néhémie': 16, 'esther': 17, 'job': 18, 'psaumes': 19,
  'proverbes': 20, 'ecclésiaste': 21, 'cantique': 22, 'ésaïe': 23,
  'jérémie': 24, 'lamentations': 25, 'ézéchiel': 26, 'ezechiel': 26, 'daniel': 27,
  'osée': 28, 'joël': 29, 'amos': 30, 'abdias': 31, 'jonas': 32,
  'michée': 33, 'nahum': 34, 'habacuc': 35, 'sophonie': 36, 'aggée': 37,
  'zacharie': 38, 'malachie': 39, 'matthieu': 40, 'marc': 41, 'luc': 42,
  'jean': 43, 'actes': 44, 'romains': 45, '1 corinthiens': 46,
  '2 corinthiens': 47, 'galates': 48, 'éphésiens': 49, 'philippiens': 50,
  'colossiens': 51, '1 thessaloniciens': 52, '2 thessaloniciens': 53,
  '1 timothée': 54, '2 timothée': 55, 'tite': 56, 'philémon': 57,
  'hébreux': 58, 'jacques': 59, '1 pierre': 60, '2 pierre': 61,
  '1 jean': 62, '2 jean': 63, '3 jean': 64, 'jude': 65, 'apocalypse': 66
};

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

const FRENCH_TO_ENGLISH_BOOKS: Record<string, string> = {
  'genese': 'Genesis',
  'exode': 'Exodus',
  'levitique': 'Leviticus',
  'nombres': 'Numbers',
  'deutéronome': 'Deuteronomy',
  'josué': 'Joshua',
  'juges': 'Judges',
  'ruth': 'Ruth',
  '1 samuel': '1 Samuel',
  '2 samuel': '2 Samuel',
  '1 rois': '1 Kings',
  '2 rois': '2 Kings',
  '1 chroniques': '1 Chronicles',
  '2 chroniques': '2 Chronicles',
  'esdras': 'Ezra',
  'néhémie': 'Nehemiah',
  'esther': 'Esther',
  'job': 'Job',
  'psaumes': 'Psalms',
  'proverbes': 'Proverbs',
  'ecclésiaste': 'Ecclesiastes',
  'cantique': 'Song of Solomon',
  'ésaïe': 'Isaiah',
  'jérémie': 'Jeremiah',
  'lamentations': 'Lamentations',
  'ézéchiel': 'Ezekiel',
  'ezechiel': 'Ezekiel',
  'daniel': 'Daniel',
  'osée': 'Hosea',
  'joël': 'Joel',
  'amos': 'Amos',
  'abdias': 'Obadiah',
  'jonas': 'Jonah',
  'michée': 'Micah',
  'nahum': 'Nahum',
  'habacuc': 'Habakkuk',
  'sophonie': 'Zephaniah',
  'aggée': 'Haggai',
  'zacharie': 'Zechariah',
  'malachie': 'Malachi',
  'matthieu': 'Matthew',
  'marc': 'Mark',
  'luc': 'Luke',
  'jean': 'John',
  'actes': 'Acts',
  'romains': 'Romans',
  '1 corinthiens': '1 Corinthians',
  '2 corinthiens': '2 Corinthians',
  'galates': 'Galatians',
  'éphésiens': 'Ephesians',
  'philippiens': 'Philippians',
  'colossiens': 'Colossians',
  '1 thessaloniciens': '1 Thessalonians',
  '2 thessaloniciens': '2 Thessalonians',
  '1 timothée': '1 Timothy',
  '2 timothée': '2 Timothy',
  'tite': 'Titus',
  'philémon': 'Philemon',
  'hébreux': 'Hebrews',
  'jacques': 'James',
  '1 pierre': '1 Peter',
  '2 pierre': '2 Peter',
  '1 jean': '1 John',
  '2 jean': '2 John',
  '3 jean': '3 John',
  'jude': 'Jude',
  'apocalypse': 'Revelation'
};

export const getChapter = async (
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[]> => {
  const bollsId = BOLLS_VERSIONS[translation];
  
  if (bollsId) {
    // bolls.life — for French translations (LSG, Darby)
    const bookNr = BOOK_NUMBERS[book.toLowerCase()];
    if (!bookNr) throw new Error(`Unknown book: ${book}`);
    
    const res = await fetch(
      `https://bolls.life/get-chapter/${bollsId}/${bookNr}/${chapter}/`
    );
    if (!res.ok) throw new Error('Failed to fetch chapter');
    const data = await res.json();
    
    // Transform bolls.life response to our Verse[] format
    // bolls.life returns [{pk, verse, text}, ...]
    return (data || []).map((v: { pk: number; verse: number; text: string }) => ({
      book_id: book.toLowerCase(),
      book_name: book,
      chapter: chapter,
      verse: v.verse,
      text: v.text.trim()
    }));
  } else if (BIBLE_API_VERSIONS.includes(translation)) {
    // bible-api.com — for English translations (KJV, WEB, BBE)
    const apiBookName = FRENCH_TO_ENGLISH_BOOKS[book.toLowerCase()] || book;

    const singleChapterBooks = ['abdias', 'philémon', '2 jean', '3 jean', 'jude'];
    const extraParams = singleChapterBooks.includes(book.toLowerCase()) 
      ? '&single_chapter_book_matching=indifferent' 
      : '';

    const res = await fetch(
      `/bible-api/${encodeURIComponent(apiBookName)}+${chapter}?translation=${translation}${extraParams}`
    );
    if (!res.ok) throw new Error('Failed to fetch chapter');
    const data = await res.json();
    return data.verses || [];
  } else {
    // API.Bible — for NIV, ESV, NLT
    const bibleId = SCRIPTURE_API_VERSIONS[translation];
    const chapterId = `${book.toUpperCase()}.${chapter}`;
    const res = await fetch(
      `/bible-proxy/bibles/${bibleId}/chapters/${chapterId}?content-type=html&include-verse-numbers=true`,
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
  const bollsId = BOLLS_VERSIONS[translation];
  
  if (bollsId || BIBLE_API_VERSIONS.includes(translation)) {
    // Neither getbible.net nor bible-api.com support search natively
    return searchLocalCache(query, translation);
  } else {
    const bibleId = SCRIPTURE_API_VERSIONS[translation];
    const res = await fetch(
      `/bible-proxy/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=20`,
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
  { id: 'lsg', name: 'Louis Segond 1910', language: 'fr', short: 'LSG', source: 'bolls' },
  { id: 'darby', name: 'Darby (Français)', language: 'fr', short: 'DBY', source: 'bolls' },
  { id: 'kjv', name: 'King James Version', language: 'en', short: 'KJV', source: 'bible-api' },
  { id: 'web', name: 'World English Bible', language: 'en', short: 'WEB', source: 'bible-api' },
  { id: 'niv', name: 'New International Version', language: 'en', short: 'NIV', source: 'scripture-api' },
];
