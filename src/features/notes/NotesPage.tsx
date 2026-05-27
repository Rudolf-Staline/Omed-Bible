import React, { useMemo, useState } from 'react';
import { useNotesStore } from '../../store/useNotesStore';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Check, X, Search } from 'lucide-react';
import { EmptyState } from '../../components/EmptyState';
import toast from 'react-hot-toast';

const normalizeBookId = (bookId: string) =>
  bookId
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatDate = (value?: number) => {
  if (!value) return 'Date indisponible';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date indisponible';
  return parsed.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const NotesPage: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  const updateNote = useNotesStore((state) => state.updateNote);
  const removeNote = useNotesStore((state) => state.removeNote);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [query, setQuery] = useState('');

  const handleEditClick = (noteId: string, currentText: string) => {
    setEditingId(noteId);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editText.trim()) {
      toast.error('La note ne peut pas être vide.');
      return;
    }
    updateNote(noteId, editText.trim());
    setEditingId(null);
    setEditText('');
    toast.success('Note mise à jour.');
  };

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0)),
    [notes]
  );

  const filteredNotes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sortedNotes;

    return sortedNotes.filter((note) => {
      const [translation = '', bookId = '', chapter = '', verse = ''] = note.verseId.split('-');
      const reference = `${normalizeBookId(bookId)} ${chapter}:${verse}`.toLowerCase();

      return (
        note.text.toLowerCase().includes(term) ||
        note.verseText.toLowerCase().includes(term) ||
        reference.includes(term) ||
        translation.toLowerCase().includes(term)
      );
    });
  }, [query, sortedNotes]);

  if (notes.length === 0) {
    return (
      <EmptyState
        title="Carnet de notes"
        message="Vos notes apparaîtront ici lorsque vous annoterez un passage."
        actionLabel="Commencer à lire"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-3 text-text-primary">Mes notes d'étude</h1>
      <p className="text-text-secondary mb-6">
        Un espace personnel pour conserver ce qui vous parle pendant la lecture.
      </p>

      <div className="mb-6">
        <label className="relative block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par référence, traduction ou contenu…"
            className="w-full bg-bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold"
          />
        </label>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl p-10 text-center">
          <h2 className="font-display text-xl text-text-primary mb-2">Aucun résultat</h2>
          <p className="text-text-secondary">
            Aucune note ne correspond à votre recherche. Essayez un autre mot-clé.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredNotes.map((note) => {
            const [translation = 'n/a', bookId = '', chapter = '?', verse = '?'] = note.verseId.split('-');
            const reference = `${normalizeBookId(bookId)} ${chapter}:${verse}`;
            const hasVerseText = Boolean(note.verseText && note.verseText.trim());
            const createdAt = formatDate(note.dateAdded);
            const modifiedAt = formatDate(note.dateModified);

            return (
              <article key={note.id} className="bg-bg-card border border-border rounded-xl p-5">
                <header className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-text-primary">{reference}</h2>
                    <p className="text-xs uppercase tracking-wide text-text-muted mt-1">
                      Traduction : {translation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(note.id, note.text)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:text-accent-gold hover:border-accent-gold transition-colors inline-flex items-center gap-1"
                      title="Modifier"
                    >
                      <Edit3 size={14} /> Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Supprimer cette note ?')) {
                          removeNote(note.id);
                          toast.success('Note supprimée.');
                        }
                      }}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:text-red-500 hover:border-red-400 transition-colors inline-flex items-center gap-1"
                      title="Supprimer"
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </header>

                <section className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Extrait</p>
                    <p className="text-sm italic text-text-secondary border-l-2 border-accent-gold/40 pl-3">
                      {hasVerseText ? `« ${note.verseText} »` : 'Extrait indisponible pour ce verset.'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Note</p>
                    {editingId === note.id ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-bg-primary border border-border rounded-lg p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold font-body min-h-[120px]"
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 rounded-lg font-medium text-text-muted hover:bg-bg-secondary transition-colors inline-flex items-center gap-1"
                          >
                            <X size={16} /> Annuler
                          </button>
                          <button
                            onClick={() => handleSaveEdit(note.id)}
                            className="px-4 py-2 rounded-lg font-medium bg-accent-gold text-white hover:bg-accent-brown transition-colors inline-flex items-center gap-1"
                          >
                            <Check size={16} /> Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-body text-text-primary leading-relaxed whitespace-pre-wrap">{note.text}</p>
                    )}
                  </div>
                </section>

                <footer className="mt-5 pt-4 border-t border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
                  <div className="space-y-0.5">
                    <p>Créée le {createdAt}</p>
                    <p>Dernière modification : {modifiedAt}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/read/${translation}/${bookId}/${chapter}`)}
                    className="font-medium text-accent-brown hover:text-accent-gold transition-colors"
                  >
                    Relire le chapitre
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
