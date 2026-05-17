'use client';

import { Lock } from 'lucide-react';
import { formatCurrency, formatCurrencyCompact, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { FixedDepositAccount } from '@/types/account';

const PAYOUT_LABEL: Record<FixedDepositAccount['payoutFrequency'], string> = {
  monthly:     'Monthly payout',
  quarterly:   'Quarterly payout',
  on_maturity: 'Payout at maturity',
};

/* ── Toggle switch ────────────────────────────────────────── */
function Toggle({ checked, label }: { checked: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className={`relative h-4 w-7 rounded-full transition-colors ${checked ? 'bg-violet-500' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-3' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-content-secondary">{label}</span>
    </label>
  );
}

/* ── Progress bar ─────────────────────────────────────────── */
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

/* ── Amount block ─────────────────────────────────────────── */
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

/* ── Main row ─────────────────────────────────────────────── */
interface Props { account: FixedDepositAccount }

export function FixedDepositRow({ account }: Props) {
  const progress    = Math.round((account.tenureElapsed / account.tenure) * 100);
  const monthsLeft  = account.tenure - account.tenureElapsed;
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

          {/* Payout badge — desktop only */}
          <div className="mt-2 hidden sm:block">
            <span className="rounded-full border border-ui-border px-2 py-0.5 text-[11px] text-content-secondary">
              {PAYOUT_LABEL[account.payoutFrequency]}
            </span>
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

          {/* ── Renewal section ── */}
          <div className="mt-3 space-y-2">
            {/* Toggle — same for all FDs regardless of maturity stage */}
            <Toggle
              checked={!!account.autoRenew}
              label="Auto-renew on maturity"
            />

            {/* Contextual message — only shown near maturity */}
            {nearMaturity && (
              account.autoRenew ? (
                <p className="text-[11px] text-emerald-600">
                  Will renew automatically for {account.tenure} months on {formatDate(account.maturityDate)}
                </p>
              ) : (
                <p className="text-[11px] text-amber-600">
                  Amount will be credited to your savings account in {monthsLeft} month{monthsLeft !== 1 ? 's' : ''}
                </p>
              )
            )}

            {/* Secondary actions */}
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Withdraw</Button>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Advice</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
