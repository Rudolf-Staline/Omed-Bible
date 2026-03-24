import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';
import { searchVerses, FEATURED_TRANSLATIONS, BIBLE_BOOKS } from '../../utils/bibleApi';
import type { SearchResult } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);
  const translation = settings.defaultTranslation;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchVerses(translation, query);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const navigateToVerse = (bookId: string, chapterId: string) => {
    // chapterId format usually looks like "JHN.3"
    const [, chapterNum] = chapterId.split('.');
    
    // Find our canonical book id
    const apiBookToLocal = BIBLE_BOOKS.find(b => b.id.toLowerCase().startsWith(bookId.toLowerCase()))?.id || bookId.toLowerCase();

    navigate(`/read/${translation}/${apiBookToLocal}/${chapterNum}`);
  };

  const getTranslationName = (id: string) => {
    return FEATURED_TRANSLATIONS.find(t => t.id === id)?.short || id.toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-8 text-text-primary">Rechercher</h1>

      <form onSubmit={handleSearch} className="relative mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un mot, une phrase, un passage..."
          className="w-full bg-bg-card border border-border rounded-xl py-4 pl-12 pr-4 text-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/50 shadow-sm transition-shadow"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={24} />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent-gold text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-brown transition-colors disabled:opacity-50"
        >
          {loading ? 'Recherche...' : 'Chercher'}
        </button>
      </form>

      {error && <div className="text-red-500 mb-8 p-4 bg-red-50 rounded-lg">{error}</div>}

      <div className="space-y-6">
        {results.length > 0 && <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">{results.length} résultats trouvés</h2>}
        
        {results.map((result, idx) => (
          <div key={idx} className="bg-bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-display font-semibold text-lg text-text-primary">
                {result.reference}
              </h3>
              <span className="text-xs font-mono font-medium text-accent-gold bg-accent-gold/10 px-2 py-1 rounded">
                {getTranslationName(translation)}
              </span>
            </div>
            <p className="font-body text-text-secondary mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: result.text }} />
            <button
              onClick={() => navigateToVerse(result.book_id, result.chapter_id)}
              className="flex items-center gap-1 text-sm font-medium text-accent-brown hover:text-accent-gold transition-colors"
            >
              Lire le contexte <ChevronRight size={16} />
            </button>
          </div>
        ))}

        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <p className="text-lg">Aucun résultat trouvé pour "{query}".</p>
            <p className="text-sm mt-2">Essayez d'utiliser d'autres mots-clés ou de changer de version.</p>
          </div>
        )}
      </div>
    </div>
  );
};
