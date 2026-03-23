import React, { useState } from 'react';
import { useNotesStore } from '../../store/useNotesStore';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const NotesPage: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  const updateNote = useNotesStore((state) => state.updateNote);
  const removeNote = useNotesStore((state) => state.removeNote);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditClick = (noteId: string, currentText: string) => {
    setEditingId(noteId);
    setEditText(currentText);
  };

  const handleSaveEdit = (noteId: string) => {
    if (editText.trim()) {
      updateNote(noteId, editText);
      setEditingId(null);
      toast.success('Note mise à jour');
    }
  };

  if (notes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <Edit3 size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">Aucune note</h2>
        <p className="text-text-secondary">Prenez des notes pendant votre lecture.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-bg-secondary text-text-primary rounded-lg font-medium hover:bg-border transition-colors"
        >
          Commencer à lire
        </button>
      </div>
    );
  }

  // Sort by date modified (newest first)
  const sortedNotes = [...notes].sort((a, b) => b.dateModified - a.dateModified);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-8 text-text-primary flex items-center gap-3">
        <Edit3 className="text-accent-gold" />
        Notes
      </h1>

      <div className="space-y-6">
        {sortedNotes.map((note) => {
          const [translation, bookId, chapter, verse] = note.verseId.split('-');
          const reference = `${bookId.charAt(0).toUpperCase() + bookId.slice(1)} ${chapter}:${verse}`;

          return (
            <div key={note.id} className="bg-bg-card border border-border rounded-xl p-6 group hover:shadow-sm transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-lg text-text-primary">{reference}</h3>
                  <span className="text-xs font-mono font-medium text-text-muted px-2 py-0.5 bg-bg-secondary rounded">
                    {translation.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      if(window.confirm('Supprimer cette note ?')) {
                        removeNote(note.id);
                        toast.success('Note supprimée');
                      }
                    }}
                    className="p-1.5 text-text-muted hover:text-red-500 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4 pl-4 border-l-2 border-accent-gold/30">
                <p className="font-body text-text-secondary leading-relaxed italic text-sm">
                  « {note.verseText} »
                </p>
              </div>

              {editingId === note.id ? (
                <div className="mt-4">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-bg-primary border border-border rounded-lg p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold font-body mb-3 min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1.5 rounded-lg font-medium text-text-muted hover:bg-bg-secondary transition-colors flex items-center gap-1"
                    >
                      <X size={16} /> Annuler
                    </button>
                    <button
                      onClick={() => handleSaveEdit(note.id)}
                      className="px-4 py-1.5 rounded-lg font-medium bg-accent-gold text-white hover:bg-accent-brown transition-colors flex items-center gap-1"
                    >
                      <Check size={16} /> Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 group/note relative">
                   <p className="font-body text-text-primary leading-relaxed whitespace-pre-wrap">
                      {note.text}
                   </p>
                   <button
                     onClick={() => handleEditClick(note.id, note.text)}
                     className="absolute top-0 right-0 p-1.5 opacity-0 group-hover/note:opacity-100 bg-bg-secondary rounded text-text-muted hover:text-accent-gold transition-all"
                     title="Modifier"
                   >
                      <Edit3 size={14} />
                   </button>
                </div>
              )}

              <div className="mt-6 flex justify-between items-center text-xs text-text-muted">
                <span>Modifié le {new Date(note.dateModified).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <button
                  onClick={() => navigate(`/read/${translation}/${bookId}/${chapter}`)}
                  className="font-medium text-accent-brown hover:text-accent-gold transition-colors"
                >
                  Aller au chapitre
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
