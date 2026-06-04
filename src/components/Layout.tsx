import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Bookmark, BookOpenText, Folders, Search, SlidersHorizontal } from 'lucide-react';
import { Sidebar } from './Sidebar';
import clsx from 'clsx';

const mobileItems = [
  { to: '/', icon: BookOpenText, label: 'Accueil' },
  { to: '/search', icon: Search, label: 'Recherche' },
  { to: '/favorites', icon: Bookmark, label: 'Marques' },
  { to: '/collections', icon: Folders, label: 'Thèmes' },
  { to: '/settings', icon: SlidersHorizontal, label: 'Réglages' },
];

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary font-sans overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-bg-primary">
        <div className="max-w-5xl mx-auto w-full px-4 py-6 pb-28 sm:px-6 md:px-10 md:py-10 md:pb-10 lg:px-14 lg:py-12">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg-secondary/95 px-2 py-2 backdrop-blur md:hidden" aria-label="Navigation mobile">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {mobileItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => clsx(
                'flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] transition-colors',
                isActive ? 'bg-bg-card text-text-primary' : 'text-text-muted hover:text-text-primary'
              )}
            >
              <item.icon size={18} strokeWidth={1.6} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
