import { formatCurrency } from '@/lib/utils';
import { HomeLoanRow } from './HomeLoanRow';
import { PersonalLoanRow } from './PersonalLoanRow';
import type { HomeLoanAccount, PersonalLoanAccount } from '@/types/account';

type AnyLoan = HomeLoanAccount | PersonalLoanAccount;

function sanctioned(loan: AnyLoan): number {
  return loan.type === 'home_loan' ? loan.principalAmount : loan.sanctionedAmount;
}

interface Props {
  accounts: AnyLoan[];
}

export function LoansSection({ accounts }: Props) {
  if (accounts.length === 0) return null;

  const totalOutstanding = accounts.reduce((s, l) => s + l.outstandingAmount, 0);
  const totalSanctioned  = accounts.reduce((s, l) => s + sanctioned(l), 0);
  const totalRepaid      = totalSanctioned - totalOutstanding;

  return (
    <div className="overflow-hidden rounded-xl border border-ui-border bg-brand-card">
      {/* Accent bar */}
      <div className="h-1.5 bg-amber-500" />

      <div className="p-5">
        {/* ── Section header ── */}
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
                {formatCurrency(totalSanctioned)}
              </span>
            </span>
          </div>
        </div>

        {/* ── Loan rows ── */}
        <div className="mt-2 divide-y divide-ui-border">
          {accounts.map(loan =>
            loan.type === 'home_loan'
              ? <HomeLoanRow     key={loan.id} account={loan} />
              : <PersonalLoanRow key={loan.id} account={loan} />,
          )}
        </div>
      </div>
    </div>
  );
}
