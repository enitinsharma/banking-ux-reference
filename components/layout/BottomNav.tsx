'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeftRight,
  CreditCard,
  FileText,
  Headphones,
  Landmark,
  LayoutDashboard,
  MoreHorizontal,
  SendHorizontal,
  X,
} from 'lucide-react';
import { useTheme } from '@/lib/hooks/useTheme';
import { cn } from '@/lib/utils';
import type { ThemeId } from '@/types/themes';

const themeSwatches: Record<ThemeId, string> = {
  'arctic-white':   'bg-blue-600',
  'midnight-navy':  'bg-slate-800',
  'forest-green':   'bg-green-700',
  'warm-sandstone': 'bg-amber-700',
};

const primaryTabs = [
  { href: '/dashboard',    label: 'Home',     icon: LayoutDashboard },
  { href: '/accounts',     label: 'Accounts', icon: Landmark },
  { href: '/transfer',     label: 'Transfer', icon: SendHorizontal },
  { href: '/transactions', label: 'Activity', icon: ArrowLeftRight },
];

const moreTabs = [
  { href: '/bills',             label: 'Bill Payments',    icon: FileText },
  { href: '/service-requests',  label: 'Service Requests', icon: Headphones },
  { href: '/cards',             label: 'Cards & Rewards',  icon: CreditCard },
];

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, themes, setTheme } = useTheme();

  const moreActive = moreTabs.some(
    t => pathname === t.href || pathname.startsWith(`${t.href}/`),
  );

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={() => setMoreOpen(false)}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden',
          moreOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* ── More sheet ──────────────────────────────────────────────────────
          Anchored at bottom-0 (same as tab bar) so translate-y-full pushes
          the entire sheet fully below the viewport when closed.
          pb-16 inside keeps links clear of the tab bar when open.
      ────────────────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
          'rounded-t-2xl border-t border-ui-border bg-brand-card shadow-xl',
          'transition-transform duration-300 ease-in-out',
          moreOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <span className="text-sm font-semibold text-content-primary">More</span>
          <button
            onClick={() => setMoreOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-content-secondary hover:text-content-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <ul className="divide-y divide-ui-border border-t border-ui-border px-3 pt-1">
          {moreTabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition-colors',
                    active
                      ? 'text-accent'
                      : 'text-content-secondary hover:text-content-primary',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Theme switcher ── */}
        <div className="border-t border-ui-border px-5 pb-20 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-content-secondary">
            Theme
          </p>
          <div className="flex gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                title={t.name}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'h-7 w-7 rounded-full transition-transform hover:scale-110',
                  themeSwatches[t.id],
                  theme.id === t.id && 'ring-2 ring-accent ring-offset-2',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <nav
        aria-label="Main navigation"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 lg:hidden',
          'flex h-16 items-stretch border-t border-ui-border bg-brand-card',
        )}
      >
        {primaryTabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center justify-center gap-1"
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-colors',
                  active ? 'text-accent' : 'text-content-secondary',
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors',
                  active ? 'text-accent' : 'text-content-secondary',
                )}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(v => !v)}
          aria-label="More navigation options"
          aria-expanded={moreOpen}
          className="relative flex flex-1 flex-col items-center justify-center gap-1"
        >
          <MoreHorizontal
            className={cn(
              'h-5 w-5 transition-colors',
              moreActive ? 'text-accent' : 'text-content-secondary',
            )}
          />
          <span
            className={cn(
              'text-[10px] font-medium transition-colors',
              moreActive ? 'text-accent' : 'text-content-secondary',
            )}
          >
            More
          </span>
          {moreActive && (
            <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-accent" />
          )}
        </button>
      </nav>
    </>
  );
}
