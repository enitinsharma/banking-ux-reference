'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { SavingsCard } from '@/components/accounts/SavingsCard';
import { FixedDepositsSection } from '@/components/accounts/FixedDepositsSection';
import { LoansSection } from '@/components/accounts/LoansSection';
import { useAccounts } from '@/lib/hooks/useAccounts';
import type { FixedDepositAccount, HomeLoanAccount, PersonalLoanAccount } from '@/types/account';

/* ── Skeleton ─────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-ui-border bg-brand-card">
      <div className="h-1.5 bg-brand-page" />
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand-page" />
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-brand-page" />
              <div className="h-3 w-36 rounded bg-brand-page" />
            </div>
          </div>
          <div className="h-6 w-20 rounded-full bg-brand-page" />
        </div>
        <div className="h-8 w-48 rounded bg-brand-page" />
        <div className="space-y-3">
          {[0, 1].map(i => (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className="h-9 w-9 rounded-lg bg-brand-page" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 rounded bg-brand-page" />
                <div className="h-2.5 w-full rounded bg-brand-page" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function AccountsPage() {
  const { accounts, loading, error } = useAccounts();

  const savings       = accounts.find(a => a.type === 'savings');
  const fixedDeposits = accounts.filter(a => a.type === 'fixed_deposit') as FixedDepositAccount[];
  const loans         = accounts.filter(
    a => a.type === 'home_loan' || a.type === 'personal_loan',
  ) as (HomeLoanAccount | PersonalLoanAccount)[];

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
          {savings         && <SavingsCard           account={savings} />}
          {fixedDeposits.length > 0 && <FixedDepositsSection accounts={fixedDeposits} />}
          {loans.length > 0         && <LoansSection         accounts={loans} />}
        </div>
      )}
    </div>
  );
}
