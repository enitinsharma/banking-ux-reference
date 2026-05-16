'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function Shell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay — fades in behind the sidebar drawer */}
      <div
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
        className={cn(
          'fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden',
          sidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Content — no left margin on mobile (sidebar overlays), margin on desktop */}
      <div className="flex min-h-screen flex-col pt-16 lg:ml-60">
        <main className="flex-1 bg-brand-page px-4 py-6 lg:px-6">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
