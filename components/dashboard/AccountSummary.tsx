'use client';

import Link from 'next/link';
import { Home, Landmark, Lock, User } from 'lucide-react';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { Amount } from '@/components/ui/Amount';
import type { HomeLoanAccount, PersonalLoanAccount } from '@/types/account';

type AnyLoan = HomeLoanAccount | PersonalLoanAccount;

function sanctioned(loan: AnyLoan) {
  return loan.type === 'home_loan' ? loan.principalAmount : loan.sanctionedAmount;
}

/* ── Skeleton ─────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="animate-pulse divide-y divide-ui-border">
      {[0, 1, 2].map(i => (
        <div key={i} className="flex items-center gap-3 py-3.5">
          <div className="h-9 w-9 rounded-lg bg-brand-page" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 rounded bg-brand-page" />
            <div className="h-2.5 w-44 rounded bg-brand-page" />
          </div>
          <div className="h-3 w-16 rounded bg-brand-page" />
        </div>
      ))}
    </div>
  );
}

/* ── Summary row ──────────────────────────────────────── */
function SummaryRow({
  icon: Icon,
  iconClassName,
  label,
  meta,
  primary,
  primaryLabel,
}: {
  icon: React.ElementType;
  iconClassName: string;
  label: string;
  meta: string;
  primary: React.ReactNode;
  primaryLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-content-primary">{label}</p>
        <p className="truncate text-xs text-content-secondary">{meta}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-content-primary">{primary}</p>
        <p className="text-xs text-content-secondary">{primaryLabel}</p>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */
export function AccountSummary() {
  const { accounts, loading, error } = useAccounts();

  const savings  = accounts.filter(a => a.type === 'savings');
  const fds      = accounts.filter(a => a.type === 'fixed_deposit');
  const loans    = accounts.filter(
    a => a.type === 'home_loan' || a.type === 'personal_loan',
  ) as AnyLoan[];

  const totalAvailable  = savings.reduce((s, a) => s + (a.type === 'savings' ? a.availableBalance : 0), 0);
  const totalPrincipal  = fds.reduce((s, a) => s + (a.type === 'fixed_deposit' ? a.principal : 0), 0);
  const totalMaturity   = fds.reduce((s, a) => s + (a.type === 'fixed_deposit' ? a.maturityAmount : 0), 0);
  const totalOutstanding = loans.reduce((s, l) => s + l.outstandingAmount, 0);
  const totalSanctioned  = loans.reduce((s, l) => s + sanctioned(l), 0);
  const repaidPercent    = totalSanctioned > 0
    ? Math.round(((totalSanctioned - totalOutstanding) / totalSanctioned) * 100)
    : 0;

  return (
    <div className="rounded-xl border border-ui-border bg-brand-card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-semibold text-content-primary">Accounts</h2>
        <Link href="/accounts" className="text-xs font-medium text-accent hover:underline">
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
          {savings.length > 0 && (
            <SummaryRow
              icon={Landmark}
              iconClassName="bg-blue-50 text-blue-600"
              label="Savings"
              meta={`${savings.length} account${savings.length > 1 ? 's' : ''}`}
              primary={<Amount value={totalAvailable} />}
              primaryLabel="available"
            />
          )}
          {fds.length > 0 && (
            <SummaryRow
              icon={Lock}
              iconClassName="bg-violet-50 text-violet-600"
              label="Fixed Deposits"
              meta={`${fds.length} deposit${fds.length > 1 ? 's' : ''} · ₹${(totalMaturity / 100000).toFixed(1)}L at maturity`}
              primary={<Amount value={totalPrincipal} />}
              primaryLabel="principal"
            />
          )}
          {loans.length > 0 && (
            <SummaryRow
              icon={loans.some(l => l.type === 'home_loan') ? Home : User}
              iconClassName="bg-amber-50 text-amber-600"
              label="Loans"
              meta={`${loans.length} loan${loans.length > 1 ? 's' : ''} · ${repaidPercent}% repaid`}
              primary={<Amount value={totalOutstanding} />}
              primaryLabel="outstanding"
            />
          )}
        </div>
      )}
    </div>
  );
}
