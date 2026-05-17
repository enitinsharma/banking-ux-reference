'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/hooks/useTheme';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { IosInstallBanner } from './IosInstallBanner';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/* Fixed top header — full width */}
      <Header />

      {/* Sidebar — desktop only (hidden on mobile) */}
      <Sidebar />

      {/* Content — no left margin on mobile, 240 px offset on desktop */}
      <div className="flex min-h-screen flex-col overflow-x-hidden pt-16 pb-16 lg:ml-60 lg:pb-0">
        <main className="flex-1 w-full min-w-0 bg-brand-page px-4 py-6 lg:px-6">
          {children}
        </main>
        <Footer />
      </div>

      {/* Bottom tab bar — mobile only */}
      <BottomNav />

      {/* iOS install hint — shown only on iPhone/iPad Safari, not when already installed */}
      <IosInstallBanner />
    </ThemeProvider>
  );
}
