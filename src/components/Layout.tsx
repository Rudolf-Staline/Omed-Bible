import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-bg-primary">
        <div className="max-w-5xl mx-auto w-full px-8 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
