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

  const handleTranslationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/read/${e.target.value}/${bookId}/${chapterNum}`);
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/read/${translation}/${e.target.value}/1`);
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/read/${translation}/${bookId}/${e.target.value}`);
  };

  const goPrevChapter = () => {
    if (chapterNum > 1) {
      navigate(`/read/${translation}/${bookId}/${chapterNum - 1}`);
    } else {
      const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
      if (bookIndex > 0) {
        const prevBook = BIBLE_BOOKS[bookIndex - 1];
        navigate(`/read/${translation}/${prevBook.id}/${prevBook.chapters}`);
      }
    }
  };

  const goNextChapter = () => {
    if (chapterNum < currentBook.chapters) {
      navigate(`/read/${translation}/${bookId}/${chapterNum + 1}`);
    } else {
      const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
      if (bookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[bookIndex + 1];
        navigate(`/read/${translation}/${nextBook.id}/1`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header du lecteur */}
      <header className="flex flex-wrap items-center gap-4 mb-8 sticky top-0 bg-bg-primary/90 backdrop-blur-sm z-10 py-4 border-b border-border">
        <select
          value={translation}
          onChange={handleTranslationChange}
          className="bg-transparent border border-border rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent-gold"
        >
          {FEATURED_TRANSLATIONS.map((t) => (
            <option key={t.id} value={t.id}>{t.short} - {t.name}</option>
          ))}
        </select>

        <select
          value={bookId}
          onChange={handleBookChange}
          className="bg-transparent border border-border rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent-gold"
        >
          {BIBLE_BOOKS.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={chapterNum}
          onChange={handleChapterChange}
          className="bg-transparent border border-border rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent-gold"
        >
          {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => (
            <option key={c} value={c}>Chapitre {c}</option>
          ))}
        </select>

        <div className="flex-1" />

        <button
          onClick={() => setShowAudio(true)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <Headphones size={18} />
          <span className="hidden sm:inline">Audio</span>
        </button>

        <button
          onClick={() => setCompareTranslation(compareTranslation ? null : 'kjv')}
          className={`flex items-center gap-2 text-sm transition-colors ${compareTranslation ? 'text-accent-gold' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <GitCompare size={18} />
          <span className="hidden sm:inline">Comparer</span>
        </button>
      </header>

      {/* Zone de lecture */}
      <div className="flex-1 flex">
        <div className={`flex-1 transition-all ${compareTranslation ? 'pr-4 border-r border-border' : ''}`}>
           <ChapterView translation={translation || 'lsg'} bookId={bookId || 'jean'} chapter={chapterNum} />
        </div>

        {compareTranslation && (
          <div className="flex-1 pl-4">
             <div className="mb-4">
                <select
                  value={compareTranslation}
                  onChange={(e) => setCompareTranslation(e.target.value)}
                  className="bg-transparent border border-border rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent-gold"
                >
                  {FEATURED_TRANSLATIONS.map((t) => (
                    <option key={t.id} value={t.id}>{t.short} - {t.name}</option>
                  ))}
                </select>
             </div>
             <ChapterView translation={compareTranslation} bookId={bookId || 'jean'} chapter={chapterNum} />
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <footer className="mt-12 mb-8 flex items-center justify-between border-t border-border pt-6">
        <button
          onClick={goPrevChapter}
          className="flex items-center gap-2 text-text-secondary hover:text-accent-gold transition-colors font-medium"
        >
          <ChevronLeft size={20} />
          Chapitre précédent
        </button>
        <button
          onClick={goNextChapter}
          className="flex items-center gap-2 text-text-secondary hover:text-accent-gold transition-colors font-medium"
        >
          Chapitre suivant
          <ChevronRight size={20} />
        </button>
      </footer>

      {showAudio && (
        <AudioPlayer
          translation={translation || 'kjv'}
          bookId={bookId || 'jean'}
          chapter={chapterNum}
          onClose={() => setShowAudio(false)}
        />
      )}
    </div>
  );
};
