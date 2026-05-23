import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBibleStore } from '../../store/useBibleStore';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { ChapterView } from './ChapterView';
import { AudioPlayer } from '../../components/AudioPlayer';
import { ChevronLeft, ChevronRight, Headphones, GitCompare } from 'lucide-react';

export const ReaderPage: React.FC = () => {
  const { translation, bookId, chapter } = useParams<{ translation: string; bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = React.useState(false);

  const setPosition = useBibleStore((state) => state.setPosition);
  const compareTranslation = useBibleStore((state) => state.compareTranslation);
  const setCompareTranslation = useBibleStore((state) => state.setCompareTranslation);

  const chapterNum = parseInt(chapter || '1', 10);

  useEffect(() => {
    if (translation && bookId && chapter) {
      setPosition(translation, bookId, chapterNum);
    }
  }, [translation, bookId, chapterNum, setPosition]);

  const currentBook = BIBLE_BOOKS.find((b) => b.id === bookId) || BIBLE_BOOKS[0];

  return (
    <div className="flex flex-col h-full">
      <header className="mb-8 sticky top-0 z-10 border-b border-border/80 bg-bg-primary/95 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select value={translation} onChange={(e) => navigate(`/read/${e.target.value}/${bookId}/${chapterNum}`)} className="rounded-md border border-border bg-bg-card/80 px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold">
            {FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} — {t.name}</option>)}
          </select>

          <select value={bookId} onChange={(e) => navigate(`/read/${translation}/${e.target.value}/1`)} className="rounded-md border border-border bg-bg-card/80 px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold">
            {BIBLE_BOOKS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <select value={chapterNum} onChange={(e) => navigate(`/read/${translation}/${bookId}/${e.target.value}`)} className="rounded-md border border-border bg-bg-card/80 px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold">
            {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => <option key={c} value={c}>Chapitre {c}</option>)}
          </select>

          <div className="flex-1" />

          <button onClick={() => setShowAudio(true)} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary hover:bg-bg-card/70">
            <Headphones size={17} strokeWidth={1.5} />
            <span className="hidden sm:inline">Audio</span>
          </button>

          <button onClick={() => setCompareTranslation(compareTranslation ? null : 'kjv')} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${compareTranslation ? 'border-accent-gold/40 text-accent-gold bg-bg-card/70' : 'border-border text-text-secondary hover:text-text-primary hover:bg-bg-card/70'}`}>
            <GitCompare size={17} strokeWidth={1.5} />
            <span className="hidden sm:inline">Comparer</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6">
        <div className={`flex-1 transition-all ${compareTranslation ? 'pr-5 border-r border-border' : ''}`}>
          <ChapterView translation={translation || 'lsg'} bookId={bookId || 'jean'} chapter={chapterNum} />
        </div>

        {compareTranslation && (
          <div className="flex-1 pl-1">
            <div className="mb-5">
              <select value={compareTranslation} onChange={(e) => setCompareTranslation(e.target.value)} className="rounded-md border border-border bg-bg-card/80 px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold">
                {FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} — {t.name}</option>)}
              </select>
            </div>
            <ChapterView translation={compareTranslation} bookId={bookId || 'jean'} chapter={chapterNum} />
          </div>
        )}
      </div>

      <footer className="mt-10 mb-4 flex items-center justify-between border-t border-border pt-5">
        <button onClick={() => chapterNum > 1 ? navigate(`/read/${translation}/${bookId}/${chapterNum - 1}`) : (() => { const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId); if (i > 0) { const p = BIBLE_BOOKS[i - 1]; navigate(`/read/${translation}/${p.id}/${p.chapters}`); } })()} className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-gold transition-colors">
          <ChevronLeft size={18} />
          Chapitre précédent
        </button>
        <button onClick={() => chapterNum < currentBook.chapters ? navigate(`/read/${translation}/${bookId}/${chapterNum + 1}`) : (() => { const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId); if (i < BIBLE_BOOKS.length - 1) { const n = BIBLE_BOOKS[i + 1]; navigate(`/read/${translation}/${n.id}/1`); } })()} className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-gold transition-colors">
          Chapitre suivant
          <ChevronRight size={18} />
        </button>
      </footer>

      {showAudio && <AudioPlayer translation={translation || 'kjv'} bookId={bookId || 'jean'} chapter={chapterNum} onClose={() => setShowAudio(false)} />}
    </div>
  );
};
