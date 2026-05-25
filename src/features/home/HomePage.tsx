import React from 'react';
import { Link } from 'react-router-dom';
import { useBibleStore } from '../../store/useBibleStore';

const QUICK_LINKS = [
  { label: 'Recherche', to: '/search', description: 'Trouver rapidement un passage ou un mot-clé.' },
  { label: 'Marque-pages', to: '/favorites', description: 'Retrouver les versets que vous avez sauvegardés.' },
  { label: 'Notes', to: '/notes', description: 'Relire vos réflexions et annotations personnelles.' },
  { label: 'Parcours', to: '/plans', description: 'Poursuivre vos plans de lecture en cours.' }
];

export const HomePage: React.FC = () => {
  const { translation, bookId, chapter } = useBibleStore();
  const continuePath = `/read/${translation}/${bookId}/${chapter}`;

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="space-y-4 border border-border-primary bg-bg-secondary/70 rounded-2xl p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.14em] text-text-secondary">Accueil</p>
        <h1 className="text-3xl md:text-4xl font-serif text-text-primary">Reprendre la lecture</h1>
        <p className="text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed">
          Votre progression est conservée automatiquement pour vous permettre de reprendre votre lecture sans friction.
        </p>

        <div className="pt-2 space-y-2">
          <p className="text-sm text-text-secondary">Dernière position</p>
          <p className="text-xl font-medium text-text-primary">
            {bookId} {chapter} · {translation.toUpperCase()}
          </p>
        </div>

        <div className="pt-4">
          <Link
            to={continuePath}
            className="inline-flex items-center px-5 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity"
          >
            Continuer
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-serif text-text-primary">Accès rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block border border-border-primary bg-bg-secondary/40 rounded-xl p-6 space-y-2 hover:bg-bg-secondary transition-colors"
            >
              <p className="text-lg font-medium text-text-primary">{link.label}</p>
              <p className="text-sm text-text-secondary leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-l-2 border-border-primary pl-6 py-1 max-w-3xl">
        <p className="text-lg font-serif text-text-primary leading-relaxed">
          « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »
        </p>
        <p className="text-sm text-text-secondary mt-2">Psaume 119:105</p>
      </section>
    </div>
  );
};
