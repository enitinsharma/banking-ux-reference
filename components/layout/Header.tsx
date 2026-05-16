'use client';

import { Bell, Menu, Settings } from 'lucide-react';
import { useTheme } from '@/lib/hooks/useTheme';
import { ThemeLogo } from './ThemeLogo';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between bg-brand-header px-4 shadow-md lg:px-6">
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Hamburger — visible on mobile only */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <ThemeLogo themeId={theme.id} />

        <span className="text-base font-bold tracking-tight text-white lg:text-lg">
          {theme.bankName}
        </span>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        <button
          aria-label="Notifications"
          className="relative text-white/80 transition-colors hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <button
          aria-label="Settings"
          className="hidden text-white/80 transition-colors hover:text-white sm:block"
        >
          <Settings className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1.5 lg:px-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            NS
          </div>
          {/* Name hidden on small screens — avatar alone is enough */}
          <span className="hidden text-sm font-medium text-white sm:block">
            Nitin Sharma
          </span>
        </div>
      </div>
    </header>
  );
}
