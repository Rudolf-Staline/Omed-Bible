import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary font-sans overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-bg-primary">
        <div className="max-w-4xl mx-auto w-full p-4 pb-24 sm:p-6 md:p-12 md:pb-12 lg:p-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
