import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

interface AudioPlayerProps {
  translation: string;
  bookId: string;
  chapter: number;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ translation, bookId, chapter, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pour la démo, on utilise l'URL ESV pour KJV (ou des MP3 publics si disponibles)
  const getAudioUrl = () => {
    if (translation === 'kjv' || translation === 'esv') {
       // Mock URL format
       return `https://audio.esv.org/hw/mq/${bookId}_${chapter}.mp3`;
    }
    return null;
  };

  const audioUrl = getAudioUrl();

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setIsPlaying(true);
      audioRef.current.play().catch(e => console.error("Audio autoplay prevented", e));
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1.0 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2.0 : 1.0;
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-bg-secondary w-full cursor-pointer relative" onClick={(e) => {
          if (!audioRef.current || !audioRef.current.duration) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          audioRef.current.currentTime = pos * audioRef.current.duration;
      }}>
        <div className="absolute top-0 left-0 h-full bg-accent-gold transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex items-center justify-between px-4 sm:px-6 max-w-4xl mx-auto w-full">
        {/* Left: Info */}
        <div className="flex-1 flex items-center min-w-0">
          <div className="truncate">
            <h4 className="font-display font-semibold text-text-primary truncate">
              {bookId.charAt(0).toUpperCase() + bookId.slice(1)} {chapter}
            </h4>
            <p className="text-xs text-text-muted uppercase tracking-wider">{translation}</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <button className="text-text-muted hover:text-text-primary transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-accent-gold text-white flex items-center justify-center hover:bg-accent-brown transition-colors shadow-sm"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>

          <button className="text-text-muted hover:text-text-primary transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <button
            onClick={cycleSpeed}
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

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};
