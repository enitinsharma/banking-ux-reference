import { Lock, RefreshCw, X } from 'lucide-react';
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
        <p className="hidden text-sm font-semibold text-content-primary sm:block">
          {formatCurrency(account.principal)}
          <span className="mx-1 font-normal text-content-secondary">→</span>
          <span className="text-violet-600">{formatCurrency(account.maturityAmount)}</span>
        </p>
        <p className="hidden text-xs font-medium text-emerald-600 sm:block">
          +{formatCurrency(totalInterest)} interest
        </p>
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

  const divisor        = account.payoutFrequency === 'monthly' ? 12 : 4;
  const periodLabel    = account.payoutFrequency === 'monthly' ? 'mo' : 'qtr';
  const periodicPayout = Math.round((account.principal * account.interestRate) / 100 / divisor);
  const totalInterestPeriodic = account.maturityAmount - account.principal;

  return (
    <div className="text-right">
      <p className="hidden text-sm font-semibold text-content-primary sm:block">
        {formatCurrency(account.principal)}
        <span className="ml-1 text-xs font-normal text-content-secondary">principal</span>
      </p>
      <p className="hidden text-xs font-medium text-emerald-600 sm:block">
        {formatCurrency(periodicPayout)}/{periodLabel} · +{formatCurrency(totalInterestPeriodic)} total
      </p>
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
  const nearMaturity = monthsLeft <= 3;

  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <Lock className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Top row */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-content-primary">
                {account.interestRate}% p.a.
                <span className="ml-1.5 font-normal text-content-secondary">· {account.tenure}mo</span>
              </p>
              <p className="mt-0.5 font-mono text-xs text-content-secondary">
                {account.accountNumber}
              </p>
            </div>
            <AmountBlock account={account} />
          </div>

          {/* Badges */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {/* Payout frequency — desktop only */}
            <span className="hidden rounded-full border border-ui-border px-2 py-0.5 text-[11px] text-content-secondary sm:inline">
              {PAYOUT_LABEL[account.payoutFrequency]}
            </span>

            {/* Auto-renew chip — clickable toggle; shown on all breakpoints */}
            {account.autoRenew ? (
              <button
                type="button"
                title="Click to cancel auto-renew"
                className="flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <RefreshCw className="h-2.5 w-2.5" />
                Auto-renew
                <X className="h-2.5 w-2.5 opacity-60" />
              </button>
            ) : (
              // Offer to enable auto-renew when near maturity
              nearMaturity && (
                <button
                  type="button"
                  title="Enable auto-renew"
                  className="flex items-center gap-1 rounded-full border border-dashed border-violet-300 px-2 py-0.5 text-[11px] text-violet-500 transition-colors hover:bg-violet-50"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                  Enable auto-renew
                </button>
              )
            )}
          </div>

          {/* Progress */}
          <div className="mt-2.5">
            <ProgressBar value={progress} />
            <div className="mt-1 flex items-center justify-between text-[11px] text-content-secondary">
              <span className="hidden sm:inline">
                {account.tenureElapsed} of {account.tenure} months · {progress}%
              </span>
              <span className="sm:hidden">{progress}%</span>
              <span className={nearMaturity ? 'font-medium text-amber-600' : ''}>
                {monthsLeft} mo. left
              </span>
            </div>
          </div>

          {/* Contextual actions */}
          <div className="mt-3 flex gap-2">
            {/* Renew only when near maturity and auto-renew is off */}
            {nearMaturity && !account.autoRenew && (
              <Button variant="primary" size="sm">Renew</Button>
            )}
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Withdraw</Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Advice</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
