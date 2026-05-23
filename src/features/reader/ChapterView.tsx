import React, { useEffect, useState } from 'react';
import { getChapter } from '../../utils/bibleApi';
import type { Verse } from '../../utils/bibleApi';
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

  useEffect(() => {
    let mounted = true;
    const fetchChapter = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getChapter(translation, bookId, chapter);
        if (mounted) setVerses(data);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Erreur lors du chargement du chapitre');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchChapter();
    return () => { mounted = false; };
  }, [translation, bookId, chapter]);

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

  const getHighlightStyle = (color: HighlightColor) => {
    switch (color) {
      case 'yellow': return 'bg-amber-700/16 border-b border-amber-700/30';
      case 'blue': return 'bg-slate-700/14 border-b border-slate-700/30';
      case 'green': return 'bg-emerald-900/14 border-b border-emerald-900/28';
      case 'pink': return 'bg-rose-900/12 border-b border-rose-900/25';
      case 'purple': return 'bg-violet-900/12 border-b border-violet-900/25';
      default: return '';
    }
  };

  return (
    <div className={`max-w-3xl mx-auto pb-28 ${fontClass} ${sizeClasses[settings.fontSize]} ${leadingClasses[settings.lineHeight]}`}>
      <h2 className="font-display text-[2rem] font-semibold mb-10 text-text-primary mt-2 tracking-wide">
        {verses.length > 0 ? `${verses[0].book_name} ${chapter}` : `${bookId} ${chapter}`}
      </h2>

      <div className="space-y-5">
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
                'transition-colors duration-200 rounded-sm px-1 -mx-1',
                highlight ? getHighlightStyle(highlight.color) : 'group-hover:bg-bg-secondary/55',
                isSelected ? 'bg-bg-secondary/85 ring-1 ring-accent-gold/20' : ''
              )}>
                <sup className="font-mono text-[11px] text-text-muted font-medium mr-2 align-top mt-1 inline-block select-none">
                  {verse.verse}
                </sup>
                <span className="text-text-primary">
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
