'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeftRight,
  ChevronRight,
  CreditCard,
  FileText,
  Headphones,
  Landmark,
  LayoutDashboard,
  SendHorizontal,
  X,
} from 'lucide-react';
import { useTheme } from '@/lib/hooks/useTheme';
import { cn } from '@/lib/utils';
import { ThemeLogo } from './ThemeLogo';
import type { ThemeId } from '@/types/themes';

const navItems = [
  { href: '/dashboard',        label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/accounts',         label: 'Accounts',        icon: Landmark },
  { href: '/transactions',     label: 'Transactions',    icon: ArrowLeftRight },
  { href: '/transfer',         label: 'Transfer',        icon: SendHorizontal },
  { href: '/bills',            label: 'Bill Payments',   icon: FileText },
  { href: '/service-requests', label: 'Service Requests',icon: Headphones },
  { href: '/cards',            label: 'Cards & Rewards', icon: CreditCard },
];

const themeSwatches: Record<ThemeId, string> = {
  'arctic-white':   'bg-blue-600',
  'midnight-navy':  'bg-slate-800',
  'forest-green':   'bg-green-700',
  'warm-sandstone': 'bg-amber-700',
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, themes, setTheme } = useTheme();

  return (
    <aside
      className={cn(
        // Base — full-height drawer, slides in from left
        'fixed bottom-0 left-0 top-0 z-40 flex w-72 flex-col',
        'border-r border-ui-border bg-brand-sidebar',
        'transition-transform duration-300 ease-in-out',
        // Mobile: translate based on open state
        isOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: always visible, narrower, sits below fixed header
        'lg:w-60 lg:top-16 lg:translate-x-0',
      )}
    >
      {/* ── Mobile-only header row (logo + close button) ── */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-ui-border px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <ThemeLogo themeId={theme.id} />
          <span className="font-bold text-content-primary">{theme.bankName}</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="rounded-lg p-1.5 text-content-secondary transition-colors hover:bg-brand-page hover:text-content-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}   // closes drawer on mobile after navigation
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent text-white'
                      : 'text-content-secondary hover:bg-accent/10 hover:text-content-primary',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="h-3 w-3" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Theme switcher ── */}
      <div className="border-t border-ui-border px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-content-secondary">
          Theme
        </p>
        <div className="flex gap-2">
          {themes.map(t => (
            <button
              key={t.id}
              title={t.name}
              onClick={() => setTheme(t.id)}
              className={cn(
                'h-6 w-6 rounded-full transition-transform hover:scale-110',
                themeSwatches[t.id],
                theme.id === t.id && 'ring-2 ring-accent ring-offset-2',
              )}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
