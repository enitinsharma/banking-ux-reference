'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Contact {
  id: number;
  name: string;
  upiId: string;
  bank: string;
  initials: string;
  color: string;
}

// Mock recent payees — sourced from transaction history names
const contacts: Contact[] = [
  { id: 1, name: 'Vidhi Sharma',  upiId: 'vidhi.sharma@okaxis',   bank: 'Axis Bank',  initials: 'VS', color: 'bg-pink-100   text-pink-700'    },
  { id: 2, name: 'Rajesh Kumar',  upiId: 'rajesh.kumar@oksbi',    bank: 'SBI',        initials: 'RK', color: 'bg-blue-100   text-blue-700'    },
  { id: 3, name: 'Priya Verma',   upiId: 'priya.verma@ybl',       bank: 'PhonePe',    initials: 'PV', color: 'bg-purple-100 text-purple-700'  },
  { id: 4, name: 'Amit Kumar',    upiId: 'amit.kumar@okicici',    bank: 'ICICI Bank', initials: 'AK', color: 'bg-emerald-100 text-emerald-700' },
  { id: 5, name: 'Kavita Nair',   upiId: 'kavita.n@okhdfcbank',   bank: 'HDFC Bank',  initials: 'KN', color: 'bg-orange-100 text-orange-700'  },
  { id: 6, name: 'Suresh Mehta',  upiId: 'suresh.m@paytm',        bank: 'Paytm',      initials: 'SM', color: 'bg-teal-100   text-teal-700'    },
];

interface PayContactSheetProps {
  open: boolean;
  onClose: () => void;
}

export function PayContactSheet({ open, onClose }: PayContactSheetProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Reset search on close
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const filtered = query.trim() === ''
    ? contacts
    : contacts.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.upiId.toLowerCase().includes(query.toLowerCase()),
      );

  function handleSelect(contact: Contact) {
    onClose();
    router.push(`/transfer?to=${encodeURIComponent(contact.upiId)}`);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-50 bg-black/60 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pay a Contact"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 flex max-h-[75vh] flex-col rounded-t-2xl bg-brand-card',
          'transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-ui-border" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 py-4">
          <h2 className="text-base font-semibold text-content-primary">Pay a Contact</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-content-secondary transition-colors hover:text-content-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="shrink-0 px-5 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-secondary" />
            <input
              type="text"
              autoFocus
              placeholder="Name or UPI ID"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className={cn(
                'w-full rounded-lg border border-ui-border bg-brand-page py-2 pl-9 pr-3',
                'text-sm text-content-primary placeholder:text-content-secondary',
                'focus:outline-none focus:ring-2 focus:ring-accent',
              )}
            />
          </div>
        </div>

        {/* Section label */}
        <p className="shrink-0 px-5 pb-1 text-xs font-medium uppercase tracking-wide text-content-secondary">
          {query ? 'Results' : 'Recent'}
        </p>

        {/* Contact list */}
        <ul className="flex-1 divide-y divide-ui-border overflow-y-auto px-5 pb-6">
          {filtered.length === 0 ? (
            <li className="py-8 text-center text-sm text-content-secondary">
              No contacts found
            </li>
          ) : (
            filtered.map(contact => (
              <li key={contact.id}>
                <button
                  onClick={() => handleSelect(contact)}
                  className="flex w-full items-center gap-3 py-3 text-left transition-opacity hover:opacity-70"
                >
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    contact.color,
                  )}>
                    {contact.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-content-primary">{contact.name}</p>
                    <p className="truncate text-xs text-content-secondary">{contact.upiId}</p>
                  </div>
                  <span className="shrink-0 text-xs text-content-secondary">{contact.bank}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
