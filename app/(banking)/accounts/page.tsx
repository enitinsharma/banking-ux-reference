'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { SavingsCard } from '@/components/accounts/SavingsCard';
import { FixedDepositCard } from '@/components/accounts/FixedDepositCard';
import { HomeLoanCard } from '@/components/accounts/HomeLoanCard';
import { useAccounts } from '@/lib/hooks/useAccounts';

/* ── Skeleton ─────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-ui-border bg-brand-card">
      <div className="h-1.5 bg-brand-page" />
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-page" />
          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-brand-page" />
            <div className="h-3 w-36 rounded bg-brand-page" />
          </div>
        </div>
        <div className="h-9 w-48 rounded bg-brand-page" />
        <div className="space-y-2 rounded-lg border border-ui-border p-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-24 rounded bg-brand-page" />
              <div className="h-3 w-32 rounded bg-brand-page" />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-28 rounded-lg bg-brand-page" />
          <div className="h-8 w-36 rounded-lg bg-brand-page" />
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function AccountsPage() {
  const { accounts, loading, error } = useAccounts();

  const savings    = accounts.find(a => a.type === 'savings');
  const fixedDeposit = accounts.find(a => a.type === 'fixed_deposit');
  const homeLoan   = accounts.find(a => a.type === 'home_loan');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        description="Your savings, deposits, and loans."
      />

      {/* ── Loading ── */}
      {loading && (
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="rounded-xl border border-ui-border bg-brand-card p-8 text-center">
          <p className="text-sm text-content-secondary">
            Could not load accounts. Please try again.
          </p>
        </div>
      )}

      {/* ── Content ── */}
      {!loading && !error && (
        <div className="space-y-6">
          {savings      && <SavingsCard      account={savings} />}
          {fixedDeposit && <FixedDepositCard account={fixedDeposit} />}
          {homeLoan     && <HomeLoanCard     account={homeLoan} />}
        </div>
      )}
    </div>
  );
}
