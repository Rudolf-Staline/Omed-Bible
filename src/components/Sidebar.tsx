import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { BookOpen, Search, Heart, Edit3, Calendar, Settings, Cloud } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const synced = useSettingsStore((state) => state.synced);
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: BookOpen, label: 'Lire' },
    { to: '/search', icon: Search, label: 'Rechercher' },
    { to: '/favorites', icon: Heart, label: 'Favoris' },
    { to: '/notes', icon: Edit3, label: 'Notes' },
    { to: '/plans', icon: Calendar, label: 'Plans de lecture' },
  ];

  return (
    <div className="w-64 h-screen bg-bg-secondary flex flex-col border-r border-border sticky top-0">
      <div className="p-6">
        <h1 className="font-display text-2xl font-semibold text-text-primary flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <BookOpen className="text-accent-gold" />
          Omed-Bible
        </h1>
      </div>

      <div className="px-4 py-2 text-xs font-semibold text-text-muted tracking-wider uppercase">
        Naviguer
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-bg-primary text-text-primary shadow-sm border border-border'
                  : 'text-text-secondary hover:bg-bg-primary/50 hover:text-text-primary'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        {user ? (
          <div className="flex items-center gap-3 mb-4">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent-gold text-white flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-text-primary truncate">{user.name}</div>
              <div className="text-xs text-text-muted truncate">{user.email}</div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <button onClick={() => navigate('/login')} className="w-full text-left text-sm text-accent-brown hover:underline">
              Se connecter
            </button>
          </div>
        )}

        <div className="space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-bg-primary text-text-primary shadow-sm border border-border'
                  : 'text-text-secondary hover:bg-bg-primary/50 hover:text-text-primary'
              )
            }
          >
            <Settings size={18} />
            Paramètres
          </NavLink>

          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-muted">
            <Cloud size={18} className={synced ? 'text-accent-sage' : ''} />
            {synced ? 'Synchronisé' : 'Non synchronisé'}
          </div>
        </div>
      </div>
    </div>
  );
};
