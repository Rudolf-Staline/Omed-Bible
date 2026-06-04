import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBibleStore } from '../../store/useBibleStore';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS, getTranslationInfo } from '../../utils/bibleApi';
import { ChapterView } from './ChapterView';
import { AudioPlayer } from '../../components/AudioPlayer';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { ChevronDown, ChevronLeft, ChevronRight, Headphones, GitCompare, WifiOff } from 'lucide-react';

export const ReaderPage: React.FC = () => {
  const { translation, bookId, chapter } = useParams<{ translation: string; bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = React.useState(false);
  const isOnline = useOnlineStatus();

  const setPosition = useBibleStore((state) => state.setPosition);
  const compareTranslation = useBibleStore((state) => state.compareTranslation);
  const setCompareTranslation = useBibleStore((state) => state.setCompareTranslation);

  const activeTranslation = getTranslationInfo(translation || '') ? translation || 'lsg' : FEATURED_TRANSLATIONS[0]?.id || 'lsg';
  const chapterNum = parseInt(chapter || '1', 10);

  useEffect(() => {
    if (activeTranslation && bookId && chapter) {
      setPosition(activeTranslation, bookId, chapterNum);
    }
  }, [activeTranslation, bookId, chapter, chapterNum, setPosition]);

  const currentBook = BIBLE_BOOKS.find((b) => b.id === bookId) || BIBLE_BOOKS[0];

  const selectClass = 'appearance-none rounded-lg border border-border/80 bg-bg-card/70 pl-3 pr-8 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent-gold/30 focus:outline-none focus:ring-1 focus:ring-accent-gold/50';

  const SelectChevron = () => (
    <ChevronDown size={15} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
  );

  return (
    <div className="flex flex-col h-full">
      <header className="mb-8 sticky top-0 z-10 border-b border-border/70 bg-bg-primary/90 py-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[150px]">
            <select value={activeTranslation} onChange={(e) => navigate(`/read/${e.target.value}/${bookId}/${chapterNum}`)} className={selectClass} aria-label="Traduction">
              {FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} · {t.name}</option>)}
            </select>
            <SelectChevron />
          </div>

          <div className="relative min-w-[150px] flex-1 sm:flex-none">
            <select value={bookId} onChange={(e) => navigate(`/read/${activeTranslation}/${e.target.value}/1`)} className={`${selectClass} w-full`} aria-label="Livre">
              {BIBLE_BOOKS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <SelectChevron />
          </div>

          <div className="relative">
            <select value={chapterNum} onChange={(e) => navigate(`/read/${activeTranslation}/${bookId}/${e.target.value}`)} className={selectClass} aria-label="Chapitre">
              {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => <option key={c} value={c}>Chapitre {c}</option>)}
            </select>
            <SelectChevron />
          </div>

          {!isOnline && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700">
              <WifiOff size={14} /> Hors ligne
            </span>
          )}

          <div className="flex-1" />

          <button type="button" onClick={() => setShowAudio(true)} className="flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary hover:bg-bg-card/60" aria-label="Ouvrir l'audio du chapitre">
            <Headphones size={17} strokeWidth={1.5} />
            <span className="hidden sm:inline">Audio</span>
          </button>

          <button type="button" onClick={() => setCompareTranslation(compareTranslation ? null : 'kjv')} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${compareTranslation ? 'border-accent-gold/40 text-accent-gold bg-accent-gold/10' : 'border-border/70 text-text-secondary hover:text-text-primary hover:bg-bg-card/60'}`} aria-label="Comparer deux traductions">
            <GitCompare size={17} strokeWidth={1.5} />
            <span className="hidden sm:inline">Comparer</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-8 xl:flex-row xl:gap-6">
        <div className={`flex-1 transition-all ${compareTranslation ? 'xl:pr-5 xl:border-r xl:border-border/70' : ''}`}>
          <ChapterView translation={activeTranslation} bookId={bookId || 'jean'} chapter={chapterNum} />
        </div>

        {compareTranslation && (
          <div className="flex-1 border-t border-border/70 pt-6 xl:border-t-0 xl:pl-1 xl:pt-0">
            <div className="mb-5">
              <div className="relative inline-flex">
                <select value={compareTranslation} onChange={(e) => setCompareTranslation(e.target.value)} className={selectClass} aria-label="Traduction de comparaison">
                  {FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} · {t.name}</option>)}
                </select>
                <SelectChevron />
              </div>
            </div>
            <ChapterView translation={compareTranslation} bookId={bookId || 'jean'} chapter={chapterNum} />
          </div>
        )}
      </div>

      <footer className="mt-10 mb-4 flex items-center justify-between border-t border-border pt-5">
        <button type="button" onClick={() => chapterNum > 1 ? navigate(`/read/${activeTranslation}/${bookId}/${chapterNum - 1}`) : (() => { const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId); if (i > 0) { const p = BIBLE_BOOKS[i - 1]; navigate(`/read/${activeTranslation}/${p.id}/${p.chapters}`); } })()} className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-gold transition-colors">
          <ChevronLeft size={18} /> Chapitre précédent
        </button>
        <button type="button" onClick={() => chapterNum < currentBook.chapters ? navigate(`/read/${activeTranslation}/${bookId}/${chapterNum + 1}`) : (() => { const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId); if (i < BIBLE_BOOKS.length - 1) { const n = BIBLE_BOOKS[i + 1]; navigate(`/read/${activeTranslation}/${n.id}/1`); } })()} className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-gold transition-colors">
          Chapitre suivant <ChevronRight size={18} />
        </button>
      </footer>

      {showAudio && <AudioPlayer translation={activeTranslation} bookId={bookId || 'jean'} chapter={chapterNum} onClose={() => setShowAudio(false)} />}
    </div>
  );
};
