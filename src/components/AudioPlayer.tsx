import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X } from 'lucide-react';
import { fetchChapter } from '../utils/bibleApi';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS } from '../utils/bibleApi';

interface AudioPlayerProps {
  translation: string;
  bookId: string;
  chapter: number;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ translation, bookId, chapter, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    fetchChapter(translation, bookId, chapter).then(verses => {
      if (!active) return;
      const text = verses.map(v => v.text).join(' ');
      
      const isEnglish = ['kjv', 'web', 'bbe'].includes(translation);
      const u = new SpeechSynthesisUtterance(text);
      u.lang = isEnglish ? 'en-US' : 'fr-FR';
      u.rate = speed;
      
      u.onend = () => setIsPlaying(false);
      u.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsPlaying(false);
      };
      
      utteranceRef.current = u;
      setIsLoading(false);
      
      // Auto-play when ready
      window.speechSynthesis.speak(u);
      setIsPlaying(true);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });

    return () => {
      active = false;
      window.speechSynthesis.cancel();
    };
  }, [translation, bookId, chapter]); // Intentionally omitting speed to not restart from beginning on speed change

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1.0 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2.0 : 1.0;
    setSpeed(nextSpeed);
    
    // Changing speed requires recreating the utterance for it to take effect in most browsers.
    // However, to keep it simple, we just save the setting state. It will apply cleanly on the next chapter.
    // For immediate effect (optional): we could cancel and restart, but it restarts from the beginning.
    toastSpeed(nextSpeed);
  };
  
  const toastSpeed = (s: number) => {
    // If you had a toast here...
  };

  const bookName = BIBLE_BOOKS.find(b => b.id === bookId)?.name || bookId;
  const translationName = FEATURED_TRANSLATIONS.find(t => t.id === translation)?.short || translation;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex flex-col">
      <div className="flex-1 flex items-center justify-between px-4 sm:px-6 max-w-4xl mx-auto w-full">
        {/* Left: Info */}
        <div className="flex-1 flex items-center min-w-0">
          <div className="truncate">
            <h4 className="font-display font-semibold text-text-primary truncate">
              {bookName} {chapter}
            </h4>
            <p className="text-xs text-text-muted uppercase tracking-wider">{translationName}</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <button 
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm
              ${isLoading ? 'bg-bg-secondary text-text-muted cursor-not-allowed' : 'bg-accent-gold text-white hover:bg-accent-brown'}`}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <button 
            onClick={cycleSpeed}
            title="S'applique au prochain chapitre"
            className="text-xs font-mono font-medium text-text-secondary hover:text-text-primary w-10 text-right"
          >
            {speed.toFixed(1)}x
          </button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
