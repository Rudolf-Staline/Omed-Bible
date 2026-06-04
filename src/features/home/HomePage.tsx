import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bookmark, Copy, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS, getChapter, getBook, getTranslationInfo } from '../../utils/bibleApi';
import type { Verse } from '../../utils/bibleApi';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';

const QUICK_LINKS = [
  { label: 'Recherche', to: '/search', description: 'Trouver rapidement un passage ou un mot-clé.' },
  { label: 'Collections', to: '/collections', description: 'Regrouper des versets par thème et intention.' },
  { label: 'Marque-pages', to: '/favorites', description: 'Retrouver les versets que vous avez sauvegardés.' },
  { label: 'Notes', to: '/notes', description: 'Relire vos réflexions et annotations personnelles.' },
  { label: 'Parcours', to: '/plans', description: 'Poursuivre vos plans de lecture en cours.' }
];

const DAILY_VERSES = [
  { bookId: 'jean', chapter: 3, verse: 16 },
  { bookId: 'psaumes', chapter: 23, verse: 1 },
  { bookId: 'romains', chapter: 8, verse: 28 },
  { bookId: 'matthieu', chapter: 6, verse: 33 },
  { bookId: 'proverbes', chapter: 3, verse: 5 },
  { bookId: 'ésaïe', chapter: 41, verse: 10 },
  { bookId: 'philippiens', chapter: 4, verse: 6 },
  { bookId: 'hébreux', chapter: 11, verse: 1 },
  { bookId: 'jacques', chapter: 1, verse: 5 },
  { bookId: '1 corinthiens', chapter: 13, verse: 4 }
];

const dayKey = () => new Date().toISOString().slice(0, 10);

const pickDailyVerse = () => {
  const today = dayKey();
  const seed = [...today].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return DAILY_VERSES[seed % DAILY_VERSES.length];
};

export const HomePage: React.FC = () => {
  const { translation, bookId, chapter } = useBibleStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(true);

  const currentBook = getBook(bookId) || BIBLE_BOOKS.find((book) => book.id === bookId) || BIBLE_BOOKS[0];
  const currentTranslation = getTranslationInfo(translation) || FEATURED_TRANSLATIONS[0];
  const continuePath = `/read/${translation || currentTranslation.id}/${bookId || 'jean'}/${chapter || 1}`;
  const dailyRef = useMemo(pickDailyVerse, []);
  const dailyPath = `/read/${translation || currentTranslation.id}/${dailyRef.bookId}/${dailyRef.chapter}`;
  const dailyFavoriteId = dailyVerse ? `${translation}-${dailyRef.bookId}-${dailyRef.chapter}-${dailyVerse.verse}` : '';
  const isDailyFavorite = favorites.some((favorite) => favorite.id === dailyFavoriteId);

  useEffect(() => {
    let mounted = true;
    setLoadingDaily(true);
    setDailyError(null);

    getChapter(translation || currentTranslation.id, dailyRef.bookId, dailyRef.chapter)
      .then((verses) => {
        if (!mounted) return;
        const verse = verses.find((item) => item.verse === dailyRef.verse) || verses[0] || null;
        setDailyVerse(verse);
      })
      .catch((error: Error) => {
        if (!mounted) return;
        setDailyError(error.message || 'Le verset du jour est indisponible pour le moment.');
      })
      .finally(() => {
        if (mounted) setLoadingDaily(false);
      });

    return () => { mounted = false; };
  }, [translation, currentTranslation.id, dailyRef.bookId, dailyRef.chapter, dailyRef.verse]);

  const copyDailyVerse = async () => {
    if (!dailyVerse) return;
    await navigator.clipboard.writeText(`"${dailyVerse.text}"\n— ${dailyVerse.book_name} ${dailyVerse.chapter}:${dailyVerse.verse} (${currentTranslation.short})`);
    toast.success('Verset copié.');
  };

  const saveDailyVerse = () => {
    if (!dailyVerse || isDailyFavorite) return;
    addFavorite({
      id: dailyFavoriteId,
      translation: translation || currentTranslation.id,
      bookId: dailyRef.bookId,
      chapter: dailyRef.chapter,
      verse: dailyVerse.verse,
      text: dailyVerse.text,
      dateAdded: Date.now()
    });
    toast.success('Verset ajouté aux marque-pages.');
  };

  return (
    <div className="space-y-10 md:space-y-14">
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-bg-card/70 p-7 md:p-9">
          <p className="text-sm uppercase tracking-[0.16em] text-text-muted">Reprise de lecture</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl text-text-primary">Retour au texte, sans friction.</h1>
          <p className="mt-4 text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed">
            Votre dernier passage lu reste disponible ici. Omed conserve cette position localement et peut la synchroniser si Google Drive est activé.
          </p>

          <div className="mt-7 rounded-2xl border border-border bg-bg-primary/70 p-5">
            <p className="text-sm text-text-muted">Dernière position</p>
            <p className="mt-2 text-xl font-medium text-text-primary">
              {currentBook.name} {chapter || 1} · {currentTranslation.short}
            </p>
            <p className="mt-1 text-sm text-text-secondary">Dernière lecture connue sur cet appareil.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={continuePath}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-gold px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-brown focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50"
            >
              <BookOpen size={17} />
              Reprendre la lecture
            </Link>
            <Link
              to="/read/lsg/jean/1"
              className="inline-flex items-center rounded-xl border border-border bg-bg-secondary px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg-card"
            >
              Commencer par Jean 1
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-bg-card/55 p-7 md:p-8">
          <div className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-text-muted">
            <Sparkles size={15} />
            Verset du jour
          </div>

          {loadingDaily && <LoadingState title="Chargement du verset" message="Préparation d’un passage pour aujourd’hui." compact />}
          {!loadingDaily && dailyError && <ErrorState title="Verset indisponible" message={dailyError} compact />}
          {!loadingDaily && dailyVerse && (
            <div className="space-y-5">
              <blockquote className="font-body text-xl leading-loose text-text-primary/95">
                « {dailyVerse.text} »
              </blockquote>
              <div>
                <p className="font-display text-lg text-text-primary">{dailyVerse.book_name} {dailyVerse.chapter}:{dailyVerse.verse}</p>
                <p className="text-sm text-text-muted">{currentTranslation.short} · stable pour le {dayKey()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={dailyPath} className="rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary hover:bg-bg-secondary">
                  Ouvrir le chapitre
                </Link>
                <button type="button" onClick={copyDailyVerse} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:text-text-primary">
                  <Copy size={15} /> Copier
                </button>
                <button type="button" onClick={saveDailyVerse} disabled={isDailyFavorite} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-60">
                  <Bookmark size={15} /> {isDailyFavorite ? 'Sauvegardé' : 'Marquer'}
                </button>
              </div>
            </div>
          )}
        </aside>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-2xl text-text-primary">Accès rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block rounded-2xl border border-border bg-bg-card/40 p-6 transition-colors hover:bg-bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40"
            >
              <p className="text-lg font-medium text-text-primary">{link.label}</p>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
