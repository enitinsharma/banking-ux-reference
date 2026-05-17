import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { formatCurrency, formatCurrencyCompact, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { HomeLoanAccount } from '@/types/account';

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-page">
      <div
        className="h-full rounded-full bg-amber-500 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface Props { account: HomeLoanAccount }

export function HomeLoanRow({ account }: Props) {
  const repaid = account.principalAmount - account.outstandingAmount;
  const progress = Math.round((repaid / account.principalAmount) * 100);
  const monthsLeft = account.tenureMonths - account.elapsedMonths;
  const yearsLeft = (monthsLeft / 12).toFixed(1);

  const daysUntilEmi = Math.ceil(
    (new Date(account.nextEmiDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const emiDueSoon = daysUntilEmi >= 0 && daysUntilEmi <= 7;
  const emiClass = emiDueSoon ? 'font-medium text-amber-600' : 'text-content-secondary';

  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Home className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-content-primary">
                {account.interestRate}%
                <span className="ml-1.5 font-normal text-content-secondary">
                  · {account.tenureMonths / 12}yr
                </span>
              </p>
              <p className="mt-0.5 font-mono text-xs text-content-secondary">
                {account.accountNumber}
              </p>
            </div>

            {/* Right — compact on mobile, full on desktop */}
            <div className="text-right">
              {/* Desktop */}
              <p className="hidden text-sm font-semibold text-content-primary sm:block">
                {formatCurrency(account.outstandingAmount)}
                <span className="ml-1 text-xs font-normal text-content-secondary">outstanding</span>
              </p>
              <p className={`hidden items-center justify-end gap-1 text-xs sm:flex ${emiClass}`}>
                {emiDueSoon && <AlertCircle className="h-3 w-3" />}
                EMI {formatCurrency(account.emi)} · due {formatDate(account.nextEmiDate)}
              </p>

              {/* Mobile */}
              <p className="text-sm font-semibold text-content-primary sm:hidden">
                {formatCurrencyCompact(account.outstandingAmount)}
                <span className="ml-1 text-xs font-normal text-content-secondary">due</span>
              </p>
              <p className={`flex items-center justify-end gap-1 text-xs sm:hidden ${emiClass}`}>
                {emiDueSoon && <AlertCircle className="h-3 w-3" />}
                {formatCurrencyCompact(account.emi)}/mo · {formatDate(account.nextEmiDate)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-2.5">
            <ProgressBar value={progress} />
            <div className="mt-1 flex items-center justify-between text-[11px] text-content-secondary">
              {/* Desktop: repaid amount + percentage */}
              <span className="hidden sm:inline">
                {formatCurrency(repaid)} repaid · {progress}%
              </span>
              {/* Mobile: percentage only */}
              <span className="sm:hidden">{progress}% repaid</span>
              <span>{yearsLeft} yrs remaining</span>
            </div>
          </div>

          {/* Actions — primary only on mobile */}
          <div className="mt-3 flex gap-2">
            <Link href="/transfer">
              <Button variant="secondary" size="sm">Pre-pay</Button>
            </Link>
            <Button variant="secondary" size="sm">Statement</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
