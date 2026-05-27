import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight, Loader2 } from 'lucide-react';
import { searchVerses, FEATURED_TRANSLATIONS, BIBLE_BOOKS } from '../../utils/bibleApi';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import type { SearchResult } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';

const SEARCH_DIRECT_TRANSLATIONS = ['lsg', 'darby', 'kjv', 'web', 'bbe'];

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
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

  const searchIsFallback = !SEARCH_DIRECT_TRANSLATIONS.includes(translation);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchVerses(translation, cleanQuery);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'La recherche n’a pas abouti. Veuillez réessayer.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToVerse = (bookId: string, chapterId: string) => {
    const chapterNum = chapterId.includes('.') ? chapterId.split('.')[1] : chapterId;
    const apiBookToLocal = BIBLE_BOOKS.find((b) => b.id.toLowerCase().startsWith(bookId.toLowerCase()))?.id || bookId.toLowerCase();
    navigate(`/read/${translation}/${apiBookToLocal}/${chapterNum}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-2 text-text-primary">Recherche biblique</h1>
      <p className="text-text-secondary mb-8">Trouvez rapidement un verset et ouvrez le chapitre pour lire le contexte.</p>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1" htmlFor="bible-search-input">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              id="bible-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Exemple : amour, pardon, Jean 3"
              aria-label="Recherche biblique"
              className="w-full bg-bg-card border border-border rounded-lg py-3.5 pl-11 pr-4 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex items-center justify-center gap-2 min-w-36 bg-accent-gold text-white px-5 py-3.5 rounded-lg font-medium hover:bg-accent-brown transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Recherche en cours' : 'Lancer la recherche'}
          </button>
        </div>
      </form>

      {searchIsFallback && (
        <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm leading-relaxed">
          La recherche textuelle n’est pas entièrement prise en charge pour la traduction <strong>{translationName}</strong>.
          Les résultats affichés utilisent une version de référence compatible pour éviter les interruptions.
        </div>
      )}

      {error && (
        <div className="mb-6 border border-border rounded-xl bg-bg-card">
          <ErrorState
            title="Une erreur est survenue."
            message={error}
            compact
          />
        </div>
      )}

      <section className="space-y-4">
        {loading && (
          <div className="border border-border rounded-xl bg-bg-card">
            <LoadingState
              title="Recherche en cours"
              message="Merci de patienter."
              compact
            />
          </div>
        )}

        {!loading && results.length > 0 && (
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">{results.length} résultat{results.length > 1 ? 's' : ''}</h2>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <div className="border border-border rounded-xl bg-bg-card">
            <EmptyState
              title="Aucun passage trouvé."
              message="Affinez votre recherche avec un mot plus précis ou une autre formulation."
              compact
            />
          </div>
        )}

        {results.map((result, idx) => (
          <article key={idx} className="bg-bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="font-display font-semibold text-xl text-text-primary">{result.reference}</h3>
              <span className="text-xs font-medium text-accent-brown bg-accent-gold/10 px-2.5 py-1 rounded">
                Traduction : {translationName}
              </span>
            </div>
            <p className="font-body text-text-secondary leading-relaxed mb-4">{result.text}</p>
            <button
              onClick={() => navigateToVerse(result.book_id, result.chapter_id)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-brown hover:text-accent-gold transition-colors"
            >
              Lire le chapitre
              <ChevronRight size={16} />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};
