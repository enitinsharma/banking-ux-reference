'use client';

import Link from 'next/link';
import { Home, Landmark, Lock } from 'lucide-react';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Account } from '@/types/account';

/* ── Progress bar ─────────────────────────────────────── */
function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-page">
      <div
        className={cn('h-full rounded-full transition-all', className ?? 'bg-accent')}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ── Individual account row ───────────────────────────── */
function AccountRow({ account }: { account: Account }) {
  if (account.type === 'savings') {
    return (
      <div className="flex items-start gap-3 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Landmark className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-content-primary">Savings Account</p>
          <p className="text-xs text-content-secondary">···· {account.accountNumber.slice(-4)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-content-primary">
            {formatCurrency(account.balance)}
          </p>
          <p className="text-xs text-content-secondary">
            Avail. {formatCurrency(account.availableBalance)}
          </p>
        </div>
      </div>
    );
  }

  if (account.type === 'fixed_deposit') {
    const progress = Math.round((account.tenureElapsed / account.tenure) * 100);
    return (
      <div className="py-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Lock className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-content-primary">Fixed Deposit</p>
            <p className="text-xs text-content-secondary">{account.interestRate}% p.a.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-content-primary">
              {formatCurrency(account.principal)}
            </p>
            <p className="text-xs text-content-secondary">
              Matures {formatDate(account.maturityDate)}
            </p>
          </div>
        </div>
        <div className="pl-12">
          <ProgressBar value={progress} className="bg-violet-500" />
          <p className="mt-1 text-right text-[11px] text-content-secondary">
            {account.tenureElapsed} of {account.tenure} months
          </p>
        </div>
      </div>
    );
  }

  if (account.type === 'home_loan') {
    const repaid = account.principalAmount - account.outstandingAmount;
    const progress = Math.round((repaid / account.principalAmount) * 100);
    return (
      <div className="py-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Home className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-content-primary">Home Loan</p>
            <p className="text-xs text-content-secondary">{account.interestRate}% p.a.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-content-primary">
              {formatCurrency(account.outstandingAmount)}
            </p>
            <p className="text-xs text-content-secondary">outstanding</p>
          </div>
        </div>
        <div className="pl-12">
          <ProgressBar value={progress} className="bg-amber-500" />
          <p className="mt-1 text-right text-[11px] text-content-secondary">
            EMI {formatCurrency(account.emi)} · due {formatDate(account.nextEmiDate)}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/* ── Skeleton ─────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 py-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-brand-page" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 rounded bg-brand-page" />
            <div className="h-2.5 w-16 rounded bg-brand-page" />
          </div>
          <div className="space-y-1.5 text-right">
            <div className="h-3 w-20 rounded bg-brand-page" />
            <div className="h-2.5 w-14 rounded bg-brand-page" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */
export function AccountSummary() {
  const { accounts, loading, error } = useAccounts();

  return (
    <div className="rounded-xl border border-ui-border bg-brand-card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-semibold text-content-primary">Accounts</h2>
        <Link
          href="/accounts"
          className="text-xs font-medium text-accent hover:underline"
        >
          View all
        </Link>
      </div>

      {loading && <Skeleton />}

      {error && (
        <p className="py-6 text-center text-sm text-content-secondary">
          Could not load accounts.
        </p>
      )}

      {!loading && !error && (
        <div className="divide-y divide-ui-border">
          {accounts.map(account => (
            <AccountRow key={account.id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}
