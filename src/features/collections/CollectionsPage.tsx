import React, { useMemo, useState } from 'react';
import { BookmarkMinus, BookOpen, FolderPlus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCollectionsStore } from '../../store/useCollectionsStore';
import { getBook, getTranslationInfo } from '../../utils/bibleApi';
import { EmptyState } from '../../components/EmptyState';

export const CollectionsPage: React.FC = () => {
  const collections = useCollectionsStore((state) => state.collections);
  const createCollection = useCollectionsStore((state) => state.createCollection);
  const removeCollection = useCollectionsStore((state) => state.removeCollection);
  const removeVerseFromCollection = useCollectionsStore((state) => state.removeVerseFromCollection);
  const [selectedId, setSelectedId] = useState(collections[0]?.id || '');
  const [newName, setNewName] = useState('');

  const selectedCollection = useMemo(
    () => collections.find((collection) => collection.id === selectedId) || collections[0],
    [collections, selectedId]
  );

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    const id = createCollection(newName);
    if (!id) return;
    setSelectedId(id);
    setNewName('');
    toast.success('Collection créée.');
  };

  const handleRemoveCollection = (collectionId: string) => {
    const collection = collections.find((item) => item.id === collectionId);
    if (!collection) return;
    if (!window.confirm(`Supprimer la collection « ${collection.name} » ? Les versets ne seront pas supprimés des marque-pages.`)) return;
    removeCollection(collectionId);
    setSelectedId(collections.find((item) => item.id !== collectionId)?.id || '');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-6">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.16em] text-text-muted">Organisation personnelle</p>
        <h1 className="font-display text-3xl text-text-primary md:text-4xl">Collections de versets</h1>
        <p className="max-w-2xl text-text-secondary leading-relaxed">
          Regroupez vos passages par thème : prière, foi, consolation, sagesse, combat intérieur. La première version reste volontairement simple et locale, avec préparation de synchronisation Drive.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4 rounded-2xl border border-border bg-bg-card/60 p-4">
          <form onSubmit={handleCreate} className="space-y-3 rounded-xl border border-border bg-bg-primary/70 p-4">
            <label htmlFor="collection-name" className="text-sm font-medium text-text-primary">Nouvelle collection</label>
            <input
              id="collection-name"
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Ex. Humilité"
              className="w-full rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-gold px-3 py-2 text-sm font-medium text-white hover:bg-accent-brown disabled:opacity-60"
            >
              <FolderPlus size={16} /> Créer
            </button>
          </form>

          <div className="space-y-2">
            {collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => setSelectedId(collection.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${selectedCollection?.id === collection.id ? 'border-accent-gold/40 bg-accent-gold/10 text-text-primary' : 'border-border bg-bg-primary/50 text-text-secondary hover:bg-bg-card'}`}
              >
                <span className="block font-medium">{collection.name}</span>
                <span className="mt-1 block text-xs text-text-muted">{collection.verses.length} passage{collection.verses.length > 1 ? 's' : ''}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="rounded-2xl border border-border bg-bg-card/50 p-5 md:p-7">
          {!selectedCollection ? (
            <EmptyState title="Aucune collection" message="Créez une collection pour commencer à organiser vos passages." />
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl text-text-primary">{selectedCollection.name}</h2>
                  <p className="mt-1 text-sm text-text-muted">{selectedCollection.verses.length} passage{selectedCollection.verses.length > 1 ? 's' : ''}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCollection(selectedCollection.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} /> Supprimer
                </button>
              </div>

              {selectedCollection.verses.length === 0 ? (
                <EmptyState title="Collection vide" message="Depuis un verset sélectionné, utilisez l’action Collections pour y ajouter un passage." />
              ) : (
                <div className="space-y-4">
                  {selectedCollection.verses.map((verse) => {
                    const book = getBook(verse.bookId);
                    const translation = getTranslationInfo(verse.translation);
                    return (
                      <article key={verse.id} className="rounded-xl border border-border bg-bg-primary/70 p-5">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <h3 className="font-display text-lg text-text-primary">
                            {book?.name || verse.bookId} {verse.chapter}:{verse.verse}
                          </h3>
                          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-muted">{translation?.short || verse.translation.toUpperCase()}</span>
                        </div>
                        <p className="font-body leading-relaxed text-text-secondary">{verse.text}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link to={`/read/${verse.translation}/${verse.bookId}/${verse.chapter}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-primary hover:bg-bg-card">
                            <BookOpen size={15} /> Ouvrir
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeVerseFromCollection(selectedCollection.id, verse.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-muted hover:text-red-600"
                          >
                            <BookmarkMinus size={15} /> Retirer
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </section>
    </div>
  );
};
