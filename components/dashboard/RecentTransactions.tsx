'use client';

import Link from 'next/link';
import {
  ArrowLeftRight,
  Banknote,
  Briefcase,
  CircleDot,
  Shield,
  ShoppingBag,
  TrendingUp,
  Tv2,
  Utensils,
  Wifi,
  Zap,
} from 'lucide-react';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Amount } from '@/components/ui/Amount';
import type { TransactionCategory } from '@/types/transaction';

/* ── Category metadata ────────────────────────────────── */
const categoryMeta: Record<
  TransactionCategory,
  { icon: React.ElementType; iconClassName: string; label: string }
> = {
  salary:        { icon: Briefcase,      iconClassName: 'bg-emerald-50 text-emerald-600', label: 'Salary' },
  shopping:      { icon: ShoppingBag,    iconClassName: 'bg-purple-50 text-purple-600',   label: 'Shopping' },
  food:          { icon: Utensils,       iconClassName: 'bg-orange-50 text-orange-600',   label: 'Food' },
  utilities:     { icon: Zap,            iconClassName: 'bg-yellow-50 text-yellow-600',   label: 'Utilities' },
  cash:          { icon: Banknote,       iconClassName: 'bg-slate-100 text-slate-600',    label: 'Cash' },
  entertainment: { icon: Tv2,            iconClassName: 'bg-pink-50 text-pink-600',       label: 'Entertainment' },
  transfer:      { icon: ArrowLeftRight, iconClassName: 'bg-blue-50 text-blue-600',       label: 'Transfer' },
  investment:    { icon: TrendingUp,     iconClassName: 'bg-teal-50 text-teal-600',       label: 'Investment' },
  telecom:       { icon: Wifi,           iconClassName: 'bg-cyan-50 text-cyan-600',       label: 'Telecom' },
  insurance:     { icon: Shield,         iconClassName: 'bg-indigo-50 text-indigo-600',   label: 'Insurance' },
  other:         { icon: CircleDot,      iconClassName: 'bg-slate-100 text-slate-500',    label: 'Other' },
};

/* ── Skeleton ─────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="animate-pulse divide-y divide-ui-border">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 py-3">
          <div className="h-9 w-9 rounded-lg bg-brand-page" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-40 rounded bg-brand-page" />
            <div className="h-2.5 w-20 rounded bg-brand-page" />
          </div>
          <div className="h-3.5 w-20 rounded bg-brand-page" />
        </div>
      ))}
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */
export function RecentTransactions() {
  const { transactions, loading, error } = useTransactions({ limit: 5 });
  const { accounts } = useAccounts();

  function accountLabel(accountId: string) {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return null;
    const last4 = `****${acc.accountNumber.slice(-4)}`;
    const isJoint = acc.type === 'savings' && acc.isJoint;
    return isJoint ? `${last4} · Joint` : last4;
  }

  return (
    <div className="rounded-xl border border-ui-border bg-brand-card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-semibold text-content-primary">Recent Transactions</h2>
        <Link
          href="/transactions"
          className="text-xs font-medium text-accent hover:underline"
        >
          View all
        </Link>
      </div>

      {loading && <Skeleton />}

      {error && (
        <p className="py-8 text-center text-sm text-content-secondary">
          Could not load transactions.
        </p>
      )}

      {!loading && !error && (
        <ul className="divide-y divide-ui-border">
          {transactions.map(txn => {
            const meta = categoryMeta[txn.category];
            const Icon = meta.icon;
            const isCredit = txn.type === 'credit';

            return (
              <li key={txn.id} className="flex items-center gap-3 py-3">
                {/* Category icon */}
                <div className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                  meta.iconClassName,
                )}>
                  <Icon className="h-4 w-4" />
                </div>

                {/* Description + date */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-content-primary">
                    {txn.description}
                  </p>
                  <p className="truncate text-xs text-content-secondary">
                    {meta.label} · {accountLabel(txn.accountId)} · {formatDate(txn.date)}
                  </p>
                </div>

                {/* Amount */}
                <Amount
                  value={txn.amount}
                  prefix={isCredit ? '+' : '−'}
                  className={cn(
                    'shrink-0 text-sm font-semibold tabular-nums',
                    isCredit ? 'text-emerald-600' : 'text-content-primary',
                  )}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
