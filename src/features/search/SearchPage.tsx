import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight, Loader2, Clock } from 'lucide-react';
import { searchVerses, FEATURED_TRANSLATIONS, BIBLE_BOOKS, supportsSearch } from '../../utils/bibleApi';
import type { SearchResult } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';

const HISTORY_KEY = 'omed_bible_search_history';

const getHistory = () => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) as string[] : [];
  } catch {
    return [];
  }
};

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>(getHistory);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);
  const translation = settings.defaultTranslation;

  const translationName = useMemo(() => {
    return FEATURED_TRANSLATIONS.find((t) => t.id === translation)?.short || translation.toUpperCase();
  }, [translation]);

  const canSearch = supportsSearch(translation);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const saveHistory = (value: string) => {
    setHistory((current) => [value, ...current.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 8));
  };

  const runSearch = async (value: string) => {
    const cleanQuery = value.trim();
    if (!cleanQuery) return;

    setQuery(cleanQuery);
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchVerses(translation, cleanQuery);
      setResults(data);
      saveHistory(cleanQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La recherche n’a pas abouti.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSearch(query);
  };

  const navigateToVerse = (bookId: string, chapterId: string) => {
    const chapterNum = chapterId.includes('.') ? chapterId.split('.')[1] : chapterId;
    const apiBookToLocal = BIBLE_BOOKS.find((b) => b.id.toLowerCase().startsWith(bookId.toLowerCase()))?.id || bookId.toLowerCase();
    navigate(`/read/${translation}/${apiBookToLocal}/${chapterNum}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 text-text-primary">Recherche biblique</h1>
        <p className="text-text-secondary">Trouvez rapidement un verset et ouvrez le chapitre pour lire le contexte.</p>
      </header>

      <form onSubmit={handleSearch} className="mb-6 rounded-2xl border border-border bg-bg-card/60 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1" htmlFor="bible-search-input">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              id="bible-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Exemple : amour, pardon, sagesse"
              aria-label="Recherche biblique"
              className="w-full bg-bg-primary border border-border rounded-xl py-3.5 pl-11 pr-4 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !query.trim() || !canSearch}
            className="inline-flex items-center justify-center gap-2 min-w-36 bg-accent-gold text-white px-5 py-3.5 rounded-xl font-medium hover:bg-accent-brown transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Recherche…' : 'Rechercher'}
          </button>
        </div>
        <p className="mt-3 text-xs text-text-muted">Traduction utilisée : {translationName}</p>
      </form>

      {!canSearch && (
        <div className="mb-6">
          <ErrorState title="Recherche indisponible" message={`La recherche textuelle n’est pas disponible pour ${translationName}. Choisissez LSG, Darby, KJV ou WEB dans les préférences.`} />
        </div>
      )}

      {history.length > 0 && (
        <section className="mb-8 rounded-2xl border border-border bg-bg-card/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-text-muted"><Clock size={15} /> Recherches récentes</h2>
            <button type="button" onClick={() => setHistory([])} className="text-xs text-text-muted hover:text-red-600">Effacer</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((item) => <button key={item} type="button" onClick={() => runSearch(item)} className="rounded-full border border-border bg-bg-primary px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary">{item}</button>)}
          </div>
        </section>
      )}

      {error && <div className="mb-6"><ErrorState title="Recherche impossible" message={error} /></div>}

      <section className="space-y-4">
        {loading && <div className="p-5 rounded-lg border border-border bg-bg-card text-text-secondary">Recherche en cours, merci de patienter.</div>}
        {!loading && results.length > 0 && <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">{results.length} résultat{results.length > 1 ? 's' : ''}</h2>}
        {!loading && !error && !hasSearched && <EmptyState title="Lancez une recherche" message="Essayez un thème simple comme foi, paix, pardon ou sagesse." />}
        {!loading && !error && hasSearched && results.length === 0 && <EmptyState title="Aucun passage trouvé" message="Affinez votre recherche avec un mot plus précis ou une autre formulation." />}
        {results.map((result) => (
          <article key={`${result.reference}-${result.text.slice(0, 16)}`} className="bg-bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="font-display font-semibold text-xl text-text-primary">{result.reference}</h3>
              <span className="text-xs font-medium text-accent-brown bg-accent-gold/10 px-2.5 py-1 rounded">{translationName}</span>
            </div>
            <p className="font-body text-text-secondary leading-relaxed mb-4">{result.text}</p>
            <button type="button" onClick={() => navigateToVerse(result.book_id, result.chapter_id)} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-brown hover:text-accent-gold transition-colors">
              Lire le chapitre <ChevronRight size={16} />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};
