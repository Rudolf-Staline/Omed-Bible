import React, { useEffect, useState } from 'react';
import { getChapter } from '../../utils/bibleApi';
import type { Verse } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import type { HighlightColor } from '../../store/useHighlightsStore';
import { VerseActions } from './VerseActions';
import clsx from 'clsx';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { BookOpen } from 'lucide-react';

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
        console.error(err);
        if (mounted) setError('Impossible de charger ce chapitre pour le moment.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchChapter();
    return () => { mounted = false; };
  }, [translation, bookId, chapter]);

  if (loading) return <LoadingState title="Chargement du chapitre" description="Le texte biblique est en cours de récupération." />;
  if (error) return <ErrorState title="Chapitre indisponible" description={error} />;

  const fontClass = settings.fontFamily === 'Lora' ? 'font-body' : 'font-sans';
  
  const sizeClasses = {
    'S': 'text-base',
    'M': 'text-lg',
    'L': 'text-xl',
    'XL': 'text-2xl',
  };
  
  const leadingClasses = {
    'Normal': 'leading-normal',
    'Relaxed': 'leading-relaxed',
    'Large': 'leading-loose',
  };

  const getHighlightStyle = (color: HighlightColor) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-200/40 border-b-2 border-yellow-300';
      case 'blue': return 'bg-blue-200/40 border-b-2 border-blue-300';
      case 'green': return 'bg-green-200/40 border-b-2 border-green-300';
      case 'pink': return 'bg-pink-200/40 border-b-2 border-pink-300';
      case 'purple': return 'bg-purple-200/40 border-b-2 border-purple-300';
      default: return '';
    }
  };

  return (
    <div className={`max-w-2xl mx-auto pb-32 ${fontClass} ${sizeClasses[settings.fontSize]} ${leadingClasses[settings.lineHeight]}`}>
      <h2 className="font-display text-3xl font-bold mb-8 text-text-primary mt-4">
        {verses.length > 0 ? `${verses[0].book_name} ${chapter}` : `${bookId} ${chapter}`}
      </h2>

      <div className="space-y-4">
        {verses.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="Aucun verset disponible"
            description="Ce chapitre ne contient pas de texte affichable pour cette version."
          />
        )}

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
                "transition-colors duration-200 rounded px-1 -mx-1",
                highlight ? getHighlightStyle(highlight.color) : "group-hover:bg-bg-secondary",
                isSelected ? "bg-bg-secondary ring-1 ring-accent-gold/30" : ""
              )}>
                <sup className="font-mono text-xs text-accent-gold font-medium mr-1.5 align-top mt-1 inline-block select-none">
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
