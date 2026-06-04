import React, { useEffect, useState } from 'react';
import { getChapter } from '../../utils/bibleApi';
import type { Verse } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import type { HighlightColor } from '../../store/useHighlightsStore';
import { VerseActions } from './VerseActions';
import { cacheChapter, getCachedChapter } from '../../utils/chapterCache';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import clsx from 'clsx';

interface ChapterViewProps {
  translation: string;
  bookId: string;
  chapter: number;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ translation, bookId, chapter }) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const isOnline = useOnlineStatus();

  const settings = useSettingsStore((state) => state.settings);
  const highlights = useHighlightsStore((state) => state.highlights);

  useEffect(() => {
    let mounted = true;
    const fetchChapter = async () => {
      setLoading(true);
      setError(null);

      const cached = getCachedChapter(translation, bookId, chapter);
      if (!isOnline && cached) {
        setVerses(cached);
        setLoading(false);
        return;
      }

      if (!isOnline && !cached) {
        setVerses([]);
        setError('Ce chapitre n’est pas encore disponible sans connexion.');
        setLoading(false);
        return;
      }

      try {
        const data = await getChapter(translation, bookId, chapter);
        cacheChapter(translation, bookId, chapter, data);
        if (mounted) setVerses(data);
      } catch (err) {
        if (cached) {
          if (mounted) setVerses(cached);
        } else if (mounted) {
          const message = err instanceof Error ? err.message : 'Erreur lors du chargement du chapitre';
          setError(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchChapter();
    return () => { mounted = false; };
  }, [translation, bookId, chapter, isOnline]);

  if (loading) return <LoadingState title="Chargement du chapitre" message="Nous ouvrons ce passage." />;
  if (error) return <ErrorState title="Chapitre indisponible" message={error} />;

  const isStudyMode = settings.readingMode === 'Étude';
  const fontClass = settings.fontFamily === 'Lora' ? 'font-body' : 'font-sans';

  const sizeClasses = {
    S: 'text-base',
    M: 'text-lg',
    L: 'text-xl',
    XL: 'text-2xl',
  };

  const leadingClasses = {
    Normal: isStudyMode ? 'leading-[2.05]' : 'leading-[1.9]',
    Relaxed: isStudyMode ? 'leading-[2.2]' : 'leading-[2.05]',
    Large: isStudyMode ? 'leading-[2.35]' : 'leading-[2.2]',
  };

  const widthClasses = {
    Narrow: 'max-w-2xl',
    Comfortable: isStudyMode ? 'max-w-4xl' : 'max-w-3xl',
    Wide: 'max-w-5xl',
  };

  const densityClasses = {
    Compact: isStudyMode ? 'space-y-5' : 'space-y-3',
    Aired: isStudyMode ? 'space-y-7' : 'space-y-5',
  };

  const getHighlightStyle = (color: HighlightColor) => {
    switch (color) {
      case 'yellow': return 'bg-amber-200/20 border-b border-amber-400/45 shadow-[inset_0_-1px_0_rgba(180,120,30,0.25)]';
      case 'blue': return 'bg-slate-300/20 border-b border-slate-500/35 shadow-[inset_0_-1px_0_rgba(70,85,110,0.25)]';
      case 'green': return 'bg-emerald-300/18 border-b border-emerald-500/35 shadow-[inset_0_-1px_0_rgba(25,110,85,0.25)]';
      case 'pink': return 'bg-rose-300/16 border-b border-rose-500/30 shadow-[inset_0_-1px_0_rgba(145,70,95,0.25)]';
      case 'purple': return 'bg-violet-300/16 border-b border-violet-500/30 shadow-[inset_0_-1px_0_rgba(90,75,140,0.25)]';
      default: return '';
    }
  };

  return (
    <div className={`${widthClasses[settings.readingWidth]} mx-auto pb-32 px-1 sm:px-2 ${fontClass} ${sizeClasses[settings.fontSize]} ${leadingClasses[settings.lineHeight]}`}>
      <div className="mb-10 mt-6 flex flex-col gap-2 border-b border-border pb-5">
        <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{isStudyMode ? 'Mode étude' : 'Lecture'}</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary/95 tracking-tight">
          {verses.length > 0 ? `${verses[0].book_name} ${chapter}` : `${bookId} ${chapter}`}
        </h2>
      </div>

      <div className={densityClasses[settings.readingDensity]}>
        {verses.map((verse) => {
          const verseId = `${translation}-${bookId}-${chapter}-${verse.verse}`;
          const isSelected = selectedVerseId === verseId;
          const highlight = highlights[verseId];

          return (
            <div key={verseId} className={clsx('relative group cursor-pointer rounded-xl transition-colors', isStudyMode && 'border border-transparent hover:border-border/70 hover:bg-bg-card/35 px-3 py-2')} onClick={() => setSelectedVerseId(isSelected ? null : verseId)}>
              {isSelected && (
                <div className="absolute -top-12 left-0 right-0 z-20 flex justify-center">
                  <VerseActions verse={verse} verseId={verseId} translation={translation} bookId={bookId} onClose={() => setSelectedVerseId(null)} />
                </div>
              )}
              <span className={clsx(
                'transition-all duration-200 rounded-md px-1.5 py-0.5 -mx-1.5',
                highlight ? getHighlightStyle(highlight.color) : 'group-hover:bg-bg-card/65',
                isSelected ? 'bg-bg-card ring-1 ring-accent-gold/20 shadow-sm' : ''
              )}>
                {settings.showVerseNumbers && (
                  <sup className={clsx('font-mono text-[10px] text-text-muted/80 font-medium mr-2 align-top mt-1 inline-block select-none tracking-wide', isStudyMode && 'text-xs text-accent-brown')}>
                    {verse.verse}
                  </sup>
                )}
                <span className="text-text-primary/95">
                  {verse.text}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
