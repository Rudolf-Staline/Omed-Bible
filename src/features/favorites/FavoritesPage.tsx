import React from 'react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, Share2, ChevronRight, Heart } from 'lucide-react';
import { FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import toast from 'react-hot-toast';

export const FavoritesPage: React.FC = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const navigate = useNavigate();

  const getTranslationName = (id: string) => {
    return FEATURED_TRANSLATIONS.find((t) => t.id === id)?.short || id.toUpperCase();
  };

  const handleShare = async (text: string, reference: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`« ${text} »\n${reference}`);
      toast.success('Texte copié !');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <Heart size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">Aucun favori</h2>
        <p className="text-text-secondary">Vos versets préférés apparaîtront ici.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-bg-secondary text-text-primary rounded-lg font-medium hover:bg-border transition-colors"
        >
          Commencer à lire
        </button>
      </div>
    );
  }

  // Sort by date added (newest first)
  const sortedFavorites = [...favorites].sort((a, b) => b.dateAdded - a.dateAdded);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-8 text-text-primary flex items-center gap-3">
        <Heart className="text-accent-gold" />
        Favoris
      </h1>

      <div className="space-y-4">
        {sortedFavorites.map((verse) => {
          const reference = `${verse.bookId.charAt(0).toUpperCase() + verse.bookId.slice(1)} ${verse.chapter}:${verse.verse}`;
          
          return (
            <div key={verse.id} className="bg-bg-card border border-border rounded-xl p-6 group hover:shadow-sm transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-lg text-text-primary">{reference}</h3>
                  <span className="text-xs font-mono font-medium text-text-muted px-2 py-0.5 bg-bg-secondary rounded">
                    {getTranslationName(verse.translation)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleShare(verse.text, reference, e)}
                    className="p-1.5 text-text-muted hover:text-accent-gold rounded transition-colors"
                    title="Partager"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Retirer ce verset des favoris ?')) {
                        removeFavorite(verse.id);
                        toast('Retiré des favoris', { icon: '💔' });
                      }
                    }}
                    className="p-1.5 text-text-muted hover:text-red-500 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="font-body text-lg text-text-primary mb-6 leading-relaxed italic">
                « {verse.text} »
              </p>

              <button
                onClick={() => navigate(`/read/${verse.translation}/${verse.bookId}/${verse.chapter}`)}
                className="flex items-center gap-1 text-sm font-medium text-accent-brown hover:text-accent-gold transition-colors"
              >
                Lire le contexte <ChevronRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
