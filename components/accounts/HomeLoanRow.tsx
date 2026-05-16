import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
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

  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Home className="h-4 w-4" />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            {/* Left — rate + tenure */}
            <div>
              <p className="text-sm font-semibold text-content-primary">
                {account.interestRate}% p.a.
                <span className="ml-1.5 font-normal text-content-secondary">
                  · {account.tenureMonths / 12}-yr tenure
                </span>
              </p>
              <p className="mt-0.5 font-mono text-xs text-content-secondary">
                {account.accountNumber}
              </p>
            </div>

            {/* Right — outstanding + EMI */}
            <div className="text-right">
              <p className="text-sm font-semibold text-content-primary">
                {formatCurrency(account.outstandingAmount)}
                <span className="ml-1 text-xs font-normal text-content-secondary">outstanding</span>
              </p>
              <p className={`mt-0.5 flex items-center justify-end gap-1 text-xs ${
                emiDueSoon ? 'font-medium text-amber-600' : 'text-content-secondary'
              }`}>
                {emiDueSoon && <AlertCircle className="h-3 w-3" />}
                EMI {formatCurrency(account.emi)} · due {formatDate(account.nextEmiDate)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-2.5">
            <ProgressBar value={progress} />
            <div className="mt-1 flex items-center justify-between text-[11px] text-content-secondary">
              <span>{formatCurrency(repaid)} repaid · {progress}%</span>
              <span>{yearsLeft} yrs remaining</span>
            </div>
          </div>

          {/* Row actions */}
          <div className="mt-3 flex gap-2">
            <Link href="/transfer">
              <Button variant="ghost" size="sm">Pay EMI</Button>
            </Link>
            <Button variant="ghost" size="sm">Statement</Button>
            <Button variant="ghost" size="sm">Details</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
