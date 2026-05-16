import { formatCurrency } from '@/lib/utils';
import { HomeLoanRow } from './HomeLoanRow';
import type { HomeLoanAccount } from '@/types/account';

interface Props { accounts: HomeLoanAccount[] }

export function LoansSection({ accounts }: Props) {
  if (accounts.length === 0) return null;

  const totalOutstanding = accounts.reduce((sum, l) => sum + l.outstandingAmount, 0);
  const totalPrincipal   = accounts.reduce((sum, l) => sum + l.principalAmount, 0);
  const totalRepaid      = totalPrincipal - totalOutstanding;

  return (
    <div className="overflow-hidden rounded-xl border border-ui-border bg-brand-card">
      {/* Accent bar */}
      <div className="h-1.5 bg-amber-500" />

      <div className="p-5">
        {/* ── Section header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-content-primary">
              Loans
              <span className="ml-2 text-sm font-normal text-content-secondary">
                ({accounts.length})
              </span>
            </h2>

            {/* Corpus summary */}
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
              <span>
                Outstanding&nbsp;
                <span className="font-semibold text-content-primary">
                  {formatCurrency(totalOutstanding)}
                </span>
              </span>
              <span>
                Repaid&nbsp;
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(totalRepaid)}
                </span>
              </span>
              <span>
                Sanctioned&nbsp;
                <span className="font-semibold text-content-primary">
                  {formatCurrency(totalPrincipal)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Loan rows ── */}
        <div className="mt-2 divide-y divide-ui-border">
          {accounts.map(loan => (
            <HomeLoanRow key={loan.id} account={loan} />
          ))}
        </div>
      </div>
    </div>
  );
}
