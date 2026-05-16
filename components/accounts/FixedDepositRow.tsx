import { Lock, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
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

        {/* Details */}
        <div className="min-w-0 flex-1">
          {/* Top row — rate / account no. on left, amounts on right */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-content-primary">
                {account.interestRate}% p.a.
                <span className="ml-1.5 font-normal text-content-secondary">
                  · {account.tenure}mo
                </span>
              </p>
              <p className="mt-0.5 font-mono text-xs text-content-secondary">
                {account.accountNumber}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-content-primary">
                {formatCurrency(account.principal)}
                <span className="mx-1 font-normal text-content-secondary">→</span>
                <span className="text-violet-600">{formatCurrency(account.maturityAmount)}</span>
              </p>
              <p className="mt-0.5 text-xs font-medium text-emerald-600">
                +{formatCurrency(account.maturityAmount - account.principal)} interest
              </p>
              <p className="mt-0.5 text-xs text-content-secondary">
                Matures {formatDate(account.maturityDate)}
              </p>
            </div>
          </div>

          {/* Badges — payout frequency + auto-renew */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
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

          {/* Progress */}
          <div className="mt-2.5">
            <ProgressBar value={progress} />
            <div className="mt-1 flex items-center justify-between text-[11px] text-content-secondary">
              <span>{account.tenureElapsed} of {account.tenure} months · {progress}%</span>
              <span className={monthsLeft <= 3 ? 'font-medium text-amber-600' : ''}>
                {monthsLeft} mo. left
              </span>
            </div>
          </div>

          {/* Row actions */}
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" size="sm">Renew</Button>
            <Button variant="ghost" size="sm">Withdraw</Button>
            <Button variant="ghost" size="sm">Advice</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
