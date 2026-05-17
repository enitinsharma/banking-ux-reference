'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LockKeyhole, PiggyBank, QrCode, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScanPaySheet } from './ScanPaySheet';
import { PayContactSheet } from './PayContactSheet';

type SheetId = 'scan' | 'contact' | null;

/* ── Action definitions ───────────────────────────────────
   sheet: opens a modal flow (no full-page navigation)
   href:  navigates directly to a page
─────────────────────────────────────────────────────────── */
const actions = [
  {
    id: 'scan'    as SheetId,
    label: 'Scan & Pay',
    sublabel: 'Any UPI QR',
    icon: QrCode,
    iconClassName: 'bg-blue-50 text-blue-600',
    ringClassName: 'hover:ring-blue-200',
    href: null,
  },
  {
    id: 'contact' as SheetId,
    label: 'Pay Contact',
    sublabel: 'Recent payees',
    icon: UserRound,
    iconClassName: 'bg-violet-50 text-violet-600',
    ringClassName: 'hover:ring-violet-200',
    href: null,
  },
  {
    id: null,
    label: 'Book FD',
    sublabel: 'Fixed deposit',
    icon: PiggyBank,
    iconClassName: 'bg-teal-50 text-teal-600',
    ringClassName: 'hover:ring-teal-200',
    href: '/accounts',
  },
  {
    id: null,
    label: 'Block Card',
    sublabel: 'Instant freeze',
    icon: LockKeyhole,
    iconClassName: 'bg-red-50 text-red-600',
    ringClassName: 'hover:ring-red-200',
    href: '/cards',
  },
] as const;

export function QuickActions() {
  const [openSheet, setOpenSheet] = useState<SheetId>(null);

  return (
    <>
      <div className="rounded-xl border border-ui-border bg-brand-page p-5">
        <h2 className="mb-4 text-base font-semibold text-content-primary">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map(({ id, label, sublabel, icon: Icon, href, iconClassName, ringClassName }) => {
            const tile = (
              <div className={cn(
                'flex flex-col items-center gap-2 rounded-xl bg-brand-card p-3.5',
                'shadow-sm transition-all duration-200',
                'hover:shadow-md hover:ring-2 cursor-pointer',
                ringClassName,
              )}>
                <div className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full',
                  iconClassName,
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-content-primary">{label}</p>
                  <p className="text-[10px] text-content-secondary">{sublabel}</p>
                </div>
              </div>
            );

            // Sheet-based actions: button trigger
            if (id !== null) {
              return (
                <button
                  key={label}
                  onClick={() => setOpenSheet(id)}
                  className="text-left"
                >
                  {tile}
                </button>
              );
            }

            // Nav actions: Link
            return (
              <Link key={label} href={href!}>
                {tile}
              </Link>
            );
          })}
        </div>
      </div>

      <ScanPaySheet    open={openSheet === 'scan'}    onClose={() => setOpenSheet(null)} />
      <PayContactSheet open={openSheet === 'contact'} onClose={() => setOpenSheet(null)} />
    </>
  );
}
