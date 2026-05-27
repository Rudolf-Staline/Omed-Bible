import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { BookOpenText, Search, Bookmark, NotebookPen, CalendarRange, SlidersHorizontal, Cloud } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const synced = useSettingsStore((state) => state.synced);
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: BookOpenText, label: 'Lecture' },
    { to: '/search', icon: Search, label: 'Recherche' },
    { to: '/favorites', icon: Bookmark, label: 'Marque-pages' },
    { to: '/notes', icon: NotebookPen, label: 'Notes' },
    { to: '/plans', icon: CalendarRange, label: 'Parcours' },
  ];

  return (
    <aside className="w-68 h-screen bg-bg-secondary/60 backdrop-blur-sm flex flex-col border-r border-border sticky top-0">
      <div className="px-6 pt-8 pb-6 border-b border-border/70">
        <h1 className="font-display text-2xl font-semibold text-text-primary tracking-wide flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <BookOpenText className="text-accent-gold" size={20} strokeWidth={1.5} />
          Omed Scripture
        </h1>
        <p className="mt-2 text-sm text-text-secondary">Lire. Méditer. Retenir.</p>
      </div>

      <div className="px-5 py-3 text-[11px] font-semibold text-text-muted tracking-[0.18em] uppercase">
        Navigation
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 border',
                isActive
                  ? 'bg-bg-card/80 text-text-primary border-border shadow-[0_1px_4px_var(--color-shadow)]'
                  : 'text-text-secondary border-transparent hover:bg-bg-card/60 hover:text-text-primary'
              )
            }
          >
            <item.icon size={17} strokeWidth={1.5} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/70 mt-auto">
        {user ? (
          <div className="flex items-center gap-3 mb-4 px-2">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent-brown text-bg-card flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-text-primary truncate">{user.name}</div>
              <div className="text-xs text-text-muted truncate">{user.email}</div>
            </div>
          </div>
        ) : (
          <div className="mb-4 px-2">
            <button type="button" onClick={() => navigate('/login')} className="w-full text-left text-sm text-accent-brown hover:text-text-primary transition-colors">
              Se connecter
            </button>
          </div>
        )}

        <div className="space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors border',
                isActive
                  ? 'bg-bg-card/80 text-text-primary border-border shadow-[0_1px_4px_var(--color-shadow)]'
                  : 'text-text-secondary border-transparent hover:bg-bg-card/60 hover:text-text-primary'
              )
            }
          >
            <SlidersHorizontal size={17} strokeWidth={1.5} />
            Préférences
          </NavLink>

          <div className="flex items-center gap-3 px-3 py-2 text-sm text-text-muted">
            <Cloud size={17} strokeWidth={1.5} className={synced ? 'text-accent-sage' : ''} />
            {synced ? 'Synchronisé' : 'Non synchronisé'}
          </div>
        </div>
      </div>
    </aside>
  );
};
