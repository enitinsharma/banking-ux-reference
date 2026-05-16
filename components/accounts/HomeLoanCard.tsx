import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { HomeLoanAccount } from '@/types/account';

interface Props { account: HomeLoanAccount }

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-page">
      <div
        className="h-full rounded-full bg-amber-500 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function HomeLoanCard({ account }: Props) {
  const repaid = account.principalAmount - account.outstandingAmount;
  const repaidPercent = Math.round((repaid / account.principalAmount) * 100);
  const tenureYears = account.tenureMonths / 12;
  const elapsedYears = (account.elapsedMonths / 12).toFixed(1);

  // Warn if EMI is due within 7 days
  const daysUntilEmi = Math.ceil(
    (new Date(account.nextEmiDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const emiDueSoon = daysUntilEmi >= 0 && daysUntilEmi <= 7;

  return (
    <div className="overflow-hidden rounded-xl border border-ui-border bg-brand-card">
      {/* ── Coloured top bar ── */}
      <div className="h-1.5 bg-amber-500" />

      <div className="p-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-content-secondary">
                Home Loan
              </p>
              <p className="text-sm font-semibold text-content-primary">
                {account.interestRate}% p.a. · {tenureYears}-year tenure
              </p>
            </div>
          </div>
          <span className="rounded-full border border-ui-border px-2.5 py-1 font-mono text-xs text-content-secondary">
            ···· {account.accountNumber.slice(-4)}
          </span>
        </div>

        {/* ── Outstanding + original ── */}
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-content-secondary">
            Outstanding Amount
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-content-primary">
            {formatCurrency(account.outstandingAmount)}
          </p>
          <p className="mt-0.5 text-sm text-content-secondary">
            of {formatCurrency(account.principalAmount)} original loan
          </p>
        </div>

        {/* ── EMI details ── */}
        <div className={`mt-5 flex items-start justify-between rounded-xl border px-4 py-3 ${
          emiDueSoon
            ? 'border-amber-200 bg-amber-50'
            : 'border-ui-border bg-brand-page'
        }`}>
          <div>
            <p className="text-xs text-content-secondary">Monthly EMI</p>
            <p className="mt-0.5 text-lg font-bold text-content-primary">
              {formatCurrency(account.emi)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-content-secondary">Next Due Date</p>
            <p className={`mt-0.5 text-sm font-semibold ${
              emiDueSoon ? 'text-amber-700' : 'text-content-primary'
            }`}>
              {formatDate(account.nextEmiDate)}
            </p>
            {emiDueSoon && (
              <p className="mt-0.5 flex items-center justify-end gap-1 text-xs font-medium text-amber-700">
                <AlertCircle className="h-3 w-3" />
                Due in {daysUntilEmi} day{daysUntilEmi !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* ── Repayment progress ── */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-content-secondary">Repayment Progress</p>
            <p className="text-xs font-semibold text-content-primary">
              {account.elapsedMonths} of {account.tenureMonths} months · {repaidPercent}%
            </p>
          </div>
          <ProgressBar value={repaidPercent} />
          <p className="mt-2 text-xs text-content-secondary">
            {formatCurrency(repaid)} repaid · {formatCurrency(account.outstandingAmount)} remaining ·{' '}
            {elapsedYears} of {tenureYears} years
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/transfer">
            <Button variant="primary" size="sm">Pay EMI</Button>
          </Link>
          <Button variant="secondary" size="sm">Download Statement</Button>
          <Button variant="ghost" size="sm">Loan Details</Button>
        </div>
      </div>
    </div>
  );
}
