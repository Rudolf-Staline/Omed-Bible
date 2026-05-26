import React, { useEffect, useState } from 'react';
import { getChapter } from '../../utils/bibleApi';
import type { Verse } from '../../utils/bibleApi';
import { getCachedChapter, setCachedChapter } from '../../utils/chapterCache';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import type { HighlightColor } from '../../store/useHighlightsStore';
import { VerseActions } from './VerseActions';
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

  const settings = useSettingsStore((state) => state.settings);
  const highlights = useHighlightsStore((state) => state.highlights);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    let mounted = true;

    const chapterKey = { translation, bookId, chapter };

    const loadChapter = async () => {
      setLoading(true);
      setError(null);

      if (!isOnline) {
        const cached = getCachedChapter(chapterKey);
        if (mounted) {
          if (cached) {
            setVerses(cached);
          } else {
            setVerses([]);
            setError('Ce chapitre n’est pas encore disponible hors ligne.');
          }
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getChapter(translation, bookId, chapter);
        if (mounted) {
          setVerses(data);
          setCachedChapter(chapterKey, data);
        }
      } catch (err: any) {
        const cached = getCachedChapter(chapterKey);
        if (mounted) {
          if (cached) {
            setVerses(cached);
          } else {
            setError(err.message || 'Erreur lors du chargement du chapitre');
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadChapter();

    return () => { mounted = false; };
  }, [translation, bookId, chapter, isOnline]);

  if (loading) return <div className="py-20 text-center text-text-muted animate-pulse">Chargement en cours...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  const fontClass = settings.fontFamily === 'Lora' ? 'font-body' : 'font-sans';

  const sizeClasses = {
    S: 'text-base',
    M: 'text-lg',
    L: 'text-xl',
    XL: 'text-2xl',
  };

  const leadingClasses = {
    Normal: 'leading-[1.9]',
    Relaxed: 'leading-[2.05]',
    Large: 'leading-[2.2]',
  };

  const readingWidthClasses = {
    Narrow: 'max-w-2xl',
    Comfortable: 'max-w-3xl',
    Wide: 'max-w-4xl',
  };

  const readingDensityClasses = {
    Compact: 'space-y-3.5',
    Aired: 'space-y-5',
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
    <div className={`${readingWidthClasses[settings.readingWidth]} mx-auto pb-32 px-1 sm:px-2 ${fontClass} ${sizeClasses[settings.fontSize]} ${leadingClasses[settings.lineHeight]}`}>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-10 text-text-primary/95 mt-6 tracking-tight">
        {verses.length > 0 ? `${verses[0].book_name} ${chapter}` : `${bookId} ${chapter}`}
      </h2>

      <div className={readingDensityClasses[settings.readingDensity]}>
        {verses.map((verse) => {
          const verseId = `${translation}-${bookId}-${chapter}-${verse.verse}`;
          const isSelected = selectedVerseId === verseId;
          const highlight = highlights[verseId];

          return (
            <div key={verseId} className="relative group cursor-pointer" onClick={() => setSelectedVerseId(isSelected ? null : verseId)}>
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
                  <sup className="font-mono text-[10px] text-text-muted/80 font-medium mr-2 align-top mt-1 inline-block select-none tracking-wide">
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
