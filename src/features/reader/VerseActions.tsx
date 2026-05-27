import React, { useState } from 'react';
import { Heart, Edit3, Type, Share2, Check, X } from 'lucide-react';
import type { Verse } from '../../utils/bibleApi';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import type { HighlightColor } from '../../store/useHighlightsStore';
import { useNotesStore } from '../../store/useNotesStore';
import toast from 'react-hot-toast';

interface VerseActionsProps {
  verse: Verse;
  verseId: string;
  translation: string;
  bookId: string;
  onClose: () => void;
}

export const VerseActions: React.FC<VerseActionsProps> = ({ verse, verseId, translation, bookId, onClose }) => {
  const [showColors, setShowColors] = useState(false);
  
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  
  const highlights = useHighlightsStore((state) => state.highlights);
  const addHighlight = useHighlightsStore((state) => state.addHighlight);
  const removeHighlight = useHighlightsStore((state) => state.removeHighlight);

  const addNote = useNotesStore((state) => state.addNote);

  const isFavorite = favorites.some((f) => f.id === verseId);
  const currentHighlight = highlights[verseId];

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(verseId);
      toast('Retiré des favoris', { icon: '💔' });
    } else {
      addFavorite({
        id: verseId,
        translation,
        bookId,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        dateAdded: Date.now()
      });
      toast.success('Ajouté aux favoris !');
    }
  };

  const handleHighlight = (color: HighlightColor, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentHighlight?.color === color) {
      removeHighlight(verseId);
    } else {
      addHighlight(verseId, color);
    }
    setShowColors(false);
  };

  const handleNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simplified note taking for demo - normally would open a modal
    const text = window.prompt('Ajouter une note :');
    if (text) {
      addNote({
        verseId,
        text,
        verseText: verse.text,
      });
      toast.success('Note enregistrée !');
    }
  };

  const [showShareOptions, setShowShareOptions] = useState(false);

  const generateShareImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#FAFAF7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Border
      ctx.strokeStyle = '#8B6F47';
      ctx.lineWidth = 10;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Text styling
      ctx.fillStyle = '#2C2416';
      ctx.textAlign = 'center';
      
      // Verse Text
      ctx.font = 'italic 56px "Lora", serif';
      const words = `« ${verse.text} »`.split(' ');
      let line = '';
      let y = 300;
      const maxWidth = 800;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[i] + ' ';
          y += 80;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);

      // Reference
      ctx.font = 'bold 40px "Playfair Display", serif';
      ctx.fillStyle = '#8B6F47';
      ctx.fillText(`${bookId.charAt(0).toUpperCase() + bookId.slice(1)} ${verse.chapter}:${verse.verse}`, canvas.width / 2, y + 150);
      
      // Translation
      ctx.font = '30px "Inter", sans-serif';
      ctx.fillStyle = '#A89880';
      ctx.fillText(translation.toUpperCase(), canvas.width / 2, y + 220);

      // Branding
      ctx.font = '30px "Inter", sans-serif';
      ctx.fillStyle = '#C9A84C';
      ctx.fillText('✦ Omed-Bible', canvas.width / 2, canvas.height - 150);

      return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    }
    return null;
  };

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const blob = await generateShareImage();
      if (blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        toast.success('Image copiée dans le presse-papier !');
      }
    } catch (err) {
      console.error('Failed to copy image', err);
      await handleCopyText(e);
    }
    setShowShareOptions(false);
  };

  const handleCopyText = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToShare = `"${verse.text}"\n— ${bookId.charAt(0).toUpperCase() + bookId.slice(1)} ${verse.chapter}:${verse.verse} (${translation.toUpperCase()})`;
    await navigator.clipboard.writeText(textToShare);
    toast.success('Texte copié !');
    setShowShareOptions(false);
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToShare = `"${verse.text}"\n— ${bookId.charAt(0).toUpperCase() + bookId.slice(1)} ${verse.chapter}:${verse.verse} (${translation.toUpperCase()})`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const handleShareTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToShare = `"${verse.text}"\n— ${bookId.charAt(0).toUpperCase() + bookId.slice(1)} ${verse.chapter}:${verse.verse} (${translation.toUpperCase()})`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const colors: { id: HighlightColor; hex: string }[] = [
    { id: 'yellow', hex: '#fef08a' },
    { id: 'blue', hex: '#bfdbfe' },
    { id: 'green', hex: '#bbf7d0' },
    { id: 'pink', hex: '#fbcfe8' },
    { id: 'purple', hex: '#e9d5ff' },
  ];

  return (
    <div className="bg-bg-card shadow-lg border border-border rounded-xl px-2 py-1.5 flex items-center gap-1">
      {showColors ? (
        <div className="flex items-center gap-2 px-2">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={(e) => handleHighlight(c.id, e)}
              className="w-6 h-6 rounded-full border border-border shadow-sm flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: c.hex }}
            >
              {currentHighlight?.color === c.id && <Check size={12} className="text-black/50" />}
            </button>
          ))}
          <button onClick={(e) => { e.stopPropagation(); setShowColors(false); }} className="p-1 hover:bg-bg-secondary rounded ml-2">
            <X size={16} className="text-text-muted" />
          </button>
        </div>
      ) : (
        <>
          <button onClick={handleFavorite} className="p-2 hover:bg-bg-secondary rounded-lg text-text-secondary transition-colors group" title="Favori">
             <Heart size={18} className={isFavorite ? 'fill-accent-gold text-accent-gold' : 'group-hover:text-accent-gold'} />
          </button>
          <button onClick={handleNote} className="p-2 hover:bg-bg-secondary rounded-lg text-text-secondary transition-colors hover:text-accent-gold" title="Noter">
             <Edit3 size={18} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setShowColors(true); }} className="p-2 hover:bg-bg-secondary rounded-lg text-text-secondary transition-colors hover:text-accent-gold" title="Surligner">
             <Type size={18} />
          </button>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowShareOptions(!showShareOptions); }} className="p-2 hover:bg-bg-secondary rounded-lg text-text-secondary transition-colors hover:text-accent-gold" title="Partager">
               <Share2 size={18} />
            </button>
            {showShareOptions && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-bg-card border border-border shadow-xl rounded-lg py-2 flex flex-col z-50">
                <button onClick={handleCopyImage} className="px-4 py-2 text-sm text-left hover:bg-bg-secondary transition-colors">Copier l'image</button>
                <button onClick={handleCopyText} className="px-4 py-2 text-sm text-left hover:bg-bg-secondary transition-colors">Copier le texte</button>
                <button onClick={handleShareWhatsApp} className="px-4 py-2 text-sm text-left hover:bg-bg-secondary transition-colors text-green-600">WhatsApp</button>
                <button onClick={handleShareTwitter} className="px-4 py-2 text-sm text-left hover:bg-bg-secondary transition-colors text-blue-500">Twitter / X</button>
              </div>
            )}
          </div>
          <div className="w-px h-6 bg-border mx-1"></div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 hover:bg-bg-secondary rounded-lg text-text-muted transition-colors">
            <X size={18} />
          </button>
        </>
      )}
    </div>
  );
};
