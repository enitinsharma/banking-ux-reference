import { Lock, RefreshCw } from 'lucide-react';
import { formatCurrency, formatCurrencyCompact, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { FixedDepositAccount } from '@/types/account';

const PAYOUT_LABEL: Record<FixedDepositAccount['payoutFrequency'], string> = {
  monthly:     'Monthly payout',
  quarterly:   'Quarterly payout',
  on_maturity: 'Payout at maturity',
};

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-page">
      <div
        className="h-full rounded-full bg-violet-500 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function AmountBlock({ account }: { account: FixedDepositAccount }) {
  const totalInterest = account.maturityAmount - account.principal;

  if (account.payoutFrequency === 'on_maturity') {
    return (
      <div className="text-right">
        {/* Desktop: full principal → maturity */}
        <p className="hidden text-sm font-semibold text-content-primary sm:block">
          {formatCurrency(account.principal)}
          <span className="mx-1 font-normal text-content-secondary">→</span>
          <span className="text-violet-600">{formatCurrency(account.maturityAmount)}</span>
        </p>
        <p className="hidden text-xs font-medium text-emerald-600 sm:block">
          +{formatCurrency(totalInterest)} interest
        </p>

        {/* Mobile: compact principal → maturity so the arrow clarifies both numbers */}
        <p className="text-sm font-semibold text-content-primary sm:hidden">
          {formatCurrencyCompact(account.principal)}
          <span className="mx-1 font-normal text-content-secondary">→</span>
          <span className="text-violet-600">{formatCurrencyCompact(account.maturityAmount)}</span>
        </p>
        <p className="text-xs font-medium text-emerald-600 sm:hidden">
          +{formatCurrencyCompact(totalInterest)} interest
        </p>

        <p className="mt-0.5 text-xs text-content-secondary">
          Matures {formatDate(account.maturityDate)}
        </p>
      </div>
    );
  }

  // Monthly / quarterly — interest paid periodically; principal returned at maturity
  const divisor     = account.payoutFrequency === 'monthly' ? 12 : 4;
  const periodLabel = account.payoutFrequency === 'monthly' ? 'mo' : 'qtr';
  const periodicPayout = Math.round((account.principal * account.interestRate) / 100 / divisor);

  return (
    <div className="text-right">
      {/* Desktop */}
      <p className="hidden text-sm font-semibold text-content-primary sm:block">
        {formatCurrency(account.principal)}
        <span className="ml-1 text-xs font-normal text-content-secondary">principal</span>
      </p>
      <p className="hidden text-xs font-medium text-emerald-600 sm:block">
        {formatCurrency(periodicPayout)}/{periodLabel} · +{formatCurrency(totalInterest)} total
      </p>

      {/* Mobile: principal labelled + periodic payout */}
      <p className="text-sm font-semibold text-content-primary sm:hidden">
        {formatCurrencyCompact(account.principal)}
        <span className="ml-1 text-xs font-normal text-content-secondary">deposit</span>
      </p>
      <p className="text-xs font-medium text-emerald-600 sm:hidden">
        {formatCurrencyCompact(periodicPayout)}/{periodLabel} payout
      </p>

      <p className="mt-0.5 text-xs text-content-secondary">
        Matures {formatDate(account.maturityDate)}
      </p>
    </div>
  );
}

interface Props { account: FixedDepositAccount }

export function FixedDepositRow({ account }: Props) {
  const progress   = Math.round((account.tenureElapsed / account.tenure) * 100);
  const monthsLeft = account.tenure - account.tenureElapsed;

  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <Lock className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Top row: rate + account no. | amount block */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-content-primary">
                {account.interestRate}% p.a.
                <span className="ml-1.5 font-normal text-content-secondary">· {account.tenure}mo</span>
              </p>
              {/* Account number: inline on mobile, own line on desktop */}
              <p className="mt-0.5 font-mono text-xs text-content-secondary">
                {account.accountNumber}
              </p>
            </div>

            <AmountBlock account={account} />
          </div>

          {/* Badges — hidden on mobile to reduce clutter; format already implies payout type */}
          <div className="mt-2 hidden flex-wrap items-center gap-1.5 sm:flex">
            <span className="rounded-full border border-ui-border px-2 py-0.5 text-[11px] text-content-secondary">
              {PAYOUT_LABEL[account.payoutFrequency]}
            </span>
            {account.autoRenew && (
              <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                <RefreshCw className="h-2.5 w-2.5" />
                Auto-renew
              </span>
            )}
          </div>

          {/* Auto-renew only on mobile (payout badge omitted) */}
          {account.autoRenew && (
            <div className="mt-1.5 flex sm:hidden">
              <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                <RefreshCw className="h-2.5 w-2.5" />
                Auto-renew
              </span>
            </div>
          )}

          {/* Progress */}
          <div className="mt-2.5">
            <ProgressBar value={progress} />
            <div className="mt-1 flex items-center justify-between text-[11px] text-content-secondary">
              {/* Desktop: full stats */}
              <span className="hidden sm:inline">
                {account.tenureElapsed} of {account.tenure} months · {progress}%
              </span>
              {/* Mobile: compact */}
              <span className="sm:hidden">{progress}%</span>
              <span className={monthsLeft <= 3 ? 'font-medium text-amber-600' : ''}>
                {monthsLeft} mo. left
              </span>
            </div>
          </div>

          {/* Actions — primary only on mobile, all three on desktop */}
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" size="sm">Renew</Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Withdraw</Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Advice</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
