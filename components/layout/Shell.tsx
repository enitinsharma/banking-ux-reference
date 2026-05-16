import type { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/hooks/useTheme';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      <Sidebar />
      <div className="ml-60 flex min-h-screen flex-col pt-16">
        <main className="flex-1 bg-brand-page px-6 py-6">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
